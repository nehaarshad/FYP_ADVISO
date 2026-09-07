import findOffering from './offerCoursesInSameProgram.js';
import timeConflict from './timeConflict.js';
import helpingFunctions from './courseHelpingChecks.js';
import isElectiveCourse from './isElectiveCourse.js';
import clashes from './courseClashes.js';
const { describeClash } = clashes;
const { cleanCredits, hasLabComponent, offeringProgramName, offeringProgramId } = helpingFunctions;

function findAlternativeRoadmapCourse({
    roadmapCourses,
    offeredCourses,
    program,
    currentSemester,
    placedTimetables,
    placedNames,
    placedOfferingIds,
    excludeCourseName,
    excludeFYPCourses = true,
    maxCredits = 18,
    returnAllCandidates = false,
    originalClashingCourse = null  // ← NEW: The course that has the clash
}) {
    console.log(`   Finding alternative roadmap course...`);

    // Filter eligible courses
    const eligibleCourses = roadmapCourses.filter(c =>
        !c.isCompleted &&
        !c.isFailed &&
        !c.hasDGraded &&
        !c.isWithdrawn &&
        c.prerequisiteStatus === 'CLEAR' &&
        !placedNames.has(c.courseName.toLowerCase()) &&
        c.courseName !== excludeCourseName &&
        c.status === 'Pending' &&
        !(excludeFYPCourses && c.courseName.toLowerCase().includes('final year project'))
    );

    console.log(`    Found ${eligibleCourses.length} eligible courses`);

    if (eligibleCourses.length === 0) {
        console.log(`    ❌ No eligible courses found`);
        return returnAllCandidates ? { 
            best: null, 
            allCandidates: [],
            summary: { totalEligible: 0, available: 0, timeClashes: 0, notOffered: 0, alreadyPlaced: 0 }
        } : null;
    }

    // Sort by priority
    const sortedCourses = eligibleCourses.sort((a, b) => {
        const semA = a.semester === currentSemester ? 1 : 0;
        const semB = b.semester === currentSemester ? 1 : 0;
        if (semA !== semB) return semB - semA;

        const creditA = Math.abs(cleanCredits(a.creditHours || a.credits) - (maxCredits || 3));
        const creditB = Math.abs(cleanCredits(b.creditHours || b.credits) - (maxCredits || 3));
        if (creditA !== creditB) return creditA - creditB;

        const prereqA = (a.dependentCourses?.length || 0) > 0 ? 1 : 0;
        const prereqB = (b.dependentCourses?.length || 0) > 0 ? 1 : 0;
        if (prereqA !== prereqB) return prereqB - prereqA;

        const coreA = a.categoryName && !a.categoryName.toLowerCase().includes('elective') ? 1 : 0;
        const coreB = b.categoryName && !b.categoryName.toLowerCase().includes('elective') ? 1 : 0;
        return coreB - coreA;
    });

    // Process ALL courses and collect detailed results
    const allCandidates = [];
    const timeClashCandidates = [];
    const notOfferedCandidates = [];
    const alreadyPlacedCandidates = [];
    let bestCandidate = null;
    let bestScore = -1;

    for (const rc of sortedCourses) {
        console.log(`    Checking: ${rc.courseName} (${cleanCredits(rc.creditHours || rc.credits )} credits)`);

        const match = findOffering(
            rc.courseName,
            cleanCredits(rc.creditHours || rc.credits),
            offeredCourses,
            program,
            currentSemester,
            placedTimetables,
            {
                expectsLab: hasLabComponent(rc.creditHours),
                requiredCredits: cleanCredits(rc.creditHours)
            }
        );

        if (!match) {
            const reason = `"${rc.courseName}" is not offered this session.`;
            console.log(`      ❌ Not offered this session`);
            notOfferedCandidates.push({
                courseName: rc.courseName,
                originalCourseName: rc.courseName,
                credits: cleanCredits(rc.creditHours || rc.credits),
                semester: rc.semester,
                category: rc.categoryName,
                isElective: isElectiveCourse(rc),
                status: 'NOT_OFFERED',
                reason: reason,
                offering: null,
                program: null,
                programId: null,
                timeSlot: null,
                timetableDetails: [],
                batch: 'N/A',
                score: 0
            });
            continue;
        }

        let offering = null;
        if (match.offering) {
            offering = match.offering;
        } else if (match.courseName) {
            offering = match;
        } else if (match.isCombined && match.offering) {
            offering = match.offering;
        } else if (match.isElectiveMatch && match.offering) {
            offering = match.offering;
        }

        if (!offering) {
            console.log(`      ❌ No offering found in match object`);
            notOfferedCandidates.push({
                courseName: rc.courseName,
                originalCourseName: rc.courseName,
                credits: cleanCredits(rc.creditHours || rc.credits),
                semester: rc.semester,
                category: rc.categoryName,
                isElective: isElectiveCourse(rc),
                status: 'NO_OFFERING',
                reason: `No offering found for "${rc.courseName}"`,
                offering: null,
                program: null,
                programId: null,
                timeSlot: null,
                timetableDetails: [],
                batch: 'N/A',
                score: 0
            });
            continue;
        }

        if (placedOfferingIds.has(offering.id)) {
            console.log(`      ❌ Already placed`);
            alreadyPlacedCandidates.push({
                courseName: rc.courseName,
                originalCourseName: rc.courseName,
                credits: cleanCredits(rc.creditHours || rc.credits),
                semester: rc.semester,
                category: rc.categoryName,
                isElective: isElectiveCourse(rc),
                status: 'ALREADY_PLACED',
                reason: `This course is already in your schedule.`,
                offering: offering,
                program: offeringProgramName(offering),
                programId: offeringProgramId(offering),
                timeSlot: timeConflict.formatTimetable(offering.timetables || []),
                timetableDetails: (offering.timetables || []).map(t => ({
                    day: t.day || t.dayOfWeek,
                    startTime: t.startTime,
                    endTime: t.endTime,
                    room: t.room || t.venue || 'TBA',
                    instructor: t.instructor || t.teacher || 'TBA',
                    section: t.section || 'N/A'
                })),
                batch: offering.BatchModel?.batchName || 'N/A',
                score: 0
            });
            continue;
        }

        const timetables = offering.timetables || [];
        const hasClash = timeConflict.hasClash(timetables, placedTimetables);

        if (hasClash) {
            const clashNames = describeClash(timetables, placedTimetables) || 'another scheduled course';
            const clashSlots = timeConflict.formatTimetable(timetables);
            console.log(`      ❌ Time clash with: ${clashNames}`);

            // ✅ For time clash, also include which course it clashes with
            const clashDetails = [];
            for (const slot of timetables) {
                for (const placed of placedTimetables) {
                    if (timeConflict.slotsOverlap(slot, placed)) {
                        clashDetails.push({
                            courseName: placed.courseName || 'another scheduled course',
                            time: timeConflict.formatTimetable([placed]),
                            day: placed.day || placed.dayOfWeek,
                            startTime: placed.startTime,
                            endTime: placed.endTime
                        });
                    }
                }
            }

            timeClashCandidates.push({
                courseName: rc.courseName,
                originalCourseName: rc.courseName,
                credits: cleanCredits(rc.creditHours || rc.credits),
                semester: rc.semester,
                category: rc.categoryName,
                isElective: isElectiveCourse(rc),
                status: 'TIME_CLASH',
                reason: `Clashes with ${clashNames}`,
                clashesWith: clashNames,
                clashSlots: clashSlots,
                clashDetails: clashDetails,
                offering: offering,
                program: offeringProgramName(offering),
                programId: offeringProgramId(offering),
                timeSlot: timeConflict.formatTimetable(timetables),
                timetableDetails: timetables.map(t => ({
                    day: t.day || t.dayOfWeek,
                    startTime: t.startTime,
                    endTime: t.endTime,
                    room: t.room || t.venue || 'TBA',
                    instructor: t.instructor || t.teacher || 'TBA',
                    section: t.section || 'N/A'
                })),
                batch: offering.BatchModel?.batchName || 'N/A',
                score: 0
            });
            continue;
        }

        // ✅ AVAILABLE COURSE
        const credits = cleanCredits(rc.creditHours || rc.credits );
        
        // Calculate score for ranking
        const semScore = rc.semester === currentSemester ? 100 : Math.max(0, 80 - Math.abs(rc.semester - currentSemester) * 10);
        const creditScore = credits === 3 ? 30 : 20;
        const coreScore = rc.categoryName && !rc.categoryName.toLowerCase().includes('elective') ? 20 : 10;
        const prereqScore = (rc.dependentCourses?.length || 0) > 0 ? 15 : 0;
        const totalScore = semScore + creditScore + coreScore + prereqScore;

        console.log(`      ✅ AVAILABLE - Score: ${totalScore}`);

        const candidate = {
            courseName: rc.courseName,
            originalCourseName: rc.courseName,
            credits: credits,
            semester: rc.semester,
            category: rc.categoryName,
            isElective: isElectiveCourse(rc),
            status: 'AVAILABLE',
            reason: `All prerequisites cleared and no time conflicts.`,
            offering: offering,
            program: offeringProgramName(offering),
            programId: offeringProgramId(offering),
            timeSlot: timeConflict.formatTimetable(timetables),
            timetableDetails: timetables.map(t => ({
                day: t.day || t.dayOfWeek,
                startTime: t.startTime,
                endTime: t.endTime,
                room: t.room || t.venue || 'TBA',
                instructor: t.instructor || t.teacher || 'TBA',
                section: t.section || 'N/A'
            })),
            batch: offering.BatchModel?.batchName || 'N/A',
            score: totalScore,
            matchReasons: {
                sameSemester: rc.semester === currentSemester,
                creditMatch: credits === 3,
                isCore: !rc.categoryName?.toLowerCase().includes('elective'),
                hasDependents: (rc.dependentCourses?.length || 0) > 0
            }
        };

        allCandidates.push(candidate);

        // Track the best candidate
        if (totalScore > bestScore) {
            bestScore = totalScore;
            bestCandidate = candidate;
        }
    }

    // Log summary
    console.log(`\n   📋 ALTERNATIVE COURSES SUMMARY:`);
    console.log(`   Total eligible: ${eligibleCourses.length}`);
    console.log(`   Available: ${allCandidates.length}`);
    console.log(`   Time clashes: ${timeClashCandidates.length}`);
    console.log(`   Not offered: ${notOfferedCandidates.length}`);
    console.log(`   Already placed: ${alreadyPlacedCandidates.length}`);

    // Sort available by score (highest first)
    allCandidates.sort((a, b) => b.score - a.score);

    if (allCandidates.length > 0) {
        console.log(`\n   ✅ AVAILABLE ALTERNATIVES (sorted by score):`);
        allCandidates.forEach((c, idx) => {
            console.log(`     ${idx + 1}. ${c.courseName} (${c.credits} credits) - Score: ${c.score}`);
            console.log(`        Time: ${c.timeSlot}`);
            console.log(`        ${c.matchReasons?.sameSemester ? '✅ Same Semester' : '📅 Other Semester'}, ${c.matchReasons?.creditMatch ? '✅ 3 Credits' : `⚠️ ${c.credits} Credits`}`);
        });

        console.log(`\n   🏆 Best alternative: ${bestCandidate.courseName} (Score: ${bestCandidate.score})`);
        if (originalClashingCourse) {
            console.log(`   📌 Why this is the best match for "${originalClashingCourse}":`);
            console.log(`      - Same semester: ${bestCandidate.semester === currentSemester ? '✅ Yes' : '❌ No'}`);
            console.log(`      - Credits: ${bestCandidate.credits}`);
            console.log(`      - No time conflicts with your schedule`);
            console.log(`      - All prerequisites cleared`);
        }
    }

    if (timeClashCandidates.length > 0) {
        console.log(`\n   ❌ COURSES WITH TIME CLASHES:`);
        timeClashCandidates.forEach(c => {
            console.log(`     - ${c.courseName}: ${c.reason}`);
            if (c.clashDetails) {
                c.clashDetails.forEach(d => {
                    console.log(`        ↳ Conflicts with: ${d.courseName} at ${d.time}`);
                });
            }
        });
    }

    if (notOfferedCandidates.length > 0) {
        console.log(`\n   📌 COURSES NOT OFFERED:`);
        notOfferedCandidates.forEach(c => {
            console.log(`     - ${c.courseName}: ${c.reason}`);
        });
    }

    // Build the complete result
    const result = {
        best: bestCandidate,
        allCandidates: allCandidates,
        timeClashes: timeClashCandidates,
        notOffered: notOfferedCandidates,
        alreadyPlaced: alreadyPlacedCandidates,
        summary: {
            totalEligible: eligibleCourses.length,
            available: allCandidates.length,
            timeClashes: timeClashCandidates.length,
            notOffered: notOfferedCandidates.length,
            alreadyPlaced: alreadyPlacedCandidates.length
        },
        originalClashingCourse: originalClashingCourse,
        selectedAlternative: bestCandidate
    };

    if (returnAllCandidates) {
        return result;
    } else {
        return bestCandidate;
    }
}

export default findAlternativeRoadmapCourse;