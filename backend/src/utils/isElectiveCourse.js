const isElectiveCourse = (course) => {
    const name = course.courseName?.toLowerCase() || '';
    const category = course.categoryName?.toLowerCase() || '';
    return name.includes('elective') || category.includes('elective');
};

export default isElectiveCourse