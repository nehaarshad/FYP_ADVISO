import timeConflict from "./timeConflict";
import helpingFunctions from './courseHelpingChecks';
const {cleanCredits,offeringProgramId,offeringProgramName} =helpingFunctions


const buildCourseResult = (offering) => {
    return {
        offering,
        courseName: offering.courseName,
        credits: cleanCredits(offering.credits || 3),
        program: offeringProgramName(offering),
        programId: offeringProgramId(offering),
        timeSlot: timeConflict.formatTimetable(offering.timetables),
        timetableDetails: (offering.timetables || []).map(t => ({
            day: t.day || t.dayOfWeek,
            startTime: t.startTime,
            endTime: t.endTime,
            room: t.room || t.venue || 'TBA',
            instructor: t.instructor || t.teacher || 'TBA',
            section: t.section || 'N/A'
        })),
        batch: offering.BatchModel?.batchName || 'N/A'
    };
};

export default buildCourseResult