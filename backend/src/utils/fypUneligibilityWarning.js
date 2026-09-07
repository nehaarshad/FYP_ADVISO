import helpingFunctions from './courseHelpingChecks.js';
const { computeCompletedCredits } = helpingFunctions;
import findElectiveSubstitute from './findElectiveSubstitute.js';


const DEGREE_TOTAL_CREDITS = 100;
const FYP_ELIGIBLE_SEMESTER = 6;

function buildFypEligibilityWarning({ currentSemester, degreeTranscript, suggestedCourses, suggestedCreditsTotal, roadmapCourses, offeredCourses, placedTimetables, placedNames }) {
    if (currentSemester !== FYP_ELIGIBLE_SEMESTER) return null;

    const rawTranscriptCredits = degreeTranscript?.totalEarnedCreditHours;
    const parsedTranscriptCredits = parseFloat(rawTranscriptCredits);
    const transcriptCredits = rawTranscriptCredits != null && !Number.isNaN(parsedTranscriptCredits)
        ? parsedTranscriptCredits
        : null;
    const completedCredits = transcriptCredits !== null ? transcriptCredits : computeCompletedCredits(suggestedCourses);

    const projectedTotal = completedCredits + suggestedCreditsTotal;

    if (projectedTotal === DEGREE_TOTAL_CREDITS) return null;

    const extraElective = findElectiveSubstitute({
        roadmapCourses,
        offeredCourses,
        currentSemester,
        placedTimetables,
        excludeNames: placedNames,
        excludeOfferingIds: new Set(),
        failedCourseCategory: null,
        program: null
    });

    return {
        completedCredits,
        suggestedCreditsTotal,
        projectedTotal,
        requiredTotal: DEGREE_TOTAL_CREDITS,
        message: projectedTotal < DEGREE_TOTAL_CREDITS
            ? `Your completed credits (${completedCredits}) plus this semester's suggested credits (${suggestedCreditsTotal}) total ${projectedTotal}, short of the ${DEGREE_TOTAL_CREDITS} required before FYP-1. Submit an application to register extra credit hours` +
              (extraElective ? ` and take the elective "${extraElective.courseName}" from your roadmap (no time clash with your other suggested courses) to reach eligibility for FYP-1 next semester.` : `. No additional clash-free roadmap elective was found this session — consult your advisor about options.`)
            : `Your completed credits (${completedCredits}) plus this semester's suggested credits (${suggestedCreditsTotal}) total ${projectedTotal}, above the ${DEGREE_TOTAL_CREDITS} required. Confirm with your advisor which courses are actually required before registering.`,
        suggestedExtraElective: extraElective?.courseName || null
    };
}

export default buildFypEligibilityWarning