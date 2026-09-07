import timeConflict from '../utils/timeConflict.js';
import findElectiveOffering from '../utils/findElectiveOffering.js';
import getElectiveType from '../utils/getElectiveType.js';
import isElectiveCourse from '../utils/isElectiveCourse.js';
import helpingFunctions from '../utils/courseHelpingChecks.js';
const {cleanCredits,offeringProgramId,offeringProgramName,hasLabComponent} =helpingFunctions
import assignPriorityFunctions from '../utils/assignPriorityToRecCourses.js';
const {getPriority} = assignPriorityFunctions;
import findOffering from '../utils/offerCoursesInSameProgram.js';
import findOfferingInOtherProgram from '../utils/offeredCoursesToOtherProgram.js';
import resolverFunctions from '../utils/suggestedCoursesResolvers.js'
const {addToSchedule,resolveNewCourseClash,resolveRetakeCourse,resolveCombinedCourseForNew} =resolverFunctions
const RESTRICTED_STATUSES = ['relegated', 'serious warning'];
import buildFinalResponse from '../utils/finalRecommdedCoursesResponse.js';

function generateRecommendations(ctx) {
    const startTime = Date.now();
    console.log('=== STARTING RECOMMENDATION GENERATION ===');
    console.log('Timestamp:', new Date().toISOString());

    const {
        student,
        degreeTranscript,
        studentStatus,
        suggestedCourses,
        offeredCourses,
        roadmapCourses: originalRoadmapCourses,
        allowedCredits,
        program,
        placedNames = new Set(),
        placedOfferingIds = new Set(),
        placedTimetables = [],
    } = ctx;

    console.log('\n--- INPUT SUMMARY ---');
    console.log(`Student: ${student.id} - Semester: ${student.currentSemester}`);
    console.log(`Program: ${program}`);
    console.log(`CGPA: ${degreeTranscript.currentCGPA}`);
    console.log(`Student Status: ${studentStatus}`);
    console.log(`Allowed Credits: ${allowedCredits}`);

    console.log('\n--- NORMALIZING DATA ---');
    const currentSemester = parseInt(student.currentSemester);
    const cgpa = parseFloat(degreeTranscript.currentCGPA) || 0;
    const statusLower = (studentStatus || '').toLowerCase();

    const roadmapCourses = originalRoadmapCourses.map(c => ({
        ...c,
        semester: parseInt(c.semester) || c.semester,
        prerequisiteStatus: c.prerequisiteStatus || 'CLEAR',
    }));

    const programMatch = offeredCourses.find(o => offeringProgramName(o) === program);
    const currentProgramId = programMatch?.ProgramModel?.id || null;
    console.log(`Program ID: ${currentProgramId}`);

    const isRestricted = cgpa < 2.0 || RESTRICTED_STATUSES.some(s => statusLower.includes(s));
    console.log(`\n--- RESTRICTED STATUS ---`);
    console.log(`Is Restricted: ${isRestricted}`);
    console.log(`CGPA: ${cgpa}, Status: ${statusLower}`);

    const fwdCourses = [
        ...(suggestedCourses.failedCourses || []).map(c => ({ ...c, __grade: 'F' })),
        ...(suggestedCourses.withdrawnCourses || []).map(c => ({ ...c, __grade: 'W' })),
        ...(suggestedCourses.dGradedCourses || []).map(c => ({ ...c, __grade: 'D' })),
    ];

    const recommendations = { critical: [], high: [], medium: [], low: [] };
    const specialRequests = [];
    let totalUsedCredits = 0;

    console.log('\n--- PROCESSING RETAKES (F/W/D) ---');

    const addToRecommendations = (course, priority, details) => {
        recommendations[priority].push({
            ...details,
            courseName: details.courseName || course.courseName,
            category: details.category || course.categoryName || null,
            originalCourseName: details.originalCourseName || course.courseName,
        });
    };

    const mandatoryRetakes = fwdCourses.filter(c => c.__grade === 'F' || c.__grade === 'W');
  console.log(`\nMandatory retakes (F/W): ${JSON.stringify(mandatoryRetakes)}`);
    for (const course of mandatoryRetakes) {
        console.log(`\n  Processing retake: ${course.courseName} ${course.creditHours} (${course.__grade})`);
        const resolved = resolveRetakeCourse({
            course, offeredCourses, roadmapCourses, currentSemester,
            currentProgramId, placedTimetables, placedNames, placedOfferingIds
        });

        const priority = course.__grade === 'F' ? 'critical' : 'high';
        addToRecommendations(course, priority, resolved);
        if (resolved.isOffered && resolved.credits > 0) totalUsedCredits += resolved.credits;

        console.log(`    → ${resolved.actionRequired} - ${resolved.courseName} (${resolved.credits} credits)`);
    }

    // Process ALL optional retakes 
    const optionalRetakes = fwdCourses.filter(c => c.__grade === 'D');
    for (const course of optionalRetakes) {
        console.log(`\n  Processing optional retake: ${course.courseName} (D)`);

        const resolved = resolveRetakeCourse({
            course, offeredCourses, roadmapCourses, currentSemester,
            currentProgramId, placedTimetables, placedNames, placedOfferingIds
        });

        addToRecommendations(course, 'medium', resolved);
        if (resolved.isOffered && resolved.credits > 0) totalUsedCredits += resolved.credits;
        console.log(`    → ${resolved.actionRequired} - ${resolved.courseName} (${resolved.credits} credits)`);
    }

    if (isRestricted) {
        console.log('\n--- RESTRICTED MODE COMPLETE ---');
        console.log(`Total credits: ${totalUsedCredits}/${allowedCredits}`);
        return buildFinalResponse(recommendations, totalUsedCredits, allowedCredits, specialRequests, suggestedCourses, roadmapCourses, offeredCourses, startTime, placedTimetables, placedNames, currentSemester, cgpa, studentStatus, degreeTranscript);
    }

    // Process new courses
    console.log('\n--- PROCESSING NEW COURSE CANDIDATES ---');
    //non reg before and clear preReqs
    const newCourseCandidates = roadmapCourses.filter(c =>
        !c.isCompleted && !c.isFailed && !c.hasDGraded && !c.isWithdrawn &&
        c.semester <= currentSemester &&
        c.prerequisiteStatus === 'CLEAR' &&
        !placedNames.has(c.courseName.toLowerCase())
    );

    console.log(`\nNew course candidates: ${newCourseCandidates.length}`);

    // Process each new course
    for (const rc of newCourseCandidates) {
        console.log(`\n--- Processing newCourseCandidate: ${JSON.stringify(rc)} ---`);

        const isElective = isElectiveCourse(rc);
        const credits = cleanCredits(rc.credits || rc.creditHours );

        if (isElective) {
            console.log(`   ELECTIVE DETECTED: ${rc.courseName}`);
            const electiveType = getElectiveType(rc.courseName);
            console.log(`    Type: "${electiveType}"`);

            const result = findElectiveOffering({
                courseName: rc.courseName,
                courseCredits: credits,  
                electiveType: electiveType,
                offeredCourses,
                program,
                currentSemester,
                placedTimetables
            });

            if (result.found) {
                const bestMatch = result.options && result.options.length > 0 
                    ? result.options[0] 
                    : null;
                
                if (!bestMatch) {
                    console.log(`  No valid elective options found`);
                    // Add as special request
                    specialRequests.push({
                        courseName: rc.courseName,
                        reason: `No ${rc.categoryName || 'elective'} courses available`,
                        message: `No courses found for "${rc.courseName}". Consult advisor for alternative electives.`
                    });
                    const priority = getPriority(rc);
                    addToRecommendations(rc, priority, {
                        courseId: null,
                        courseName: rc.courseName,
                        credits,
                        isOffered: false,
                        offeredProgram: null,
                        offeredProgramId: null,
                        timeSlot: null,
                        timetableDetails: [],
                        batch: 'N/A',
                        program: 'N/A',
                        actionRequired: 'NO_ELECTIVE_AVAILABLE',
                        substituteCourses: [],
                        hasLab: false,
                        labDetails: null,
                        isElective: true,
                        reason: `No ${rc.categoryName || 'elective'} courses available this session. Submit special request.`
                    });
                    continue;
                }

                console.log(`   Found ${result.options?.length || 0} elective options`);
                console.log(`    Best: ${bestMatch.courseName} (Score: ${bestMatch.totalScore})`);
                console.log(`    Credits: ${bestMatch.credits}`);
                console.log(`    Match: ${bestMatch.matchReason}`);

                if (bestMatch.offering) {
                    addToSchedule(bestMatch.offering, placedTimetables, placedNames, placedOfferingIds, bestMatch.courseName);
                }

                const priority = getPriority(rc);
                const isCreditMismatch = bestMatch.credits !== credits;
                addToRecommendations(rc, priority, {
                    // Best match details
                    courseId: bestMatch.offering?.id || null,
                    courseName: bestMatch.courseName,
                    originalCourseName: rc.courseName,
                    credits: bestMatch.credits,
                    isOffered: true,
                    offeredProgram: bestMatch.program,
                    offeredProgramId: bestMatch.programId,
                    timeSlot: bestMatch.timeSlot,
                    timetableDetails: bestMatch.timetableDetails || [],
                    batch: bestMatch.batch || 'N/A',
                    program: bestMatch.program,
                    actionRequired: isCreditMismatch ? 'ELECTIVE_CREDIT_MISMATCH' : 'ELECTIVE_FULFILLED',
                    substituteCourses: [],
                    hasLab: bestMatch.isCombined || false,
                    labDetails: bestMatch.labDetails || null,
                    isElective: true,
                    electiveType: electiveType,
                    isOtherSemester: !bestMatch.isSameSemester,
                    isOtherProgram: !bestMatch.isSameProgram,
                    needsReview: !(bestMatch.isSameProgram && bestMatch.isSameSemester) || isCreditMismatch,
                    
                    electiveOptions: result.options.map(opt => ({
                        courseName: opt.courseName,
                        credits: opt.credits,
                        program: opt.program,
                        semester: opt.semester,
                        isSameProgram: opt.isSameProgram,
                        isSameSemester: opt.isSameSemester,
                        exactCredit: opt.exactCredit,
                        totalScore: opt.totalScore,
                        matchReason: opt.matchReason,
                        timeSlot: opt.timeSlot,
                        timetableDetails: opt.timetableDetails || [],
                        batch: opt.batch,
                        labDetails: opt.labDetails,
                        offering: opt.offering,
                        actionRequired: 'ELECTIVE_OPTION',
                        isElective: true
                    })),
                    
                    categorizedOptions: result.categorizedOptions || {
                        bestMatch: null,
                        sameProgramSameSemester: [],
                        sameProgramOtherSemester: [],
                        otherProgramSameSemester: [],
                        otherProgramOtherSemester: []
                    },
                    
                    totalOptions: result.options?.length || 0,
                    recommendedAction: 'SELECT_ELECTIVE',
                    creditMismatch: isCreditMismatch,
                    requiredCredits: credits,
                    availableCredits: bestMatch.credits,
                    reason: isCreditMismatch
                        ? `Elective requirement "${rc.courseName}" fulfilled by: ${bestMatch.courseName} (${bestMatch.credits}/${credits} credits - ⚠️ Credit mismatch!) ${result.options?.length > 1 ? `(${result.options.length} options available)` : ''}`
                        : `Elective requirement "${rc.courseName}" fulfilled by: ${bestMatch.courseName} ${result.options?.length > 1 ? `(${result.options.length} options available)` : ''}`
                });

                totalUsedCredits += bestMatch.credits;
                console.log(`   ADDED - Total credits: ${totalUsedCredits}/${allowedCredits}`);
                continue;
            }

            console.log(`   No elective found for: ${rc.courseName}`);
            specialRequests.push({
                courseName: rc.courseName,
                reason: `No ${rc.categoryName || 'elective'} courses available`,
                message: `No courses found for "${rc.courseName}". Consult advisor for alternative electives.`
            });

            const priority = getPriority(rc);
            addToRecommendations(rc, priority, {
                courseId: null,
                courseName: rc.courseName,
                credits,
                isOffered: false,
                offeredProgram: null,
                offeredProgramId: null,
                timeSlot: null,
                timetableDetails: [],
                batch: 'N/A',
                program: 'N/A',
                actionRequired: 'NO_ELECTIVE_AVAILABLE',
                substituteCourses: [],
                hasLab: false,
                labDetails: null,
                isElective: true,
                reason: `No ${rc.categoryName || 'elective'} courses available this session. Submit special request.`
            });
            continue;
        }

        // Handle non-elective courses
        console.log(`   Looking for offering: ${rc.courseName}`);
        const match = findOffering(rc.courseName, cleanCredits(rc.credits),offeredCourses, program, currentSemester, placedTimetables, {
            expectsLab: hasLabComponent(rc.credits),
            requiredCredits: credits
        });

        // --- Case: No Offering Found ---
        if (!match) {
            console.log(`   No offering found for: ${rc.courseName}`);

            let substitute = findOfferingInOtherProgram(
                rc.courseName,
                cleanCredits(rc.credits),
                offeredCourses,
                program,
                currentProgramId, 
                currentSemester,
                placedTimetables,
                {
                    expectsLab: hasLabComponent(rc.credits),
                    requiredCredits: credits
                }
            );

            if (substitute) {
                // Handle combined course
                if (substitute.isCombined) {
                  console.log(`  COMBINED COURSE DETECTED`);
            console.log(`    Lecture: ${substitute.offering.courseName}`);
            console.log(`    Lab: ${substitute.labOffering.courseName}`);

            const result = resolveCombinedCourseForNew({
                rc,
                substitute,
                offeredCourses,
                currentSemester,
                currentProgramId,
                placedTimetables,
                placedNames,
                placedOfferingIds,
                program,
                roadmapCourses
            });

            if (result) {
                if (result.labClash) {
                    console.log(`   LAB CLASH: ${result.clashSlots}${result.clashesWith ? ` (with ${result.clashesWith})` : ''}`);
                    console.log(`    Credits: ${result.credits} (Original: ${result.originalCredits})`);
                    if (result.substituteDetails) {
                        console.log(`    Substitute: ${result.substituteDetails.courseName} (${result.substituteDetails.credits} credits)`);
                    }
                }

                const priority = getPriority(rc);
                addToRecommendations(rc, priority, result);
                if (result.credits > 0) totalUsedCredits += result.credits;
                console.log(`   ADDED - Total credits: ${totalUsedCredits}/${allowedCredits}`);
            }
            continue;
                }
                // Handle lab missing
                else if (substitute.isLabMissing) {
            const offering = substitute.offering;

            if (placedOfferingIds.has(offering.id)) {
                console.log(`   SKIPPING - Already placed (ID: ${offering.id})`);
                continue;
            }
            
if (timeConflict.hasClash(offering.timetables, placedTimetables)) {
    const result = resolveNewCourseClash({
        rc, offering, offeredCourses, program, currentSemester,
        placedTimetables, placedNames, placedOfferingIds, roadmapCourses,
        requiredCredits: credits, lectureOnly: false
    });

    // Add the clash record (so we know why it was skipped)
        if (result.clashRecord) {
            const priority = 'low';  // Low priority because it's not suggested
            addToRecommendations(rc, priority, {
                ...result.clashRecord,
                isNotSuggested: true,
                notSuggestedReason: 'TIME_CLASH',
                priority: priority
            });
            console.log(`  Recorded clash: ${result.clashRecord.courseName} → NOT SUGGESTED (Time Clash)`);
        }

    //  Add the alternative (if found)
    if (result.alternative) {
        const priority = 'high';  // High priority for alternative
        addToRecommendations(rc, priority, result.alternative);
        totalUsedCredits += result.alternative.credits;
        console.log(`  ADDED ALTERNATIVE - Total credits: ${totalUsedCredits}/${allowedCredits}`);
    } else {
        console.log(`  No alternative found for ${rc.courseName}`);
    }

    continue;
}

            addToSchedule(offering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
            const lecCredits = cleanCredits(offering.credits);

            const priority = getPriority(rc);
            addToRecommendations(rc, priority, {
                courseId: offering.id,
                courseName: offering.courseName,
                originalCourseName: rc.courseName,
                credits: lecCredits,
                isOffered: true,
                offeredProgram: offeringProgramName(offering),
                offeredProgramId: offeringProgramId(offering),
                timeSlot: timeConflict.formatTimetable(offering.timetables),
                timetableDetails: offering.timetables.map(t => ({
                    day: t.day || t.dayOfWeek,
                    startTime: t.startTime,
                    endTime: t.endTime,
                    room: t.room || t.venue || 'TBA',
                    instructor: t.instructor || t.teacher || 'TBA',
                    section: t.section || 'N/A'
                })),
                batch: offering.BatchModel?.batchName || 'N/A',
                program: offeringProgramName(offering),
                actionRequired: 'LAB_NOT_OFFERED',
                substituteCourses: [],
                hasLab: false,
                labDetails: null,
                isElective: false,
                lostLabCredits: Math.max(0, credits - lecCredits),
                reason: `Per your roadmap, "${rc.courseName}" should include a lab, but only the lecture is offered this session. Registered lecture only (${lecCredits} credit hour(s)). Submit a request to the coordinator to offer the lab component.`
            });

            totalUsedCredits += lecCredits;
            console.log(`   ADDED (LAB MISSING) - Total credits: ${totalUsedCredits}/${allowedCredits}`);
            continue;
        }
                // Handle single offering
                else {
                    // Handle single offering
        const offering = substitute.offering;

        if (placedOfferingIds.has(offering.id)) {
            console.log(`  ⏭️ SKIPPING - Already placed (ID: ${offering.id})`);
            continue;
        }

        if (timeConflict.hasClash(offering.timetables, placedTimetables)) {
            const result = resolveNewCourseClash({
                rc, offering, offeredCourses, program, currentSemester,
                placedTimetables, placedNames, placedOfferingIds, roadmapCourses,
                requiredCredits: credits, lectureOnly: false
            });
            const priority = getPriority(rc);
            addToRecommendations(rc, priority, result);
            if (result.alternative && result.alternative.credits > 0) totalUsedCredits += result.alternative.credits;
            console.log(`  ${result.actionRequired === 'TIME_CLASH_SKIPPED' ? 'RECORDED (unresolved clash)' : ' ADDED SUBSTITUTE'} - Total credits: ${totalUsedCredits}/${allowedCredits}`);
            continue;
        }

        const offeringCredits = cleanCredits(credits);

        addToSchedule(offering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);

        const priority = getPriority(rc);
        addToRecommendations(rc, priority, {
            courseId: offering.id,
            courseName: offering.courseName,
            originalCourseName: rc.courseName,
            credits: offeringCredits,
            isOffered: true,
            offeredProgram: offeringProgramName(offering),
            offeredProgramId: offeringProgramId(offering),
            timeSlot: timeConflict.formatTimetable(offering.timetables),
            timetableDetails: offering.timetables.map(t => ({
                day: t.day || t.dayOfWeek,
                startTime: t.startTime,
                endTime: t.endTime,
                room: t.room || t.venue || 'TBA',
                instructor: t.instructor || t.teacher || 'TBA',
                section: t.section || 'N/A'
            })),
            batch: offering.BatchModel?.batchName || 'N/A',
            program: offeringProgramName(offering),
            actionRequired: 'NEW',
            substituteCourses: [],
            hasLab: false,
            labDetails: null,
            isElective: false,
            reason: `New roadmap course for your current semester.`
        });

        totalUsedCredits += offeringCredits;
        console.log(`  ADDED - Total credits: ${totalUsedCredits}/${allowedCredits}`);
                }
            } else {
                specialRequests.push({
                    courseName: rc.courseName,
                    reason: 'Course not offered this session',
                    message: `"${rc.courseName}" is not offered this session. Submit an application requesting the coordinator offer it.`,
                });

                const priority = getPriority(rc);
                addToRecommendations(rc, priority, {
                    courseId: null,
                    courseName: rc.courseName,
                    credits: credits,
                    isOffered: false,
                    offeredProgram: null,
                    offeredProgramId: null,
                    timeSlot: null,
                    timetableDetails: [],
                    batch: 'N/A',
                    program: 'N/A',
                    actionRequired: 'REQUEST_SPECIAL_OFFERING',
                    substituteCourses: [],
                    hasLab: false,
                    labDetails: null,
                    isElective: false,
                    reason: `"${rc.courseName}" is not offered this session. Submit special offering request.`
                });
                continue;
            }
        }
        // Handle combined course
        if (match.isCombined) {
            console.log(`  COMBINED COURSE DETECTED`);
            console.log(`    Lecture: ${match.offering.courseName}`);
            console.log(`    Lab: ${match.labOffering.courseName}`);

            const result = resolveCombinedCourseForNew({
                rc,
                match,
                offeredCourses,
                currentSemester,
                currentProgramId,
                placedTimetables,
                placedNames,
                placedOfferingIds,
                program,
                roadmapCourses
            });

            if (result) {
                if (result.labClash) {
                    console.log(`  ⚠️ LAB CLASH: ${result.clashSlots}${result.clashesWith ? ` (with ${result.clashesWith})` : ''}`);
                    console.log(`    Credits: ${result.credits} (Original: ${result.originalCredits})`);
                    if (result.substituteDetails) {
                        console.log(`    Substitute: ${result.substituteDetails.courseName} (${result.substituteDetails.credits} credits)`);
                    }
                }

                const priority = getPriority(rc);
                addToRecommendations(rc, priority, result);
                if (result.credits > 0) totalUsedCredits += result.credits;
                console.log(`  ✅ ADDED - Total credits: ${totalUsedCredits}/${allowedCredits}`);
            }
            continue;
        }
        if (match.isLabMissing) {
            const offering = match.offering;

            if (placedOfferingIds.has(offering.id)) {
                console.log(`  ⏭️ SKIPPING - Already placed (ID: ${offering.id})`);
                continue;
            }
            if (timeConflict.hasClash(offering.timetables, placedTimetables)) {
                const result = resolveNewCourseClash({
                    rc, offering, offeredCourses, program, currentSemester,
                    placedTimetables, placedNames, placedOfferingIds, roadmapCourses,
                    requiredCredits: credits, lectureOnly: true
                });
                const priority = getPriority(rc);
                addToRecommendations(rc, priority, result);
                if (result.alternative && result.alternative.credits > 0) totalUsedCredits += result.alternative.credits;
                console.log(`  ${result.actionRequired === 'TIME_CLASH_SKIPPED' ? '⚠️ RECORDED (unresolved clash)' : '✅ ADDED SUBSTITUTE'} - Total credits: ${totalUsedCredits}/${allowedCredits}`);
                continue;
            }

            addToSchedule(offering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
            const lecCredits = cleanCredits(offering.credits);

            const priority = getPriority(rc);
            addToRecommendations(rc, priority, {
                courseId: offering.id,
                courseName: offering.courseName,
                originalCourseName: rc.courseName,
                credits: lecCredits,
                isOffered: true,
                offeredProgram: offeringProgramName(offering),
                offeredProgramId: offeringProgramId(offering),
                timeSlot: timeConflict.formatTimetable(offering.timetables),
                timetableDetails: offering.timetables.map(t => ({
                    day: t.day || t.dayOfWeek,
                    startTime: t.startTime,
                    endTime: t.endTime,
                    room: t.room || t.venue || 'TBA',
                    instructor: t.instructor || t.teacher || 'TBA',
                    section: t.section || 'N/A'
                })),
                batch: offering.BatchModel?.batchName || 'N/A',
                program: offeringProgramName(offering),
                actionRequired: 'LAB_NOT_OFFERED',
                substituteCourses: [],
                hasLab: false,
                labDetails: null,
                isElective: false,
                lostLabCredits: Math.max(0, credits - lecCredits),
                reason: `Per your roadmap, "${rc.courseName}" should include a lab, but only the lecture is offered this session. Registered lecture only (${lecCredits} credit hour(s)). Submit a request to the coordinator to offer the lab component.`
            });

            totalUsedCredits += lecCredits;
            console.log(`   ADDED (LAB MISSING) - Total credits: ${totalUsedCredits}/${allowedCredits}`);
            continue;
        }

        // Handle single offering
        const offering = match.offering;

        if (placedOfferingIds.has(offering.id)) {
            console.log(`  ⏭️ SKIPPING - Already placed (ID: ${offering.id})`);
            continue;
        }

        if (timeConflict.hasClash(offering.timetables, placedTimetables)) {
            const result = resolveNewCourseClash({
                rc, offering, offeredCourses, program, currentSemester,
                placedTimetables, placedNames, placedOfferingIds, roadmapCourses,
                requiredCredits: credits, lectureOnly: false
            });
            const priority = getPriority(rc);
            addToRecommendations(rc, priority, result);
            if (result.alternative && result.alternative.credits > 0) totalUsedCredits += result.alternative.credits;
            console.log(`  ${result.actionRequired === 'TIME_CLASH_SKIPPED' ? '⚠️ RECORDED (unresolved clash)' : '✅ ADDED SUBSTITUTE'} - Total credits: ${totalUsedCredits}/${allowedCredits}`);
            continue;
        }

        const offeringCredits = cleanCredits(credits);

        addToSchedule(offering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);

        const priority = getPriority(rc);
        addToRecommendations(rc, priority, {
            courseId: offering.id,
            courseName: offering.courseName,
            originalCourseName: rc.courseName,
            credits: offeringCredits,
            isOffered: true,
            offeredProgram: offeringProgramName(offering),
            offeredProgramId: offeringProgramId(offering),
            timeSlot: timeConflict.formatTimetable(offering.timetables),
            timetableDetails: offering.timetables.map(t => ({
                day: t.day || t.dayOfWeek,
                startTime: t.startTime,
                endTime: t.endTime,
                room: t.room || t.venue || 'TBA',
                instructor: t.instructor || t.teacher || 'TBA',
                section: t.section || 'N/A'
            })),
            batch: offering.BatchModel?.batchName || 'N/A',
            program: offeringProgramName(offering),
            actionRequired: 'NEW',
            substituteCourses: [],
            hasLab: false,
            labDetails: null,
            isElective: false,
            reason: `New roadmap course for your current semester.`
        });

        totalUsedCredits += offeringCredits;
        console.log(`  ADDED - Total credits: ${totalUsedCredits}/${allowedCredits}`);
    }

    return buildFinalResponse(recommendations, totalUsedCredits, allowedCredits, specialRequests, suggestedCourses, roadmapCourses, offeredCourses, startTime, placedTimetables, placedNames, currentSemester, cgpa, studentStatus, degreeTranscript, true);
}


export default  generateRecommendations ;
