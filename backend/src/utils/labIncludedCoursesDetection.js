const findComponents = (name, courses) => {
    //  Ensure offered courses is an array
    if (!courses || !Array.isArray(courses)) {
        console.warn(`   findComponents: courses is ${typeof courses}, expected array`);
        return { lec: null, lab: null, isCombined: false };
    }
    
    if (courses.length === 0) {
        console.warn(`   findComponents: courses array is empty`);
        return { lec: null, lab: null, isCombined: false };
    }

    const clean = name.replace(/\s*(lab|lec|lecture|practical)/gi, '').trim().toLowerCase();
    const lec = courses.find(o => { // find oop lec part offering
        const n = o.courseName.toLowerCase();
        return n.includes(clean) && (n.includes('lec') || n.includes('lecture'));
    });
    const lab = courses.find(o => {   //find oop lab part offering
        const n = o.courseName.toLowerCase();
        return n.includes(clean) && (n.includes('lab') || n.includes('practical'));
    });
    return { lec, lab, isCombined: !!(lec && lab) };
};

const checkIfCombined = (courseName, offeredCourses) => {
    const { isCombined } = findComponents(courseName, offeredCourses);
    return isCombined;
};

const buildCombinedResponse = (lec, lab) => ({
    offering: lec,
    labOffering: lab,
    hasLab: true,
    hasLec: true,
    isCombined: true,
    score: 1,
    fuzzy: false,
    needsReview: false
});

export default {findComponents,checkIfCombined,buildCombinedResponse}