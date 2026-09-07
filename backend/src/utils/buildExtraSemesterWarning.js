import helpingFunctions from './courseHelpingChecks.js';
const { isCoreCategory } = helpingFunctions;

function buildExtraSemesterWarning(suggestedCourses) {
    const failedCore = (suggestedCourses.failedCourses || []).filter(c => isCoreCategory(c.category));
    if (!failedCore.length) return null;

    return {
        failedCoreCourses: failedCore.map(c => c.courseName),
        message: `You have failed core course(s): ${failedCore.map(c => c.courseName).join(', ')}. Core courses generally aren't substitutable, so clearing all of them may require registering an additional semester (e.g. Semester 9) before you can graduate.`
    };
}


export default buildExtraSemesterWarning