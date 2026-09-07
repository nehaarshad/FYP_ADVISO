const findExactCreditSubstitute = ({
    courseName,
    offeredCourses,
    program,
    currentSemester,
    placedTimetables,
    placedOfferingIds,
    requiredCredits,
    roadmapCourses = [],
    requiredSemester = 0
}) => {
    console.log(`  🔍 Looking for exact credit substitute (${requiredCredits} credits)`);

    const completedNames = getCompletedCourseNames(roadmapCourses);

    const isUsable = (o) => {
        if (isDeficiencyCourse(o)) return false;
        if (placedOfferingIds.has(o.id)) return false;
        if (completedNames.has(o.courseName.toLowerCase())) return false;
        if (timeConflict.hasClash(o.timetables || [], placedTimetables)) return false;
        return cleanCredits(o.credits || 3) === requiredCredits;
    };

    // FIX #12: alias pass first
    for (const aliasOffering of findAliasOfferings(courseName, offeredCourses)) {
        if (isUsable(aliasOffering)) {
            console.log(`  📌 Found specific mapping: ${courseName.toLowerCase()} → ${aliasOffering.courseName}`);
            return buildCourseResult(aliasOffering);
        }
    }

    const tokens = courseName.toLowerCase().split(' ').filter(t => t.length > 3);

    const findMatch = (courses) => {
        let bestMatch = null;
        let bestScore = -1;

        for (const o of courses) {
            const n = o.courseName.toLowerCase();
            const availableCredits = cleanCredits(o.credits || 3);
            const sem = parseSemesterFromCourseName(o.courseName);

            // FIX #8: Skip deficiency/remedial courses for regular substitutes
            if (isDeficiencyCourse(o)) {
                console.log(`    ⏭️ Skipping deficiency course: ${o.courseName}`);
                continue;
            }

            // FIX #8: Must have at least ONE word overlap
            const hasWordOverlap = tokens.some(token => n.includes(token));
            if (!hasWordOverlap) continue;

            if (availableCredits !== requiredCredits) continue;
            if (placedOfferingIds.has(o.id)) continue;
            if (completedNames.has(n)) continue;
            if (timeConflict.hasClash(o.timetables || [], placedTimetables)) continue;

            // Semester check
            if (requiredSemester && sem && sem < requiredSemester) continue;

            // Score: word overlap count + semester closeness
            const wordScore = tokens.reduce((score, token) => score + (n.includes(token) ? 1 : 0), 0);
            const semesterScore = requiredSemester ? Math.max(0, 10 - Math.abs(sem - requiredSemester)) : 5;
            const totalScore = wordScore + semesterScore;

            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestMatch = o;
            }
        }
        return bestMatch;
    };

    let best = findMatch(offeredCourses.filter(o => offeringProgramName(o) === program));
    if (best) {
        console.log(`  ✅ Found exact credit substitute in same program: ${best.courseName}`);
        return buildCourseResult(best);
    }

    best = findMatch(offeredCourses);
    if (best) {
        console.log(`  ✅ Found exact credit substitute in other program: ${best.courseName}`);
        return buildCourseResult(best);
    }

    return null;
};

// (e.g., "Pakistan Studies" → "Ideology & Cons of Pakistan")

export default findExactCreditSubstitute