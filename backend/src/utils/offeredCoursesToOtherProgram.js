import courseNameMatcher from './courseMapping.js';
import labBasedCourseDetection from './labIncludedCoursesDetection.js';
import findElectiveOffering from './findElectiveOffering.js';
import getElectiveType from './getElectiveType.js';
import helpingFunctions from './courseHelpingChecks.js';

const { cleanCredits, offeringProgramId, offeringProgramName } = helpingFunctions;
const { findComponents, checkIfCombined, buildCombinedResponse } = labBasedCourseDetection;

function findOfferingInOtherProgram(
    courseName,
    courseCredits,
    offeredCourses,
    studentProgram,
    excludeProgramId,  
    currentSemester = null,
    placedTimetables = [],
    options = {}
) {
    const { expectsLab = false, requiredCredits = null } = options;
    const credits = cleanCredits(courseCredits || requiredCredits || 3);

    const candidates = offeredCourses.filter(o => 
        offeringProgramId(o) !== excludeProgramId
    );

    if (candidates.length === 0) {
        console.log(`   No courses found in other programs`);
        return null;
    }

    console.log(`   Looking in other programs (${candidates.length} courses)`);

    let match = courseNameMatcher.findBestMatch(courseName, candidates);
    
    if (match) {
        const { lec, lab, isCombined } = findComponents(courseName, candidates);
        
        if (isCombined) {
            console.log(`   Combined course detected in other program:`);
            console.log(`    Lecture: ${lec.courseName} (${offeringProgramName(lec)})`);
            console.log(`    Lab: ${lab.courseName} (${offeringProgramName(lab)})`);
            const result = buildCombinedResponse(lec, lab);
            return {
                ...result,
                isOtherProgram: true,
                program: offeringProgramName(lec)
            };
        }
        
        if (expectsLab && !lab && lec) {
            console.log(`  Lab expected but not offered in other programs for: ${courseName}`);
            return {
                offering: lec,
                hasLab: false,
                hasLec: true,
                isCombined: false,
                labExpected: true,
                labNotOffered: true,
                score: 0.5,
                fuzzy: false,
                needsReview: true,
                isOtherProgram: true,
                program: offeringProgramName(lec)
            };
        }
        
        return {
            ...match,
            isOtherProgram: true,
            program: offeringProgramName(match.offering)
        };
    }

    const isElectiveCat = courseName.toLowerCase().includes('elective');
    console.log(`\n   Checking if elective: ${courseName} → ${isElectiveCat}`);

    if (isElectiveCat) {
        console.log(`   ELECTIVE DETECTED in other programs: ${courseName}`);
        console.log(`    Credits required: ${credits}`);
        console.log(`    Excluding program: ${excludeProgramId}`);

        const electiveResult = findElectiveOffering({
            courseName,
            courseCredits: credits,
            electiveType: getElectiveType(courseName),
            offeredCourses: candidates,
            program: studentProgram,
            currentSemester,
            placedTimetables
        });

        if (electiveResult.found) {
            const bestMatch = electiveResult.options && electiveResult.options.length > 0
                ? electiveResult.options[0]
                : null;

            if (!bestMatch) {
                console.log(`  No valid elective options found in other programs`);
                return null;
            }

            console.log(`  Found elective in other program: ${bestMatch.courseName}`);
            console.log(`    Program: ${bestMatch.program}`);
            console.log(`    Credits: ${bestMatch.credits}`);
            console.log(`    Match: ${bestMatch.matchReason}`);

            const isCombined = bestMatch.isCombined || checkIfCombined(bestMatch.courseName, candidates);
            const labOffering = isCombined ? candidates.find(o => {
                const clean = bestMatch.courseName.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim();
                const n = o.courseName.toLowerCase();
                return n.includes(clean.toLowerCase()) && (n.includes('lab') || n.includes('practical'));
            }) : null;

            return {
                offering: bestMatch.offering,
                isElectiveMatch: true,
                isOtherProgram: true,
                originalElectiveName: courseName,
                actualCourseName: bestMatch.courseName,
                credits: bestMatch.credits,
                isOtherSemester: !bestMatch.isSameSemester,
                isOtherProgram: true,
                score: 0.8,
                fuzzy: true,
                needsReview: true,
                electiveType: getElectiveType(courseName),
                labOffering: labOffering,
                hasLab: isCombined || false,
                timeSlot: bestMatch.timeSlot,
                timetableDetails: bestMatch.timetableDetails || [],
                batch: bestMatch.batch,
                program: bestMatch.program,
                offeredProgram: bestMatch.program,
                offeredProgramId: bestMatch.programId,
                electiveOptions: electiveResult.options.map(opt => ({
                    courseName: opt.courseName,
                    credits: opt.credits,
                    program: opt.program,
                    semester: opt.semester,
                    isSameProgram: false,
                    isSameSemester: opt.isSameSemester,
                    exactCredit: opt.exactCredit,
                    totalScore: opt.totalScore,
                    matchReason: `Other Program: ${opt.matchReason}`,
                    timeSlot: opt.timeSlot,
                    timetableDetails: opt.timetableDetails || [],
                    batch: opt.batch,
                    labDetails: opt.labDetails,
                    offering: opt.offering,
                    actionRequired: 'ELECTIVE_OPTION',
                    isElective: true
                })),
                categorizedOptions: electiveResult.categorizedOptions || {
                    bestMatch: null,
                    sameProgramSameSemester: [],
                    sameProgramOtherSemester: [],
                    otherProgramSameSemester: [],
                    otherProgramOtherSemester: []
                },
                totalOptions: electiveResult.options?.length || 0,
                recommendedAction: 'SELECT_ELECTIVE',
                reason: `Found ${electiveResult.options?.length || 0} elective options in other programs. Best: ${bestMatch.courseName}`
            };
        }
    }

    const { lec, lab, isCombined } = findComponents(courseName, candidates);
    
    if (isCombined) {
        console.log(`   Combined course detected in other program (fallback):`);
        console.log(`    Lecture: ${lec.courseName} (${offeringProgramName(lec)})`);
        console.log(`    Lab: ${lab.courseName} (${offeringProgramName(lab)})`);
        const result = buildCombinedResponse(lec, lab);
        return {
            ...result,
            isOtherProgram: true,
            program: offeringProgramName(lec)
        };
    }

    if (expectsLab && !lab && lec) {
        console.log(`  Lab expected but not offered in other programs: ${courseName}`);
        return {
            offering: lec,
            hasLab: false,
            hasLec: true,
            isCombined: false,
            labExpected: true,
            labNotOffered: true,
            score: 0.5,
            fuzzy: false,
            needsReview: true,
            isOtherProgram: true,
            program: offeringProgramName(lec)
        };
    }

    if (lec) {
        console.log(`  Found lecture-only in other program: ${lec.courseName} (${offeringProgramName(lec)})`);
        return {
            offering: lec,
            hasLab: false,
            hasLec: true,
            isCombined: false,
            score: 0.8,
            fuzzy: true,
            needsReview: true,
            isOtherProgram: true,
            program: offeringProgramName(lec)
        };
    }

    match = courseNameMatcher.findBestMatch(
        courseName.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim(),
        candidates
    );
    
    if (match) {
        console.log(`   Found fuzzy match in other program: ${match.offering.courseName} (${offeringProgramName(match.offering)})`);
        return {
            ...match,
            isOtherProgram: true,
            program: offeringProgramName(match.offering),
            score: 0.6,
            fuzzy: true,
            needsReview: true
        };
    }

    console.log(`   No match found in other programs for: ${courseName}`);
    return null;
}

export default findOfferingInOtherProgram;