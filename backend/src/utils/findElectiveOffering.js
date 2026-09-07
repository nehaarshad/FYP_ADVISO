import getElectiveType from "./getElectiveType.js";
import helpingFunctions from './courseHelpingChecks.js';
import clashes from './courseClashes.js'
const {describeClash} = clashes
const { cleanCredits,  offeringCategory, offeringProgramId, offeringProgramName } = helpingFunctions;
import sheetProcessingFunctions from './sheetProcessingHelperFunction.js';
import timeConflict from '../utils/timeConflict.js';
import labBasedCourseDetection from './labIncludedCoursesDetection.js';
const { checkIfCombined } = labBasedCourseDetection;  


function buildEmptyElectiveResult() {
    return {
        found: false,
        offering: null,
        courseName: null,
        credits: 0,
        program: null,
        programId: null,
        semester: 0,
        isOtherSemester: false,
        isOtherProgram: false,
        timeSlot: null,
        timetableDetails: [],
        batch: 'N/A',
        hasLab: false,
        labDetails: null,
        needsReview: true,
        matchType: 'none',
        creditMismatch: false,
        options: [],
        clashingOptions: [],
        categorizedOptions: {
            bestMatch: null,
            sameProgramSameSemester: [],
            sameProgramOtherSemester: [],
            otherProgramSameSemester: [],
            otherProgramOtherSemester: []
        },
        totalOptions: 0,
        totalClashOptions: 0,
        hasClashOptions: false,
        allClash: false,
        reason: 'No elective options available'
    };
}

function buildElectiveResult(data) {
    // Get options from data
    const options = data.options || [];
    const clashingOptions = data.clashingOptions || [];
    
    return {
        found: data.found || false,
        offering: data.offering || null,
        courseName: data.courseName || null,
        credits: data.credits || 0,
        program: data.program || null,
        programId: data.programId || null,
        semester: data.semester || 0,
        actualSemester: data.actualSemester || 0,
        isOtherSemester: data.isOtherSemester || false,
        isOtherProgram: data.isOtherProgram || false,
        actualProgram: data.actualProgram || null,
        timeSlot: data.timeSlot || null,
        timetableDetails: data.timetableDetails || [],
        batch: data.batch || 'N/A',
        hasLab: data.hasLab || false,
        labDetails: data.labDetails || null,
        needsReview: data.needsReview || false,
        matchType: data.matchType || 'unknown',
        creditMismatch: data.creditMismatch || false,
        requiredCredits: data.requiredCredits || 0,
        availableCredits: data.availableCredits || 0,
        
        // ✅ Use data.options (not scoredOptions directly)
        options: options.map(opt => ({
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
            hasClash: false,
            actionRequired: 'ELECTIVE_OPTION'
        })),
        
        // ✅ Use data.clashingOptions
        clashingOptions: clashingOptions.map(opt => ({
            courseName: opt.courseName,
            credits: opt.credits,
            program: opt.program,
            semester: opt.semester,
            isSameProgram: opt.isSameProgram,
            isSameSemester: opt.isSameSemester,
            exactCredit: opt.exactCredit,
            clashDetails: opt.clashDetails,
            timeSlot: opt.timeSlot,
            timetableDetails: opt.timetableDetails || [],
            hasClash: true,
            actionRequired: 'CLASH_SKIPPED',
            reason: `This course clashes with your current schedule: ${opt.clashDetails || 'Time conflict'}`
        })),
        
        totalOptions: options.length,
        totalClashOptions: clashingOptions.length,
        hasClashOptions: clashingOptions.length > 0,
        allClash: data.allClash || false,
        reason: data.reason || null,
        
        categorizedOptions: data.categorizedOptions || {
            bestMatch: null,
            sameProgramSameSemester: [],
            sameProgramOtherSemester: [],
            otherProgramSameSemester: [],
            otherProgramOtherSemester: []
        }
    };
}

function findElectiveOffering({ courseName, courseCredits, electiveType, offeredCourses, program, currentSemester, placedTimetables, includeClashingOptions = true  }) {
    const safeElectiveType = electiveType || getElectiveType(courseName);
    console.log(`   Finding actual courses for elective type: "${safeElectiveType}"`);

    const normalizedType = safeElectiveType.toLowerCase().trim();
    console.log(`    Normalized type: "${normalizedType}"`);

    // STEP 1: Find all elective offered courses
    const allElectives = offeredCourses.filter(o => {
        const category = offeringCategory(o).toLowerCase();
        const name = o.courseName.toLowerCase();
        const isElective = category.includes('elective') || name.includes('elective');
        return isElective;
    });

    console.log(`    Total electives available: ${allElectives.length}`);

    if (allElectives.length > 0) {
        console.log(`    Available electives:`);
        allElectives.forEach(e => {
            console.log(`      - ${e.courseName} (${offeringCategory(e)})`);
        });
    }

    // STEP 2: Filter by elective type
    const typeMatches = allElectives.filter(o => {
        const category = offeringCategory(o).toLowerCase();
        const name = o.courseName.toLowerCase();
        const categoryMatch = category.includes(normalizedType) || name.includes(normalizedType);
        return categoryMatch;
    });

    console.log(`    Electives matching type "${normalizedType}": ${typeMatches.length}`);

    if (typeMatches.length === 0) {
        console.log(`   ❌ No electives of type "${normalizedType}" found`);
        return buildEmptyElectiveResult();
    }

    if (typeMatches.length > 0) {
        console.log(`    Matching electives:`);
        typeMatches.forEach(e => {
            console.log(`      - ${e.courseName} (${offeringCategory(e)})`);
        });
    }

    // STEP 3: Score and evaluate ALL options (including those with clashes)
    const creditRequired = cleanCredits(courseCredits || 3);
    const scoredOptions = [];
    const clashingOptions = [];

    for (const offering of typeMatches) {
        const sem = sheetProcessingFunctions.parseSemesterFromCourseName(offering.courseName);
        const credits = cleanCredits(offering.courseCredits || 3);
        const isSameProgram = offeringProgramName(offering) === program;
        const isSameSemester = sem === currentSemester;
        const exactCredit = credits === creditRequired;
        const isCombined = checkIfCombined(offering.courseName, offeredCourses);
        
        // Check for time clash
        const hasClash = timeConflict.hasClash(offering.timetables || [], placedTimetables);
        const clashDetails = hasClash ? describeClash(offering.timetables || [], placedTimetables) : null;

        // Calculate scores
        const programScore = isSameProgram ? 100 : 50;
        const semesterScore = isSameSemester ? 50 : Math.max(0, 30 - Math.abs(sem - currentSemester) * 5);
        const creditScore = exactCredit ? 30 : (credits > 0 ? 10 : 0);
        const clashScore = hasClash ? -100 : 0; // Heavy penalty for clashes

        const totalScore = programScore + semesterScore + creditScore + clashScore;

        const optionData = {
            offering,
            courseName: offering.courseName,
            credits,
            semester: sem,
            program: offeringProgramName(offering),
            programId: offeringProgramId(offering),
            isSameProgram,
            isSameSemester,
            exactCredit,
            isCombined,
            hasClash,
            clashDetails,
            totalScore: Math.max(0, totalScore),
            matchReason: [
                isSameProgram ? '✅ Same Program' : '📌 Other Program',
                isSameSemester ? '✅ Same Semester' : `📅 Semester ${sem}`,
                exactCredit ? '✅ Exact Credits' : `⚠️ ${credits}/${creditRequired} Credits`,
                hasClash ? '❌ TIME CLASH' : '✅ Clash-Free'
            ].join(', '),
            timeSlot: timeConflict.formatTimetable(offering.timetables),
            timetableDetails: (offering.timetables || []).map(t => ({
                day: t.day || t.dayOfWeek,
                startTime: t.startTime,
                endTime: t.endTime,
                room: t.room || t.venue || 'TBA',
                instructor: t.instructor || t.teacher || 'TBA',
                section: t.section || 'N/A'
            })),
            batch: offering.BatchModel?.batchName || 'N/A',
            labDetails: isCombined ? {
                offering: offeredCourses.find(lab => {
                    const clean = offering.courseName.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim();
                    const n = lab.courseName.toLowerCase();
                    return n.includes(clean.toLowerCase()) && (n.includes('lab') || n.includes('practical'));
                })
            } : null,
            actionRequired: hasClash ? 'CLASH_SKIPPED' : 'ELECTIVE_OPTION'
        };

        if (hasClash) {
            clashingOptions.push(optionData);
        } else {
            scoredOptions.push(optionData);
        }
    }

    // STEP 4: Sort by score (highest first) //no clash
    scoredOptions.sort((a, b) => b.totalScore - a.totalScore);

   console.log(`\n   ✅ Clash-Free Options: ${scoredOptions.length}`);
    scoredOptions.forEach((opt, idx) => {
        console.log(`    ${idx + 1}. ${opt.courseName} (${opt.credits} credits) - Score: ${opt.totalScore}`);
        console.log(`       ${opt.matchReason}`);
    });

    console.log(`\n   ❌ Clashing Options: ${clashingOptions.length}`);
    clashingOptions.forEach((opt, idx) => {
        console.log(`    ${idx + 1}. ${opt.courseName} (${opt.credits} credits)`);
        console.log(`       ${opt.clashDetails || 'Time clash with existing schedule'}`);
    });

        if (scoredOptions.length === 0) {
        console.log(`   ❌ No clash-free elective options found`);
        
        // If there are clashing options but no clash-free ones
        if (clashingOptions.length > 0 && !scoredOptions.some(opt => !opt.hasClash)) {
            console.log(`   ⚠️ All ${clashingOptions.length} options have time clashes`);
            // In findElectiveOffering, when returning:
return buildElectiveResult({
    found: true,
    offering: bestMatch?.offering || null,
    courseName: bestMatch?.courseName || null,
    credits: bestMatch?.credits || 0,
    program: bestMatch?.program || null,
    programId: bestMatch?.programId || null,
    semester: bestMatch?.semester || 0,
    actualSemester: bestMatch?.semester || 0,
    isOtherSemester: bestMatch ? !bestMatch.isSameSemester : false,
    isOtherProgram: bestMatch ? !bestMatch.isSameProgram : false,
    actualProgram: bestMatch?.program || null,
    timeSlot: bestMatch?.timeSlot || null,
    timetableDetails: bestMatch?.timetableDetails || [],
    batch: bestMatch?.batch || 'N/A',
    hasLab: bestMatch?.isCombined || false,
    labDetails: bestMatch?.labDetails || null,
    needsReview: matchType !== 'same_semester_same_program_exact_credit',
    matchType: matchType,
    creditMismatch: bestMatch ? bestMatch.credits !== creditRequired : false,
    requiredCredits: creditRequired,
    availableCredits: bestMatch?.credits || 0,
    
    // ✅ PASS THE ARRAYS HERE
    options: scoredOptions,  // ← Pass the array
    clashingOptions: includeClashingOptions ? clashingOptions : [],  // ← Pass the array
    totalOptions: scoredOptions.length,  // ← Pass the count
    totalClashOptions: clashingOptions.length,  // ← Pass the count
    allClash: false,
    reason: `Found ${scoredOptions.length} clash-free options${clashingOptions.length > 0 ? ` (${clashingOptions.length} options have clashes)` : ''}`,
    
    // Categorized options
    categorizedOptions: {
        bestMatch: bestMatch ? {
            courseName: bestMatch.courseName,
            credits: bestMatch.credits,
            program: bestMatch.program,
            semester: bestMatch.semester,
            matchReason: bestMatch.matchReason,
            timeSlot: bestMatch.timeSlot
        } : null,
        sameProgramSameSemester: sameProgramSameSemester.map(o => ({
            courseName: o.courseName,
            credits: o.credits,
            program: o.program,
            semester: o.semester,
            timeSlot: o.timeSlot
        })),
        sameProgramOtherSemester: sameProgramOtherSemester.map(o => ({
            courseName: o.courseName,
            credits: o.credits,
            program: o.program,
            semester: o.semester,
            timeSlot: o.timeSlot
        })),
        otherProgramSameSemester: otherProgramSameSemester.map(o => ({
            courseName: o.courseName,
            credits: o.credits,
            program: o.program,
            semester: o.semester,
            timeSlot: o.timeSlot
        })),
        otherProgramOtherSemester: otherProgramOtherSemester.map(o => ({
            courseName: o.courseName,
            credits: o.credits,
            program: o.program,
            semester: o.semester,
            timeSlot: o.timeSlot
        }))
    }
});
        }
        
        return buildEmptyElectiveResult();
    }
    // STEP 6: Categorize options by priority
    const bestMatch = scoredOptions[0] || null;
    const sameProgramSameSemester = scoredOptions.filter(o => o.isSameProgram && o.isSameSemester);
    const sameProgramOtherSemester = scoredOptions.filter(o => o.isSameProgram && !o.isSameSemester);
    const otherProgramSameSemester = scoredOptions.filter(o => !o.isSameProgram && o.isSameSemester);
    const otherProgramOtherSemester = scoredOptions.filter(o => !o.isSameProgram && !o.isSameSemester);

    // Determine match type for the best option
    let matchType = 'other_program_other_semester';
    if (bestMatch) {
        if (bestMatch.isSameProgram && bestMatch.isSameSemester && bestMatch.exactCredit) {
            matchType = 'same_semester_same_program_exact_credit';
        } else if (bestMatch.isSameProgram && bestMatch.isSameSemester) {
            matchType = 'same_semester_same_program_any_credit';
        } else if (bestMatch.isSameProgram) {
            matchType = 'other_semester_same_program';
        } else if (bestMatch.isSameSemester) {
            matchType = 'same_semester_other_program';
        } else {
            matchType = 'other_program_other_semester';
        }
    }

    console.log(`\n   Best elective match: ${bestMatch ? bestMatch.courseName : 'None'}`);
    console.log(`    Match Type: ${matchType}`);
    console.log(`    Total options found: ${scoredOptions.length}`);

    // STEP 7: Return ALL options
// In findElectiveOffering, when returning:
return buildElectiveResult({
    found: true,
    offering: bestMatch?.offering || null,
    courseName: bestMatch?.courseName || null,
    credits: bestMatch?.credits || 0,
    program: bestMatch?.program || null,
    programId: bestMatch?.programId || null,
    semester: bestMatch?.semester || 0,
    actualSemester: bestMatch?.semester || 0,
    isOtherSemester: bestMatch ? !bestMatch.isSameSemester : false,
    isOtherProgram: bestMatch ? !bestMatch.isSameProgram : false,
    actualProgram: bestMatch?.program || null,
    timeSlot: bestMatch?.timeSlot || null,
    timetableDetails: bestMatch?.timetableDetails || [],
    batch: bestMatch?.batch || 'N/A',
    hasLab: bestMatch?.isCombined || false,
    labDetails: bestMatch?.labDetails || null,
    needsReview: matchType !== 'same_semester_same_program_exact_credit',
    matchType: matchType,
    creditMismatch: bestMatch ? bestMatch.credits !== creditRequired : false,
    requiredCredits: creditRequired,
    availableCredits: bestMatch?.credits || 0,
    
    options: scoredOptions,  
    clashingOptions: includeClashingOptions ? clashingOptions : [],  
    totalOptions: scoredOptions.length, 
    totalClashOptions: clashingOptions.length, 
    allClash: false,
    reason: `Found ${scoredOptions.length} clash-free options${clashingOptions.length > 0 ? ` (${clashingOptions.length} options have clashes)` : ''}`,
    
    // Categorized options
    categorizedOptions: {
        bestMatch: bestMatch ? {
            courseName: bestMatch.courseName,
            credits: bestMatch.credits,
            program: bestMatch.program,
            semester: bestMatch.semester,
            matchReason: bestMatch.matchReason,
            timeSlot: bestMatch.timeSlot
        } : null,
        sameProgramSameSemester: sameProgramSameSemester.map(o => ({
            courseName: o.courseName,
            credits: o.credits,
            program: o.program,
            semester: o.semester,
            timeSlot: o.timeSlot
        })),
        sameProgramOtherSemester: sameProgramOtherSemester.map(o => ({
            courseName: o.courseName,
            credits: o.credits,
            program: o.program,
            semester: o.semester,
            timeSlot: o.timeSlot
        })),
        otherProgramSameSemester: otherProgramSameSemester.map(o => ({
            courseName: o.courseName,
            credits: o.credits,
            program: o.program,
            semester: o.semester,
            timeSlot: o.timeSlot
        })),
        otherProgramOtherSemester: otherProgramOtherSemester.map(o => ({
            courseName: o.courseName,
            credits: o.credits,
            program: o.program,
            semester: o.semester,
            timeSlot: o.timeSlot
        }))
    }
});
}

export default findElectiveOffering;