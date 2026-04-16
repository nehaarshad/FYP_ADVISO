const mapCourseOfferingsWithUnClearRoadmap = async (suggestedCourses, SemesterRoadmapModels) => {
  
       const completedNames = new Set(suggestedCourses.completedCourses?.map(c => c.courseName.toLowerCase()) || []);
    const failedNames = new Set(suggestedCourses.failedCourses?.map(c => c.courseName.toLowerCase()) || []);
    const dGradeNames = new Set(suggestedCourses.dGradedCourses?.map(c => c.courseName.toLowerCase()) || []);
    const withdrawNames = new Set(suggestedCourses.withdrawnCourses?.map(c => c.courseName.toLowerCase()) || []);

    let roadmapCourses = [];
    let coursePrerequisiteMap = new Map();
    let courseDependencyMap = new Map();

    console.log("PROCESSING ROADMAP COURSES WITH PREREQUISITES");

    // Process each course
    for (const semester of SemesterRoadmapModels) {
        for (const semesterCourse of semester.SemesterCourseModels || []) {
            const courseCategory = semesterCourse?.CourseCategoryModel;
            const course = courseCategory?.CoursesModel;
            const category = courseCategory?.CategoryModel;
            
            if (!course?.courseName) continue;

            const courseName = course.courseName;
            const isCompleted = completedNames.has(courseName.toLowerCase());
            
            // Skip completed courses
            if (isCompleted) {
                console.log(`\n SKIPPING (Completed): ${courseName}`);
                continue;
            }

            const isFailed = failedNames.has(courseName.toLowerCase());
            const hasDGraded = dGradeNames.has(courseName.toLowerCase());
            const isWithdrawn = withdrawNames.has(courseName.toLowerCase());

            // Get valid prerequisites and dependencies
            const prerequisites = (course.prerequisites || [])
                .filter(p => p.preReqCourseId && p.prerequisiteCourse)
                .map(p => formatPrerequisite(p, completedNames, failedNames, dGradeNames))
                .filter(Boolean);

            const dependentCourses = (course.usedAsPrerequisiteFor || [])
                .filter(d => d.preReqCourseId && d.mainCourse)
                .map(d => formatDependent(d, completedNames, failedNames, SemesterRoadmapModels))
                .filter(Boolean);

            // Get course status
            const { status, action: statusAction, msg: statusMsg } = getCourseStatus(isFailed, isWithdrawn, hasDGraded);
            
            // Check prerequisites
            const prereqCheck = checkPrerequisites(prerequisites);
            const finalAction = prereqCheck.action === 'ELIGIBLE_WITH_WARNING' ? statusAction : (prereqCheck.action || statusAction);
            const finalRecommendation = prereqCheck.status !== 'CLEAR' ? prereqCheck.msg : statusMsg;

            // Log output
            console.log(`\n${courseName} (Semester ${semester.semesterNo}):`);
            if (prerequisites.length) {
                console.log(`    PREREQUISITES:`);
                prerequisites.forEach((p, i) => {
                    const icon = p.isCompleted ? 'DONE' : (p.isFailed ? 'Failed' : (p.hasDGraded ? 'Warning' : 'pendind'));
                    console.log(`      ${i+1}. ${icon} ${p.name} - ${p.status}`);
                });
            } else {
                console.log(`   No prerequisites required`);
            }
            
            if (dependentCourses.length) {
                console.log(`   DEPENDENTS:`);
                dependentCourses.forEach((d, i) => {
                    const icon = d.isCompleted ? 'done' : (d.isFailed ? 'failed' : 'pending');
                    console.log(`      ${i+1}. ${icon} ${d.name} (Sem ${d.semester}) - ${d.status}`);
                });
            }
            console.log(`    ${prereqCheck.status}: ${prereqCheck.msg}`);

            // Build course data object
            const courseData = {
                id: course.id,
                courseName,
                courseCode: course.courseCode,
                credits: course.courseCredits,
                categoryId: category?.id,
                categoryName: category?.categoryName,
                semester: semester.semesterNo,
                isCompleted, isFailed, hasDGraded, isWithdrawn,
                prerequisites,
                dependentCourses,
                status,
                actionRequired: finalAction,
                recommendation: finalRecommendation,
                prerequisiteStatus: prereqCheck.status,
                prerequisiteMessage: prereqCheck.msg
            };

            roadmapCourses.push(courseData);
            coursePrerequisiteMap.set(courseName.toLowerCase(), courseData);

            // Build dependency map
            dependentCourses.forEach(dep => {
                const key = dep.name?.toLowerCase();
                if (key) {
                    if (!courseDependencyMap.has(key)) courseDependencyMap.set(key, []);
                    courseDependencyMap.get(key).push({
                        dependentCourse: courseName,
                        dependentSemester: semester.semesterNo,
                        dependentStatus: status
                    });
                }
            });
        }
    }
    
    return { 
        roadmapCourses, 
        coursePrerequisiteMap, 
        courseDependencyMap
    };
};

const getCourseStatus = (isFailed, isWithdrawn, hasDGraded) => {
    if (isFailed) return { status: 'Failed', action: 'RETAKE', msg: 'MUST RETAKE - Course failed' };
    if (isWithdrawn) return { status: 'Withdrawn', action: 'RETAKE', msg: 'MUST RETAKE - Course withdrawn' };
    if (hasDGraded) return { status: 'D Grade', action: 'IMPROVEMENT_RECOMMENDED', msg: 'CAN IMPROVE - Low passing grade (D)' };
    return { status: 'Pending', action: 'NEW', msg: 'NEW COURSE - Eligible to take' };
};

// Helper function to check prerequisite status
const checkPrerequisites = (prerequisites) => {
    const failed = prerequisites.filter(p => !p.isCompleted && p.isFailed);
    const pending = prerequisites.filter(p => !p.isCompleted && !p.isFailed && !p.hasDGraded);
    const dGrade = prerequisites.filter(p => !p.isCompleted && p.hasDGraded);
    
    if (failed.length) {
        return { status: 'BLOCKED', msg: ` Failed: ${failed.map(p => p.name).join(', ')}`, action: 'PREREQUISITE_BLOCKED' };
    }
    if (pending.length) {
        return { status: 'BLOCKED', msg: ` Pending: ${pending.map(p => p.name).join(', ')}`, action: 'PREREQUISITE_BLOCKED' };
    }
    if (dGrade.length) {
        return { status: 'WARNING', msg: `D Grade: ${dGrade.map(p => p.name).join(', ')}`, action: 'ELIGIBLE_WITH_WARNING' };
    }
    return { status: 'CLEAR', msg: 'All prerequisites cleared', action: null };
};

// Helper to format prerequisite objects
const formatPrerequisite = (prereqRelation, completedNames, failedNames, dGradeNames) => {
    const prereq = prereqRelation.prerequisiteCourse;
    if (!prereq) return null;
    const name = prereq.courseName;
    return {
        id: prereq.id,
        name,
        code: prereq.courseCode,
        credits: prereq.courseCredits,
        isCompleted: completedNames.has(name?.toLowerCase()),
        isFailed: failedNames.has(name?.toLowerCase()),
        hasDGraded: dGradeNames.has(name?.toLowerCase()),
        status: completedNames.has(name?.toLowerCase()) ? 'Completed' 
              : (failedNames.has(name?.toLowerCase()) ? 'Failed' 
              : (dGradeNames.has(name?.toLowerCase()) ? 'D Grade' : 'Pending'))
    };
};

// Helper to format dependent courses
const formatDependent = (depRelation, completedNames, failedNames, semesterRoadmaps) => {
    const dep = depRelation.mainCourse;
    if (!dep) return null;
    const name = dep.courseName;
    return {
        id: dep.id,
        name,
        code: dep.courseCode,
        credits: dep.courseCredits,
        semester: getSemesterNumberForCourse(semesterRoadmaps, dep.id),
        isCompleted: completedNames.has(name?.toLowerCase()),
        isFailed: failedNames.has(name?.toLowerCase()),
        status: completedNames.has(name?.toLowerCase()) ? 'Completed' : (failedNames.has(name?.toLowerCase()) ? 'Failed' : 'Pending')
    };
};

const getSemesterNumberForCourse = (semesterRoadmaps, courseId) => {
    for (const semester of semesterRoadmaps) {
        const found = semester.SemesterCourseModels?.find(sc => 
            sc.CourseCategoryModel?.CoursesModel?.id === courseId
        );
        if (found) return semester.semesterNo;
    }
    return 'Unknown';
};


export default mapCourseOfferingsWithUnClearRoadmap;