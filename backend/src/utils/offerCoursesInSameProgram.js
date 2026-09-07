import labBasedCourseDetection from './labIncludedCoursesDetection.js';
import courseNameMatcher from './courseMapping.js';
const { findComponents, checkIfCombined, buildCombinedResponse } = labBasedCourseDetection;
import findElectiveOffering from './findElectiveOffering.js';
import getElectiveType from './getElectiveType.js';
import helpingFunctions from './courseHelpingChecks.js';
const { cleanCredits} = helpingFunctions;

function findOffering(courseName, courseCredits, offeredCourses, studentProgram, currentSemester = null, placedTimetables = [], options = {}) {
    const { expectsLab = false, requiredCredits = null } = options;
    const credits = cleanCredits(courseCredits || requiredCredits || 3);

    // Match via course name splitting (Calculus and Analytical Geometry or OOP)
    let match = courseNameMatcher.findBestMatch(courseName, offeredCourses);
    if (match) {
        const { lec, lab, isCombined } = findComponents(courseName, offeredCourses);
        if (isCombined) {
            console.log(`  Combined course detected: ${courseName}`);
            console.log(`    Lecture: ${lec.courseName}`);
            console.log(`    Lab: ${lab.courseName}`);
            return buildCombinedResponse(lec, lab);
        }
        if (expectsLab && !lab && lec) {
            console.log(`   Lab expected but not offered for: ${courseName}`);
            return {
                offering: lec,
                hasLab: false,
                hasLec: true,
                isCombined: false,
                labExpected: true,
                labNotOffered: true,
                score: 0.5,
                fuzzy: false,
                needsReview: true
            };
        }
        return match;
    }

    // Check if elective (roadmap course name mentioned as University Elective-1)
    const isElectiveCat = courseName.toLowerCase().includes('elective');
    console.log(`\n   Checking if elective: ${courseName} → ${isElectiveCat}`);

    if (isElectiveCat) {
        console.log(`   ELECTIVE DETECTED: ${courseName}`);
        console.log(`    Credits required: ${credits}`);
        console.log(`    Program: ${studentProgram}`);
        console.log(`    Semester: ${currentSemester}`);

        const electiveResult = findElectiveOffering({
            courseName,
            courseCredits: credits,
            electiveType: getElectiveType(courseName),
            offeredCourses,
            program: studentProgram,
            currentSemester,
            placedTimetables
        });

        if (electiveResult.found) {
            console.log(`   Found ${electiveResult.options?.length || 0} elective options`);

            // Get the best match (first in sorted list)
            const bestMatch = electiveResult.options && electiveResult.options.length > 0
                ? electiveResult.options[0]
                : null;

            if (!bestMatch) {
                console.log(`   No valid elective options found`);
                return null;
            }

            console.log(`    Best: ${bestMatch.courseName} (Score: ${bestMatch.totalScore})`);
            console.log(`    Match: ${bestMatch.matchReason}`);

            // Check if combined
            const isCombined = bestMatch.isCombined || checkIfCombined(bestMatch.courseName, offeredCourses);
            const labOffering = isCombined ? offeredCourses.find(o => {
                const clean = bestMatch.courseName.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim();
                const n = o.courseName.toLowerCase();
                return n.includes(clean.toLowerCase()) && (n.includes('lab') || n.includes('practical'));
            }) : null;

            return {
                offering: bestMatch.offering,
                isElectiveMatch: true,
                originalElectiveName: courseName,
                actualCourseName: bestMatch.courseName,
                credits: bestMatch.credits,
                isOtherSemester: !bestMatch.isSameSemester,
                isOtherProgram: !bestMatch.isSameProgram,
                score: (bestMatch.isSameProgram && bestMatch.isSameSemester) ? 1
                    : bestMatch.isSameProgram ? 0.9
                    : bestMatch.isSameSemester ? 0.8
                    : 0.7,
                fuzzy: true,
                needsReview: !(bestMatch.isSameProgram && bestMatch.isSameSemester),
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

                categorizedOptions: electiveResult.categorizedOptions || {
                    bestMatch: null,
                    sameProgramSameSemester: [],
                    sameProgramOtherSemester: [],
                    otherProgramSameSemester: [],
                    otherProgramOtherSemester: []
                },

                totalOptions: electiveResult.options?.length || 0,
                bestMatchIndex: 0,
                recommendedAction: 'SELECT_ELECTIVE',
                reason: `Found ${electiveResult.options?.length || 0} elective options. Best match: ${bestMatch.courseName} (${bestMatch.credits} credits, ${bestMatch.matchReason})`
            };
        } else {
            console.log(`   No elective found for: ${courseName}`);
        }
    }

    const { lec, lab, isCombined } = findComponents(courseName, offeredCourses);
    if (isCombined) return buildCombinedResponse(lec, lab);

    if (expectsLab && !lab && lec) {
        console.log(`   Lab expected but not offered for: ${courseName}`);
        return {
            offering: lec,
            hasLab: false,
            hasLec: true,
            isCombined: false,
            labExpected: true,
            labNotOffered: true,
            score: 0.5,
            fuzzy: false,
            needsReview: true
        };
    }

    if (lec) return {
        offering: lec,
        hasLab: false,
        hasLec: true,
        isCombined: false,
        score: 1,
        fuzzy: false,
        needsReview: false
    };

    match = courseNameMatcher.findBestMatch(courseName.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim(), offeredCourses);
    return match || null;
}

export default findOffering;