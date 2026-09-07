import assignPriority from './assignPriorityToRecCourses.js'
const RESTRICTED_STATUSES = ['relegated', 'serious warning'];
import buildExtraSemesterWarning from './buildExtraSemesterWarning.js';
import helpingFunctions from '../utils/courseHelpingChecks.js';
const {allocateByCredits} =helpingFunctions;
import buildFypEligibilityWarning from '../utils/fypUneligibilityWarning.js'

function buildFinalResponse(
    recommendations,
    totalUsedCredits,
    allowedCredits,
    specialRequests,
    suggestedCourses,
    roadmapCourses,
    offeredCourses,
    startTime,
    placedTimetables,
    placedNames,
    currentSemester,
    cgpa,
    studentStatus,
    degreeTranscript,
    isNormalMode = false
) {
    console.log('\n--- CREDIT ALLOCATION SUMMARY ---');
    console.log(`Total credits allocated: ${totalUsedCredits}/${allowedCredits}`);

    let finalRecommendations = recommendations;
    let used = totalUsedCredits;
    let deferred = [];

    if (totalUsedCredits > allowedCredits) {
        console.log(`\n WARNING: Credits (${totalUsedCredits}) exceed limit (${allowedCredits})`);
        console.log('Trimming excess courses...');

        // Flatten all recommendations into priority order
        const allCourses = [
            ...recommendations.critical.map(c => ({ ...c, __priority: 'critical' })),
            ...recommendations.high.map(c => ({ ...c, __priority: 'high' })),
            ...recommendations.medium.map(c => ({ ...c, __priority: 'medium' })),
            ...recommendations.low.map(c => ({ ...c, __priority: 'low' })),
        ];

        // Allocate within credit limit
        const { included, deferred: deferredItems } = allocateByCredits(allCourses, allowedCredits);
        deferred = deferredItems;

        // Rebuild recommendations with only included courses
        finalRecommendations = { critical: [], high: [], medium: [], low: [] };
        for (const item of included) {
            const { __priority, ...rest } = item;
            finalRecommendations[__priority].push(rest);
        }

        used = included.reduce((sum, c) => sum + (c.credits || 0), 0);
        console.log(`Final credits after trimming: ${used}/${allowedCredits}`);
        console.log(`Deferred courses: ${deferred.length}`);
    }

    console.log('\n--- FINAL RECOMMENDATIONS ---');
    console.log(`Critical: ${finalRecommendations.critical.length}`);
    console.log(`High: ${finalRecommendations.high.length}`);
    console.log(`Medium: ${finalRecommendations.medium.length}`);
    console.log(`Low: ${finalRecommendations.low.length}`);
    console.log(`Special Requests: ${specialRequests.length}`);
    console.log(`Total credits: ${used}/${allowedCredits}`);

    console.log(`\n--- BUILDING WARNINGS ---`);
    const extraSemesterWarning = buildExtraSemesterWarning(suggestedCourses);

    const fypEligibilityWarning = buildFypEligibilityWarning({
        currentSemester,
        degreeTranscript,
        suggestedCourses,
        suggestedCreditsTotal: used,  
        roadmapCourses,
        offeredCourses,
        placedTimetables,
        placedNames,
    });

    console.log(`Extra semester warning: ${extraSemesterWarning ? 'Yes' : 'No'}`);
    console.log(`FYP eligibility warning: ${fypEligibilityWarning ? 'Yes' : 'No'}`);

    const allCourseNames = assignPriority.getAllCourseNames(finalRecommendations);
    const isRestricted = cgpa < 2.0 || RESTRICTED_STATUSES.some(s => (studentStatus || '').toLowerCase().includes(s));

    const scenarios = [{
        scenario: 1,
        totalCredits: used,
        courses: allCourseNames,
        description: isRestricted
            ? 'Restricted registration — only F/W (mandatory) and D (optional improvement) grade retakes, per academic status.'
            : `Priority-ordered registration within ${allowedCredits} credit hours.`
    }];

    if (deferred.length) {
        scenarios.push({
            scenario: 2,
            totalCredits: used + deferred.reduce((s, c) => s + (c.credits || 0), 0),
            courses: [...allCourseNames, ...deferred.map(c => c.courseName)],
            description: 'All eligible courses (for advisor reference only).'
        });
    }

    const detailExplanation = isRestricted
        ? `Your CGPA (${cgpa}) / academic status (${studentStatus}) restricts you to retaking F, W, and D grade courses only — no new courses may be registered this session.`
        : `Recommendations prioritize failed/withdrawn courses (especially prerequisites blocking your roadmap), then D-grade improvements, then new semester-${currentSemester} courses, capped at ${allowedCredits} allowed credit hours. Any eligible course beyond the cap is listed separately as deferred/all-eligible for advisor reference.`;

    const totalTime = Date.now() - startTime;
    console.log('\n=== RECOMMENDATION GENERATION COMPLETE ===');
    console.log(`Total time: ${totalTime}ms`);

    return {
        summary: {
            totalRequiredCredits: used,
            totalCreditsAllowed: allowedCredits,
            priorityBreakdown: {
                critical: finalRecommendations.critical.length,
                high: finalRecommendations.high.length,
                medium: finalRecommendations.medium.length,
                low: finalRecommendations.low.length,
            },
            totalCoursesRecommended: finalRecommendations.critical.length + 
                                    finalRecommendations.high.length + 
                                    finalRecommendations.medium.length + 
                                    finalRecommendations.low.length,
            hasSpecialRequests: specialRequests.length > 0,
            hasWarnings: !!(extraSemesterWarning || fypEligibilityWarning),
        },
        recommendations: finalRecommendations,
        deferredCourses: deferred,
        creditAllocationScenarios: scenarios,
        specialRequests,
        extraSemesterWarning,
        fypEligibilityWarning,
        detailedExplanation: detailExplanation,

        metadata: {
            processingTimeMs: totalTime,
            isRestricted,
            currentSemester,
            cgpa,
            studentStatus,
            allowedCredits,
            usedCredits: used,
        }
    };
}

export default buildFinalResponse;