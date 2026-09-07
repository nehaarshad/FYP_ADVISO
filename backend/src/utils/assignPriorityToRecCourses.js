import isElectiveCourse from "./isElectiveCourse.js";

const getPriority = (course) => {
    const isPrereq = (course.dependentCourses?.length || 0) > 0;
    const isCore = course.categoryName && !isElectiveCourse(course);
    if (isPrereq || course.__grade === 'F') return 'critical';
    if (isCore || course.__grade === 'W') return 'high';
    return 'medium';
};

const getAllCourseNames = (buckets) =>['critical', 'high', 'medium', 'low'].flatMap(p => buckets[p].map(c => c.courseName));

export default {getAllCourseNames,getPriority}