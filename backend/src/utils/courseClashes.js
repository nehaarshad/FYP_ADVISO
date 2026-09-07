import timeConflict from './timeConflict.js';
const findClashingCourse = (offeringTimetables, placedTimetables) => {
    const clashDetails = [];
    for (const slot of (offeringTimetables || [])) {
        for (const placed of placedTimetables) {
            if (timeConflict.slotsOverlap(slot, placed)) {
                clashDetails.push({
                    courseName: placed.courseName || 'another scheduled course',
                    time: timeConflict.formatTimetable([placed]),
                    day: placed.day || placed.dayOfWeek,
                    startTime: placed.startTime,
                    endTime: placed.endTime
                });
            }
        }
    }
    return clashDetails.length ? clashDetails : null;
};

const describeClash = (offeringTimetables, placedTimetables) => {
    const clashes = findClashingCourse(offeringTimetables, placedTimetables);
    if (!clashes) return null;
    return [...new Set(clashes.map(c => c.courseName))].join(', ');
};

export default {describeClash,findClashingCourse}