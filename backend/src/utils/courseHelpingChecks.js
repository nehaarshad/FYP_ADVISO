const offeringProgramName = (o) => o.ProgramModel?.programName ?? o.programName ?? null;
const offeringProgramId = (o) => o.ProgramModel?.id ?? o.programId ?? null;
const offeringCategory = (o) => (o.CategoryModel?.categoryName || o.courseCategory || o.courseCategory || '');
const isElectiveCategory = (categoryName) => !!categoryName && categoryName.trim().endsWith('Elective');
const isCoreCategory = (categoryName) => !!categoryName && !categoryName.trim().endsWith('Elective');
const creditsOf = (course) => course.courseCredits ?? course.credits ?? 0;
const hasLabComponent = (rawCredits) => typeof rawCredits === 'string' && rawCredits.includes('+');
const cleanCredits = (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        if (value.includes('+')) {
            return value.split('+').reduce((sum, part) => sum + (parseFloat(part.trim()) || 0), 0);
        }
        return parseFloat(value) || 0;
    }
    return 0;
};
function allocateByCredits(orderedItems, allowedCredits) {
    let used = 0;
    const included = [];
    const deferred = [];
    const clashWarnings = [];

    for (const item of orderedItems) {
        const hasLabClash = item.actionRequired === 'LAB_CLASH_WARNING' || item.actionRequired === 'NEW_LAB_CLASH';
        const credits = hasLabClash ? 0 : cleanCredits(item.credits);

        console.log(`  Attempting to add: ${item.courseName} (${credits} credits)`);

        if (hasLabClash) {
            included.push(item);
            clashWarnings.push({
                courseName: item.courseName,
                clashSlots: item.clashSlots,
                clashesWith: item.clashesWith || null,
                originalCredits: item.originalCredits || 0,
                message: ' Lab clash - credits excluded'
            });
            console.log(`    Added with 0 credits (lab clash)`);
        } else if (used + credits <= allowedCredits) {
            included.push(item);
            used += credits;
            console.log(`   Added - Used: ${used}/${allowedCredits}`);
        } else {
            deferred.push(item);
            console.log(`  Deferred - Would exceed limit`);
        }
    }

    if (clashWarnings.length) {
        console.log('\n LAB CLASH WARNINGS:');
        clashWarnings.forEach(w => {
            console.log(`  ${w.message}: ${w.courseName}`);
            console.log(`    Clash slots: ${w.clashSlots}${w.clashesWith ? ` (with ${w.clashesWith})` : ''}`);
            console.log(`    Original credits: ${w.originalCredits} → 0`);
        });
    }

    return { included, deferred, used, clashWarnings };
}

function computeCompletedCredits(suggestedCourses) {
    const passing = [
        ...(suggestedCourses.completedCourses || []),
        ...(suggestedCourses.dGradedCourses || [])
    ];
    return passing.reduce((sum, c) => sum + (creditsOf(c) || 0), 0);
}

export default {cleanCredits,allocateByCredits,computeCompletedCredits,offeringCategory,offeringProgramId,offeringProgramName,isElectiveCategory,isCoreCategory,creditsOf,hasLabComponent}