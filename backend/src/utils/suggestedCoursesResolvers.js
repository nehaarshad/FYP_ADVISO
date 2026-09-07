import helpingFunctions from './courseHelpingChecks.js'
import clashes from './courseClashes.js'
const {describeClash} = clashes
const  {cleanCredits,offeringProgramId,offeringProgramName,creditsOf,hasLabComponent} = helpingFunctions
import timeConflict from './timeConflict.js';
import findOffering from './offerCoursesInSameProgram.js';
import findOfferingInOtherProgram from './offeredCoursesToOtherProgram.js';
import findElectiveSubstitute from './findElectiveSubstitute.js';
import findAlternativeRoadmapCourse from './findMoreCoursesToCompleteAllowedCourses.js';
import findCombinedCourseAlternatives from './findAlternateLaborLecToOtherProgram.js';
const { findAlternateLabInOtherProgram,findSecondAlternateLab,findAlternateLectureInOtherProgram } = findCombinedCourseAlternatives; 
const tagTimetables = (timetables, courseName) => (timetables || []).map(t => ({ ...t, courseName }));

const addToSchedule = (offering, placedTimetables, placedNames, placedOfferingIds, courseName) => {
    if (offering) {
        console.log(`  📌 ADDED TO SCHEDULE: ${courseName} (ID: ${offering.id})`);
        console.log(`     Timetables: ${JSON.stringify(offering.timetables)}`);
        placedTimetables.push(...tagTimetables(offering.timetables, courseName || offering.courseName));
        placedNames.add(courseName?.toLowerCase());
        placedOfferingIds.add(offering.id);
    }
};

const createResolution = (action, course, offering, reason, substituteCourses = []) => {
    return {
        courseId: course?.id || null,
        courseName: offering?.courseName || course.courseName,
        credits: cleanCredits(course.creditHours || offering?.credits ),
        category: course.category || null,
        isOffered: !!offering,
        offeredProgram: offering ? offeringProgramName(offering) : null,
        offeredProgramId: offering ? offeringProgramId(offering) : null,
        timeSlot: offering ? timeConflict.formatTimetable(offering.timetables) : null,
        timetableDetails: offering?.timetables?.map(t => ({
            day: t.day || t.dayOfWeek,
            startTime: t.startTime,
            endTime: t.endTime,
            room: t.room || t.venue || 'TBA',
            instructor: t.instructor || t.teacher || 'TBA',
            section: t.section || 'N/A'
        })) || [],
        batch: offering?.BatchModel?.batchName || 'N/A',
        program: offering ? offeringProgramName(offering) : 'N/A',
        actionRequired: action,
        substituteCourses,
        reason,
        hasLab: false,
        labDetails: null
    };
};

const createCombinedResolution = (action, lecture, lab, credits, course, reason, extra = {}) => {
    const base = {
        courseId: lecture?.id || null,
        courseName: lecture ? `${lecture.courseName} + Lab` : course.courseName,
        credits: credits,
        category: course.category || null,
        isOffered: !!lecture,
        offeredProgram: lecture ? offeringProgramName(lecture) : null,
        offeredProgramId: lecture ? offeringProgramId(lecture) : null,
        timeSlot: lecture && lab ? timeConflict.formatTimetable([...lecture.timetables, ...lab.timetables]) : null,
        timetableDetails: lecture && lab ? {
            lecture: lecture.timetables.map(t => ({ ...t, type: 'Lecture' })),
            lab: lab.timetables.map(t => ({ ...t, type: 'Lab' }))
        } : [],
        batch: lecture?.BatchModel?.batchName || 'N/A',
        program: lecture ? offeringProgramName(lecture) : 'N/A',
        actionRequired: action,
        substituteCourses: [],
        reason,
        hasLab: true,
        labProgram: lab ? offeringProgramName(lab) : null,
        labProgramId: lab ? offeringProgramId(lab) : null,
        ...extra
    };

    if (lab && base.timetableDetails && !Array.isArray(base.timetableDetails)) {
        base.labDetails = {
            courseName: lab.courseName,
            program: offeringProgramName(lab),
            timetables: lab.timetables
        };
    }

    return base;
};

function resolveRetakeCourse({ course, offeredCourses, roadmapCourses, currentSemester, currentProgramId, placedTimetables, placedNames, placedOfferingIds }) {
  
    // already recommended
    if (placedNames.has(course.courseName.toLowerCase())) {
        return createResolution('ALREADY_PLACED', course, null, `"${course.courseName}" already placed in your schedule.`);
    }

    const match = findOffering(course.courseName,cleanCredits(course.creditHours), offeredCourses, currentProgramId, currentSemester, placedTimetables, {
        expectsLab: hasLabComponent(course.creditHours),
        requiredCredits: cleanCredits(course.creditHours)
    });

    //submit special request form case
    if (!match) {
        return createResolution('REQUEST_SPECIAL_OFFERING', course, null, `"${course.courseName}" is not offered this session. Submit an application requesting the coordinator offer it.`);
    }

    if (match.isCombined) {
        return resolveCombinedCourse({ course, match, offeredCourses, roadmapCourses, currentSemester, currentProgramId, placedTimetables, placedNames, placedOfferingIds });
    }

    if (match.isLabMissing) {
        const offering = match.offering;

        if (placedOfferingIds.has(offering.id)) {
            return createResolution('DUPLICATE_OFFERING', course, offering, `"${course.courseName}" already placed.`);
        }
        if (timeConflict.hasClash(offering.timetables, placedTimetables)) {
            const clashNames = describeClash(offering.timetables, placedTimetables) || 'other required courses';
            return createResolution('UNRESOLVED_CLASH', course, offering, `"${course.courseName}" (lecture-only offering) clashes with ${clashNames}. Consult your advisor.`);
        }

        addToSchedule(offering, placedTimetables, placedNames, placedOfferingIds, course.courseName);
        return createResolution(
            'LAB_NOT_OFFERED',
            course,
            offering,
            `"${course.courseName}" is offered as lecture only this session — per your roadmap it should include a lab. Registered lecture only (${cleanCredits(offering.credits)} credit hour(s)). Submit a request to the coordinator to offer the lab component.`
        );
    }

    const offering = match.offering;

    if (placedOfferingIds.has(offering.id)) {
        return createResolution('DUPLICATE_OFFERING', course, offering, `"${course.courseName}" already placed.`);
    }

    if (!timeConflict.hasClash(offering.timetables, placedTimetables)) {
        addToSchedule(offering, placedTimetables, placedNames, placedOfferingIds, course.courseName);
        return createResolution('RETAKE', course, offering, `Retake required. ${offering.courseName} is offered this session without time conflicts.`);
    }

    const clashNamesAtOffering = describeClash(offering.timetables, placedTimetables) || 'other required courses';

    const altMatch = findOfferingInOtherProgram(course.courseName, offeredCourses, currentProgramId);
    if (altMatch && !timeConflict.hasClash(altMatch.offering.timetables, placedTimetables)) {
        addToSchedule(altMatch.offering, placedTimetables, placedNames, placedOfferingIds, course.courseName);
        return createResolution('RETAKE_OTHER_PROGRAM', course, altMatch.offering, `"${course.courseName}" clashed with ${clashNamesAtOffering} in your program's section — registered "${altMatch.offering.courseName}" under ${offeringProgramName(altMatch.offering)} program instead.`);
    }

    const substitute = findElectiveSubstitute({
        roadmapCourses, offeredCourses, currentSemester, placedTimetables,
        excludeNames: placedNames, excludeOfferingIds: placedOfferingIds,
        failedCourseCategory: course.category, program: currentProgramId
    });

    if (substitute) {
        if (placedNames.has(substitute.courseName.toLowerCase())) {
            return createResolution('SUBSTITUTE_UNAVAILABLE', course, null, `Could not substitute "${course.courseName}" - recommended substitute already placed.`);
        }
        addToSchedule(substitute.offering, placedTimetables, placedNames, placedOfferingIds, substitute.courseName);
        return createResolution('SUBSTITUTE', course, substitute.offering, `"${course.courseName}" clashes with ${clashNamesAtOffering}. Substituted with "${substitute.offering.courseName}" from your roadmap.`, [substitute.courseName]);
    }

    return createResolution('UNRESOLVED_CLASH', course, offering, `"${course.courseName}" (offered as "${offering.courseName}") clashes with ${clashNamesAtOffering}. No alternate-program section or clash-free elective substitute found — consult your advisor.`);
}

function resolveCombinedCourse({ course, match, offeredCourses, currentProgramId, placedTimetables, placedNames, placedOfferingIds }) {
    const lectureOffering = match.offering;
    const labOffering = match.labOffering;
   const totalCredits = cleanCredits(course.creditHours);
    console.log(`\nPROCESSING COMBINED COURSE: in resolveCombinedCourse ${course.courseName}${course.creditHours} ${totalCredits}`);

    if (placedOfferingIds.has(lectureOffering.id) || placedOfferingIds.has(labOffering.id)) {
        return createCombinedResolution('DUPLICATE_OFFERING', lectureOffering, labOffering, totalCredits, course, `"${course.courseName}" already placed.`);
    }

    const lectureClash = timeConflict.hasClash(lectureOffering.timetables, placedTimetables);
    console.log(`  Lecture clash: ${lectureClash ? '❌ CLASH' : '✅ Clear'}`);
    const labClash = timeConflict.hasClash(labOffering.timetables, placedTimetables);
    console.log(`  Lab clash: ${labClash ? '❌ CLASH' : '✅ Clear'}`);

    if (!lectureClash && !labClash) {
        addToSchedule(lectureOffering, placedTimetables, placedNames, placedOfferingIds, course.courseName);
        addToSchedule(labOffering, placedTimetables, placedNames, placedOfferingIds, course.courseName);
        return createCombinedResolution('RETAKE_WITH_LAB', lectureOffering, labOffering, totalCredits, course, `Retake required with lab. Both lecture and lab available without time conflicts.`);
    }

    if (labClash && !lectureClash) {
        console.log(`  ⚠️ Lab clash detected for ${course.courseName}`);
        const labClashNames = describeClash(labOffering.timetables, placedTimetables) || 'another scheduled course';
        console.log(`    Lab clashes with: ${labClashNames} (${timeConflict.formatTimetable(labOffering.timetables)})`);
        const altLab = findAlternateLabInOtherProgram(offeredCourses, course.courseName, currentProgramId, placedTimetables);
       console.log(`  Alternate lab found: ${altLab ? altLab.courseName : 'None'}`);
        if (altLab) {
            addToSchedule(lectureOffering, placedTimetables, placedNames, placedOfferingIds, course.courseName);
            addToSchedule(altLab, placedTimetables, placedNames, placedOfferingIds, course.courseName);
            return createCombinedResolution('LAB_CROSS_PROGRAM', lectureOffering, altLab, totalCredits, course, `Lab clashed with ${labClashNames} in your program — lecture stays in your program, lab moved to ${offeringProgramName(altLab)} program.`);
        }

        addToSchedule(lectureOffering, placedTimetables, placedNames, placedOfferingIds, course.courseName);
        return createCombinedResolution('LAB_CLASH_WARNING', lectureOffering, labOffering, totalCredits, course, `Lab clashes with ${labClashNames} (${timeConflict.formatTimetable(labOffering.timetables)}). No alternate section found. Credits excluded.`, { clashSlots: timeConflict.formatTimetable(labOffering.timetables), clashesWith: labClashNames, originalCredits: totalCredits, labClash: true });
    }

   if (!labClash && lectureClash) {
    console.log(`  Lecture clash detected for ${course.courseName}`);
    const lectureClashNames = describeClash(lectureOffering.timetables, placedTimetables) || 'another scheduled course';
    console.log(`    Lecture clashes with: ${lectureClashNames} (${timeConflict.formatTimetable(lectureOffering.timetables)})`);
    
    const altLecture = findAlternateLectureInOtherProgram(offeredCourses, course.courseName, currentProgramId, placedTimetables);
    console.log(`  Alternate lecture found: ${altLecture ? altLecture.courseName : 'None'}`);
    
    if (altLecture && !timeConflict.hasClash(altLecture.timetables, placedTimetables)) {
        console.log(`  Found alternate lecture in ${offeringProgramName(altLecture)} program - No clash`);
        console.log(`    Lecture time: ${timeConflict.formatTimetable(altLecture.timetables)}`);
        
        // Add both: alternate lecture + original lab
        addToSchedule(altLecture, placedTimetables, placedNames, placedOfferingIds, course.courseName);
        addToSchedule(labOffering, placedTimetables, placedNames, placedOfferingIds, course.courseName);
        
        return createCombinedResolution('LECTURE_CROSS_PROGRAM', altLecture, labOffering, totalCredits, course, 
            ` Lecture clashed with ${lectureClashNames} in your program — lecture moved to ${offeringProgramName(altLecture)} program, lab stays in your program. No clashes found.`,
            {
                creditsIncluded: true,
                crossProgram: true,
                lectureClashResolved: true,
                originalLecture: lectureOffering.courseName,
                alternateLecture: altLecture.courseName,
                alternateLectureProgram: offeringProgramName(altLecture)
            }
        );
    }
    
    console.log(`  No alternate lecture found in other programs (or all clash)`);

    let reason = `⚠️ LECTURE CLASH UNRESOLVED: Lecture component of "${course.courseName}" clashes with ${lectureClashNames} at ${timeConflict.formatTimetable(lectureOffering.timetables)}.`;
    
    if (altLecture) {
        const lecProg = offeringProgramName(altLecture);
        const lecClashInOther = timeConflict.hasClash(altLecture.timetables, placedTimetables);
        if (lecClashInOther) {
            reason += ` Lecture is offered in ${lecProg} program but also has time clash there.`;
        } else {
            reason += ` Lecture is offered in ${lecProg} program but could not be used.`;
        }
    } else {
        reason += ` Lecture is NOT offered in any other program.`;
    }
    
    // Add lab only (0 credits for lecture)
    addToSchedule(labOffering, placedTimetables, placedNames, placedOfferingIds, course.courseName);

    
    return createCombinedResolution('LECTURE_CLASH_WARNING', lectureOffering, labOffering, 0, course,
        reason,
        {
            clashSlots: timeConflict.formatTimetable(lectureOffering.timetables),
            clashesWith: lectureClashNames,
            originalCredits: totalCredits,
            lectureClash: true,
            lectureClashUnresolved: true,
            lectureOfferedInOtherProgram: !!altLecture,
            lectureInOtherProgramName: altLecture ? offeringProgramName(altLecture) : null,
            creditsIncluded: false,
            lostCredits: totalCredits,
            isNotSuggested: true,
            notSuggestedReason: 'LECTURE_CLASH_UNRESOLVED',
            substituteCourses:  [],
            substituteDetails: null,
            alternativeCourses:  [],
            warningType: 'LECTURE_CLASH_UNRESOLVED',
            needsAdvisorConsultation: true,
            actionRequired: 'NOT_SUGGESTED_LECTURE_CLASH'
        }
    );
}

    if (lectureClash && labClash) {
        console.log(`  ⚠️ Both lecture and lab clash for ${course.courseName}`);
        const altLecture = findAlternateLectureInOtherProgram(offeredCourses, course.courseName, currentProgramId, placedTimetables);
        const altLab = findAlternateLabInOtherProgram(offeredCourses, course.courseName, currentProgramId, placedTimetables);

        console.log(`  Alternate lecture found: ${altLecture ? altLecture.courseName : 'None'}`);
        console.log(`  Alternate lab found: ${altLab ? altLab.courseName : 'None'}`);
        if (altLecture && altLab) {
            addToSchedule(altLecture, placedTimetables, placedNames, placedOfferingIds, course.courseName);
            addToSchedule(altLab, placedTimetables, placedNames, placedOfferingIds, course.courseName);
            return createCombinedResolution('BOTH_CROSS_PROGRAM', altLecture, altLab, totalCredits, course, `Found both lecture and lab in ${offeringProgramName(altLecture)} program.`);
        }

        const lecClashNames = describeClash(lectureOffering.timetables, placedTimetables) || 'another scheduled course';
        const labClashNames = describeClash(labOffering.timetables, placedTimetables) || 'another scheduled course';
        return createResolution('UNRESOLVED_CLASH', course, null, `Both lecture (clashes with ${lecClashNames}) and lab (clashes with ${labClashNames}) clash. No alternate sections found. Consult advisor.`);
    }
       console.log(`  ⚠️ No matching case found for combined course: ${course.courseName}`);
    return createResolution('UNRESOLVED_CLASH', course, null, 
        `"${course.courseName}" combined course could not be resolved. Consult advisor.`
    );
}

function resolveCombinedCourseForNew({ rc, match, offeredCourses, currentSemester, currentProgramId, placedTimetables, placedNames, placedOfferingIds, program, roadmapCourses }) {
    const lectureOffering = match.offering;
    const labOffering = match.labOffering;
    const credits = cleanCredits(rc.creditHours);

    console.log(`\nPROCESSING COMBINED COURSE: ${rc.courseName}`);
    console.log(`   Lecture: ${lectureOffering.courseName} (${offeringProgramName(lectureOffering)})`);
    console.log(`   Lab: ${labOffering.courseName} (${offeringProgramName(labOffering)})`);

    if (placedOfferingIds.has(lectureOffering.id) || placedOfferingIds.has(labOffering.id)) {
        console.log(`  SKIPPING - Already placed`);
        return null;
    }

    const lectureClash = timeConflict.hasClash(lectureOffering.timetables, placedTimetables);
    const labClash = timeConflict.hasClash(labOffering.timetables, placedTimetables);

    console.log(`\n   CLASH CHECK:`);
    console.log(`    Lecture: ${lectureClash ? '❌ CLASH' : '✅ Clear'}`);
    console.log(`    Lab: ${labClash ? '❌ CLASH' : '✅ Clear'}`);

    // ============================================================
    // CASE 1: No Clashes → Add both (Working ✅)
    // ============================================================
    if (!lectureClash && !labClash) {
        addToSchedule(lectureOffering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
        addToSchedule(labOffering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
        console.log(`  ✅ No clashes! Adding full course (${credits} credits)`);
        return createCombinedResolution('NEW_WITH_LAB', lectureOffering, labOffering, credits, rc, 
            'New course with lecture and lab - No time conflicts.', 
            { creditsIncluded: true }
        );
    }

    // ============================================================
    // CASE 2: LAB CLASH ONLY → Try alternate lab
    // ============================================================
    if (labClash && !lectureClash) {
        console.log(`\n  ⚠️ LAB CLASH DETECTED for ${rc.courseName}`);
        const labClashNames = describeClash(labOffering.timetables, placedTimetables) || 'another scheduled course';
        console.log(`    Clashes with: ${labClashNames} (${timeConflict.formatTimetable(labOffering.timetables)})`);

        // Step 1: Try to find alternate lab in OTHER program
        const altLab = findAlternateLabInOtherProgram(offeredCourses, rc.courseName, currentProgramId, placedTimetables);

        if (altLab) {
            // ✅ Found alternate lab in other program
            console.log(`\n  ✅ Found alternate lab in ${offeringProgramName(altLab)} program`);
            console.log(`    Lab time: ${timeConflict.formatTimetable(altLab.timetables)}`);
            
            // Check if alternate lab has clash with current schedule
            const altLabClash = timeConflict.hasClash(altLab.timetables, placedTimetables);
            
            if (!altLabClash) {
                // ✅ No clash with alternate lab
                console.log(`    ✅ No clash with alternate lab`);
                addToSchedule(lectureOffering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                addToSchedule(altLab, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                
                return createCombinedResolution('NEW_CROSS_PROGRAM_LAB', lectureOffering, altLab, credits, rc, 
                    `✅ Lab clashed with ${labClashNames} in your program — lecture stays in your program, lab moved to ${offeringProgramName(altLab)} program. No clashes found.`, 
                    { 
                        creditsIncluded: true, 
                        crossProgram: true, 
                        labClashResolved: true,
                        originalLab: labOffering.courseName,
                        alternateLab: altLab.courseName,
                        alternateLabProgram: offeringProgramName(altLab)
                    }
                );
            } else {
                // ❌ Alternate lab also has clash
                const altLabClashNames = describeClash(altLab.timetables, placedTimetables) || 'another scheduled course';
                console.log(`    ❌ Alternate lab also clashes with: ${altLabClashNames}`);
                
                // Try to find another alternate lab (second choice)
                const secondAltLab = findSecondAlternateLab(offeredCourses, rc.courseName, currentProgramId, placedTimetables, altLab.id);
                
                if (secondAltLab) {
                    console.log(`  ✅ Found second alternate lab in ${offeringProgramName(secondAltLab)} program`);
                    addToSchedule(lectureOffering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                    addToSchedule(secondAltLab, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                    
                    return createCombinedResolution('NEW_CROSS_PROGRAM_LAB', lectureOffering, secondAltLab, credits, rc,
                        `✅ Lab clashed with ${labClashNames} in your program and alternate lab in ${offeringProgramName(altLab)} also clashed. Found second alternate in ${offeringProgramName(secondAltLab)}.`,
                        {
                            creditsIncluded: true,
                            crossProgram: true,
                            labClashResolved: true,
                            originalLab: labOffering.courseName,
                            alternateLab: secondAltLab.courseName,
                            alternateLabProgram: offeringProgramName(secondAltLab)
                        }
                    );
                }
                
                // ❌ No alternate lab found without clash
                console.log(`  ❌ No alternate lab found without time clash`);
            }
        }

        console.log(`\n  ❌ No alternate lab found in other programs (or all clash)`);
        
        // Check if lab is offered in other program at all
        const labInOtherProgram = findAlternateLabInOtherProgram(offeredCourses, rc.courseName, currentProgramId,placedTimetables);
        
        let reason = `⚠️ LAB CLASH UNRESOLVED: Lab component of "${rc.courseName}" clashes with ${labClashNames} at ${timeConflict.formatTimetable(labOffering.timetables)}.`;
        
        if (labInOtherProgram) {
            const labProg = offeringProgramName(labInOtherProgram);
            const labClashInOther = timeConflict.hasClash(labInOtherProgram.timetables, placedTimetables);
            if (labClashInOther) {
                reason += ` Lab is offered in ${labProg} program but also has time clash there.`;
            } else {
                // This shouldn't happen if findAlternateLabInOtherProgram worked, but just in case
                reason += ` Lab is offered in ${labProg} program but could not be used.`;
            }
        } else {
            reason += ` Lab is NOT offered in any other program.`;
        }
        
        reason += ` Lecture will be added separately (0 credits for lab). Consult advisor for alternatives.`;

        // Add lecture only (0 credits for lab)
        addToSchedule(lectureOffering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);

        // Find substitute to replace lost credits
        const substitute = findElectiveSubstitute({
            roadmapCourses: roadmapCourses || [],
            offeredCourses,
            currentSemester,
            placedTimetables,
            excludeNames: placedNames,
            excludeOfferingIds: placedOfferingIds,
            failedCourseCategory: rc.categoryName,
            program
        });

    const availableCourses = findAlternativeRoadmapCourse({
        roadmapCourses,
        offeredCourses,
        program,
        currentSemester,
        placedTimetables,
        placedNames,
        placedOfferingIds,
        excludeCourseName: rc.courseName,
        excludeFYPCourses: true,
        maxCredits: requiredCredits || 18,
        returnAllCandidates: true
    });

        return createCombinedResolution('NEW_LAB_CLASH_UNRESOLVED', lectureOffering, labOffering, 0, rc,
            reason,
            {
                clashSlots: timeConflict.formatTimetable(labOffering.timetables),
                clashesWith: labClashNames,
                originalCredits: credits,
                labClash: true,
                labClashUnresolved: true,  
                labOfferedInOtherProgram: !!labInOtherProgram,
                labInOtherProgramName: labInOtherProgram ? offeringProgramName(labInOtherProgram) : null,
                creditsIncluded: false,
                lostCredits: credits,
                isNotSuggested: true, 
                notSuggestedReason: 'LAB_CLASH_UNRESOLVED',
                substituteCourses: substitute ? [substitute.courseName] : [],
                substituteDetails: substitute ? {
                    courseName: substitute.courseName,
                    credits: substitute.credits,
                    offering: substitute.offering,
                    timeSlot: timeConflict.formatTimetable(substitute.offering?.timetables || []),
                    timetableDetails: substitute.offering?.timetables?.map(t => ({
                        day: t.day || t.dayOfWeek,
                        startTime: t.startTime,
                        endTime: t.endTime,
                        room: t.room || t.venue || 'TBA',
                        instructor: t.instructor || t.teacher || 'TBA',
                        section: t.section || 'N/A'
                    })) || []
                } : null,
                alternativeCourses: availableCourses.length > 0 ? availableCourses.map(c => ({
                    courseName: c.courseName,
                    credits: c.credits,
                    timeSlot: c.timeSlot,
                    actionRequired: 'ALTERNATIVE_SUGGESTION'
                })) : [],
                warningType: 'LAB_CLASH_UNRESOLVED',
                needsAdvisorConsultation: true,
                actionRequired: 'NOT_SUGGESTED_LAB_CLASH'
            }
        );
    }
    if (lectureClash && !labClash) {
        console.log(`\n  ⚠️ LECTURE CLASH DETECTED for ${rc.courseName}`);
        const lecClashNames = describeClash(lectureOffering.timetables, placedTimetables) || 'another scheduled course';
        console.log(`    Clashes with: ${lecClashNames} (${timeConflict.formatTimetable(lectureOffering.timetables)})`);

        // Step 1: Try to find alternate lecture in OTHER program
        const altLecture = findAlternateLectureInOtherProgram(offeredCourses, rc.courseName, currentProgramId, placedTimetables);

        if (altLecture) {
            console.log(`\n  ✅ Found alternate lecture in ${offeringProgramName(altLecture)} program`);
            console.log(`    Lecture time: ${timeConflict.formatTimetable(altLecture.timetables)}`);
            
            const altLectureClash = timeConflict.hasClash(altLecture.timetables, placedTimetables);
            
            if (!altLectureClash) {
                console.log(`    ✅ No clash with alternate lecture`);
                addToSchedule(altLecture, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                addToSchedule(labOffering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                
                return createCombinedResolution('NEW_CROSS_PROGRAM_LECTURE', altLecture, labOffering, credits, rc,
                    `✅ Lecture clashed with ${lecClashNames} in your program — lecture moved to ${offeringProgramName(altLecture)} program, lab stays in your program. No clashes found.`,
                    {
                        creditsIncluded: true,
                        crossProgram: true,
                        lectureClashResolved: true,
                        originalLecture: lectureOffering.courseName,
                        alternateLecture: altLecture.courseName,
                        alternateLectureProgram: offeringProgramName(altLecture)
                    }
                );
            } else {
                const altLectureClashNames = describeClash(altLecture.timetables, placedTimetables) || 'another scheduled course';
                console.log(`    ❌ Alternate lecture also clashes with: ${altLectureClashNames}`);
            }
        }

        // ❌ NO ALTERNATE LECTURE FOUND → Mark as NOT SUGGESTED
        console.log(`\n  ❌ No alternate lecture found in other programs (or all clash)`);
        
        const lectureInOtherProgram = findAlternateLectureInOtherProgram(offeredCourses, rc.courseName, currentProgramId, placedTimetables);
        
        let reason = `⚠️ LECTURE CLASH UNRESOLVED: Lecture component of "${rc.courseName}" clashes with ${lecClashNames} at ${timeConflict.formatTimetable(lectureOffering.timetables)}.`;
        
        if (lectureInOtherProgram) {
            const lecProg = offeringProgramName(lectureInOtherProgram);
            const lecClashInOther = timeConflict.hasClash(lectureInOtherProgram.timetables, placedTimetables);
            if (lecClashInOther) {
                reason += ` Lecture is offered in ${lecProg} program but also has time clash there.`;
            }
        } else {
            reason += ` Lecture is NOT offered in any other program.`;
        }
        
        reason += ` Lab will be added separately (0 credits for lecture). Consult advisor for alternatives.`;

        // Add lab only (0 credits for lecture)
        addToSchedule(labOffering, placedTimetables, placedNames, placedOfferingIds, rc.courseName);

        const substitute = findElectiveSubstitute({
            roadmapCourses: roadmapCourses || [],
            offeredCourses,
            currentSemester,
            placedTimetables,
            excludeNames: placedNames,
            excludeOfferingIds: placedOfferingIds,
            failedCourseCategory: rc.categoryName,
            program
        });

        const availableCourses = findAlternativeRoadmapCourse({
            roadmapCourses,
            offeredCourses,
            program,
            currentSemester,
            placedTimetables,
            placedNames,
            placedOfferingIds,
            excludeCourseName: rc.courseName,
            excludeFYPCourses: true,
             maxCredits: requiredCredits || 18,
            returnAllCandidates: true
        });
            

        return createCombinedResolution('NEW_LECTURE_CLASH_UNRESOLVED', lectureOffering, labOffering, 0, rc,
            reason,
            {
                clashSlots: timeConflict.formatTimetable(lectureOffering.timetables),
                clashesWith: lecClashNames,
                originalCredits: credits,
                lectureClash: true,
                lectureClashUnresolved: true,
                lectureOfferedInOtherProgram: !!lectureInOtherProgram,
                lectureInOtherProgramName: lectureInOtherProgram ? offeringProgramName(lectureInOtherProgram) : null,
                creditsIncluded: false,
                lostCredits: credits,
                isNotSuggested: true,
                notSuggestedReason: 'LECTURE_CLASH_UNRESOLVED',
                substituteCourses: substitute ? [substitute.courseName] : [],
                substituteDetails: substitute ? {
                    courseName: substitute.courseName,
                    credits: substitute.credits,
                    offering: substitute.offering,
                    timeSlot: timeConflict.formatTimetable(substitute.offering?.timetables || []),
                    timetableDetails: substitute.offering?.timetables?.map(t => ({
                        day: t.day || t.dayOfWeek,
                        startTime: t.startTime,
                        endTime: t.endTime,
                        room: t.room || t.venue || 'TBA',
                        instructor: t.instructor || t.teacher || 'TBA',
                        section: t.section || 'N/A'
                    })) || []
                } : null,
                alternativeCourses: availableCourses.map(c => ({
                    courseName: c.courseName,
                    credits: c.credits,
                    timeSlot: c.timeSlot,
                    actionRequired: 'ALTERNATIVE_SUGGESTION'
                })),
                warningType: 'LECTURE_CLASH_UNRESOLVED',
                needsAdvisorConsultation: true,
                actionRequired: 'NOT_SUGGESTED_LECTURE_CLASH'
            }
        );
    }

    // ============================================================
    // CASE 4: BOTH LECTURE AND LAB CLASH
    // ============================================================
    if (lectureClash && labClash) {
        console.log(`\n  ❌ Both lecture and lab clash`);
        
        const lecClashNames = describeClash(lectureOffering.timetables, placedTimetables) || 'another scheduled course';
        const labClashNames = describeClash(labOffering.timetables, placedTimetables) || 'another scheduled course';
        
        console.log(`    Lecture clashes with: ${lecClashNames}`);
        console.log(`    Lab clashes with: ${labClashNames}`);

        // Step 1: Try to find BOTH in other programs
        const altLecture = findAlternateLectureInOtherProgram(offeredCourses, rc.courseName, currentProgramId, placedTimetables);
        const altLab = findAlternateLabInOtherProgram(offeredCourses, rc.courseName, currentProgramId, placedTimetables);

        if (altLecture && altLab) {
            const altLectureClash = timeConflict.hasClash(altLecture.timetables, placedTimetables);
            const altLabClash = timeConflict.hasClash(altLab.timetables, placedTimetables);
            
            if (!altLectureClash && !altLabClash) {
                console.log(`  ✅ Found both in ${offeringProgramName(altLecture)} program - No clashes`);
                addToSchedule(altLecture, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                addToSchedule(altLab, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                return createCombinedResolution('BOTH_CROSS_PROGRAM', altLecture, altLab, credits, rc,
                    `✅ Both lecture and lab found in ${offeringProgramName(altLecture)} program. No clashes.`,
                    { creditsIncluded: true, crossProgram: true, bothClashResolved: true }
                );
            }
        }

        // Step 2: Try to find only lecture OR only lab in other programs
        if (altLecture && !timeConflict.hasClash(altLecture.timetables, placedTimetables)) {
            console.log(`  ✅ Found alternate lecture in ${offeringProgramName(altLecture)} - No clash`);
            // Lab still clashes - try alternate lab
            const altLab2 = findAlternateLabInOtherProgram(offeredCourses, rc.courseName, currentProgramId, placedTimetables);
            if (altLab2 && !timeConflict.hasClash(altLab2.timetables, placedTimetables)) {
                console.log(`  ✅ Found alternate lab in ${offeringProgramName(altLab2)} - No clash`);
                addToSchedule(altLecture, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                addToSchedule(altLab2, placedTimetables, placedNames, placedOfferingIds, rc.courseName);
                return createCombinedResolution('BOTH_CROSS_PROGRAM', altLecture, altLab2, credits, rc,
                    `✅ Both lecture and lab found in other programs. Lecture: ${offeringProgramName(altLecture)}, Lab: ${offeringProgramName(altLab2)}.`,
                    { creditsIncluded: true, crossProgram: true, bothClashResolved: true }
                );
            }
        }

        // ❌ NO ALTERNATIVE → Mark as NOT SUGGESTED
        console.log(`\n  ❌ No alternate sections found for both lecture and lab`);
        
        const lectureInOtherProgram = findAlternateLectureInOtherProgram(offeredCourses, rc.courseName, currentProgramId,placedTimetables);
        const labInOtherProgram = findAlternateLabInOtherProgram(offeredCourses, rc.courseName, currentProgramId, placedTimetables);
        
        let reason = `⚠️ BOTH LECTURE AND LAB CLASH UNRESOLVED: `;
        reason += `Lecture clashes with ${lecClashNames} at ${timeConflict.formatTimetable(lectureOffering.timetables)}. `;
        reason += `Lab clashes with ${labClashNames} at ${timeConflict.formatTimetable(labOffering.timetables)}. `;
        
        if (!lectureInOtherProgram && !labInOtherProgram) {
            reason += `Neither lecture nor lab is offered in other programs. `;
        } else {
            if (lectureInOtherProgram) {
                const lecProg = offeringProgramName(lectureInOtherProgram);
                const lecClashOther = timeConflict.hasClash(lectureInOtherProgram.timetables, placedTimetables);
                reason += `Lecture is offered in ${lecProg}${lecClashOther ? ' but also has time clash there' : ' (available)'}. `;
            }
            if (labInOtherProgram) {
                const labProg = offeringProgramName(labInOtherProgram);
                const labClashOther = timeConflict.hasClash(labInOtherProgram.timetables, placedTimetables);
                reason += `Lab is offered in ${labProg}${labClashOther ? ' but also has time clash there' : ' (available)'}. `;
            }
        }
        
        reason += `Course NOT suggested. Consider taking next semester. Consult advisor.`;

        return createCombinedResolution('BOTH_CLASH_UNRESOLVED', lectureOffering, labOffering, 0, rc,
            reason,
            {
                lectureClash: true,
                labClash: true,
                bothClashUnresolved: true,
                lectureClashSlots: timeConflict.formatTimetable(lectureOffering.timetables),
                labClashSlots: timeConflict.formatTimetable(labOffering.timetables),
                clashesWith: `${lecClashNames}, ${labClashNames}`,
                originalCredits: credits,
                creditsIncluded: false,
                lostCredits: credits,
                isNotSuggested: true,
                notSuggestedReason: 'BOTH_CLASH_UNRESOLVED',
                lectureOfferedInOtherProgram: !!lectureInOtherProgram,
                lectureInOtherProgramName: lectureInOtherProgram ? offeringProgramName(lectureInOtherProgram) : null,
                labOfferedInOtherProgram: !!labInOtherProgram,
                labInOtherProgramName: labInOtherProgram ? offeringProgramName(labInOtherProgram) : null,
                warningType: 'BOTH_CLASH_UNRESOLVED',
                needsAdvisorConsultation: true,
                actionRequired: 'NOT_SUGGESTED_BOTH_CLASH'
            }
        );
    }

    return null;
}

function resolveNewCourseClash({ 
    rc, 
    offering, 
    offeredCourses, 
    program, 
    currentSemester, 
    placedTimetables, 
    placedNames, 
    placedOfferingIds, 
    roadmapCourses, 
    requiredCredits, 
    lectureOnly = false 
}) {
    const clashNames = describeClash(offering.timetables, placedTimetables) || 'another scheduled course';
    console.log(` Time clash with: ${clashNames}${lectureOnly ? ' (lecture-only offering)' : ''}`);

    const clashRecord = {
        courseId: offering.id,
        courseName: offering.courseName,
        originalCourseName: rc.courseName,
        credits: requiredCredits || cleanCredits(offering.credits|| offering.creditHours || rc.credits || 0),
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
        actionRequired: 'TIME_CLASH_SKIPPED',
        substituteCourses: [],
        hasLab: false,
        labDetails: null,
        isElective: false,
        clashesWith: clashNames,
        isNotSuggested: true,
        notSuggestedReason: 'TIME_CLASH',
        clashDetails: {
            clashesWith: clashNames,
            clashSlots: timeConflict.formatTimetable(offering.timetables),
            // ✅ Add detailed clash information
            detailedClashes: []
        },
        reason: `"${rc.courseName}" (offered as "${offering.courseName}") clashes with ${clashNames} in your schedule. NOT suggested due to time clash.`
    };

    const detailedClashes = [];
    for (const slot of offering.timetables || []) {
        for (const placed of placedTimetables) {
            if (timeConflict.slotsOverlap(slot, placed)) {
                detailedClashes.push({
                    courseName: placed.courseName || 'another scheduled course',
                    time: timeConflict.formatTimetable([placed]),
                    day: placed.day || placed.dayOfWeek,
                    startTime: placed.startTime,
                    endTime: placed.endTime,
                    venue: placed.venue || placed.room || 'TBA'
                });
            }
        }
    }
    clashRecord.clashDetails.detailedClashes = detailedClashes;

    console.log(` Looking for alternative roadmap course...`);

    const result = findAlternativeRoadmapCourse({
        roadmapCourses,
        offeredCourses,
        program,
        currentSemester,
        placedTimetables,
        placedNames,
        placedOfferingIds,
        excludeCourseName: rc.courseName,
        excludeFYPCourses: true,
        maxCredits: requiredCredits || 18,
        returnAllCandidates: true,  
        originalClashingCourse: rc.courseName 
    });

    const bestAlternative = result?.best || null;
    const allCandidates = result?.allCandidates || [];
    const timeClashes = result?.timeClashes || [];
    const notOffered = result?.notOffered || [];
    const alreadyPlaced = result?.alreadyPlaced || [];

    if (bestAlternative) {
        console.log(`   🏆 Best alternative: ${bestAlternative.courseName} (${bestAlternative.credits} credits, Score: ${bestAlternative.score})`);
        console.log(`    Time: ${bestAlternative.timeSlot}`);
        console.log(`    Reason: ${bestAlternative.reason}`);

        // Add best alternative to schedule
        addToSchedule(bestAlternative.offering, placedTimetables, placedNames, placedOfferingIds, bestAlternative.courseName);

        // ✅ Build detailed response with all alternatives
        return {
            clashRecord: clashRecord,
            alternative: {
                courseId: bestAlternative.offering.id,
                courseName: bestAlternative.courseName,
                originalCourseName: rc.courseName,
                credits: bestAlternative.credits,
                isOffered: true,
                offeredProgram: bestAlternative.program,
                offeredProgramId: bestAlternative.programId,
                timeSlot: bestAlternative.timeSlot,
                timetableDetails: bestAlternative.timetableDetails,
                batch: bestAlternative.batch,
                program: bestAlternative.program,
                actionRequired: 'ALTERNATIVE_FOR_CLASH',
                substituteCourses: [rc.courseName],
                hasLab: false,
                labDetails: null,
                isElective: false,
                resolvesClash: true,
                clashResolved: true,
                priority: 'high',
                score: bestAlternative.score,
                // ✅ Detailed reason why this is the best match
                reason: `✅ "${bestAlternative.courseName}" is the best alternative for "${rc.courseName}".\n` +
                        `   Why this is the best match:\n` +
                        `   • Same semester: ${bestAlternative.semester === currentSemester ? '✅ Yes' : '❌ No (Semester ${bestAlternative.semester})'}\n` +
                        `   • Credits: ${bestAlternative.credits} (${bestAlternative.credits === 3 ? '✅ Standard' : '⚠️ Different from 3'})\n` +
                        `   • No time conflicts with your schedule ✅\n` +
                        `   • All prerequisites cleared ✅\n` +
                        `   • Category: ${bestAlternative.category || 'N/A'}\n` +
                        `   • Score: ${bestAlternative.score}`,
                alternativeReason: bestAlternative.reason,
                bestMatchDetails: {
                    score: bestAlternative.score,
                    sameSemester: bestAlternative.semester === currentSemester,
                    semester: bestAlternative.semester,
                    creditMatch: bestAlternative.credits === 3,
                    isCore: !bestAlternative.category?.toLowerCase().includes('elective'),
                    hasDependents: bestAlternative.matchReasons?.hasDependents || false,
                    matchReasons: bestAlternative.matchReasons || {}
                },
                // ✅ All available alternatives
                allAlternatives: {
                    available: allCandidates.map(c => ({
                        courseName: c.courseName,
                        credits: c.credits,
                        semester: c.semester,
                        category: c.category,
                        isElective: c.isElective,
                        status: c.status,
                        reason: c.reason,
                        score: c.score,
                        timeSlot: c.timeSlot,
                        timetableDetails: c.timetableDetails,
                        matchReasons: c.matchReasons || {}
                    })),
                    timeClashes: timeClashes.map(c => ({
                        courseName: c.courseName,
                        credits: c.credits,
                        semester: c.semester,
                        reason: c.reason,
                        clashesWith: c.clashesWith,
                        clashSlots: c.clashSlots,
                        clashDetails: c.clashDetails || []
                    })),
                    notOffered: notOffered.map(c => ({
                        courseName: c.courseName,
                        credits: c.credits,
                        semester: c.semester,
                        reason: c.reason
                    })),
                    alreadyPlaced: alreadyPlaced.map(c => ({
                        courseName: c.courseName,
                        credits: c.credits,
                        semester: c.semester,
                        reason: c.reason
                    })),
                    summary: result.summary || {
                        totalEligible: 0,
                        available: 0,
                        timeClashes: 0,
                        notOffered: 0,
                        alreadyPlaced: 0
                    }
                },
                totalAvailable: allCandidates.length
            }
        };
    }

    console.log(` ❌ No alternative roadmap course found`);

    return {
        clashRecord: clashRecord,
        alternative: null,
        allAlternatives: {
            available: [],
            timeClashes: timeClashes,
            notOffered: notOffered,
            alreadyPlaced: alreadyPlaced,
            summary: result?.summary || {
                totalEligible: 0,
                available: 0,
                timeClashes: 0,
                notOffered: 0,
                alreadyPlaced: 0
            }
        },
        reason: `"${rc.courseName}" (offered as "${offering.courseName}") clashes with ${clashNames}. No alternative roadmap course found. Consult advisor.`
    };
}

export default {addToSchedule,resolveNewCourseClash,createCombinedResolution,createResolution,resolveCombinedCourse,resolveRetakeCourse,resolveCombinedCourseForNew}