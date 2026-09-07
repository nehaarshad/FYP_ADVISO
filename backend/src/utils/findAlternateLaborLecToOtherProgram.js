import helpingFunctions from '../utils/courseHelpingChecks.js';
const {  offeringProgramId } = helpingFunctions;

const findAlternateLabInOtherProgram = (offeredCourses, courseName, currentProgramId, placedTimetables) => {
    const cleanName = courseName.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim().toLowerCase();
    return offeredCourses.find(o => {
        const n = o.courseName.toLowerCase();
        return n.includes(cleanName) &&
               (n.includes('lab') || n.includes('practical')) &&
               offeringProgramId(o) !== currentProgramId;
    });
};

const findAlternateLectureInOtherProgram = (offeredCourses, courseName, currentProgramId, placedTimetables) => {
    const cleanName = courseName.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim().toLowerCase();
    return offeredCourses.find(o => {
        const n = o.courseName.toLowerCase();
        return n.includes(cleanName) &&
               (n.includes('lec') || n.includes('lecture')) &&
               offeringProgramId(o) !== currentProgramId;
    });
};

function findSecondAlternateLab(offeredCourses, courseName, currentProgramId, placedTimetables, excludeOfferingId) {
    const cleanName = courseName.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim().toLowerCase();
    return offeredCourses.find(o => {
        const n = o.courseName.toLowerCase();
        return n.includes(cleanName) &&
               (n.includes('lab') || n.includes('practical')) &&
               offeringProgramId(o) !== currentProgramId &&
               o.id !== excludeOfferingId &&
               !timeConflict.hasClash(o.timetables || [], placedTimetables);
    });
}

export default {findAlternateLabInOtherProgram,findAlternateLectureInOtherProgram,findSecondAlternateLab}