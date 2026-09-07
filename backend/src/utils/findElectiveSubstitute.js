import getElectiveCategory from './getElectiveCategory.js';
import getCompletedCourseNames from './clearCoursesNames.js';
import findOffering from './offerCoursesInSameProgram.js';
import timeConflict from './timeConflict.js';
import helpingFunctions from './courseHelpingChecks.js';
const { offeringCategory, hasLabComponent, cleanCredits,isElectiveCategory } = helpingFunctions;


const findElectiveSubstitute = ({ 
    roadmapCourses, 
    offeredCourses, 
    currentSemester, 
    placedTimetables, 
    excludeNames, 
    excludeOfferingIds, 
    failedCourseCategory, 
    program 
}) => {
    const category = failedCourseCategory || '';
    const categoryType = getElectiveCategory(category);

    const completedNames = getCompletedCourseNames(roadmapCourses);

    // Find eligible elective candidates from roadmap
    const candidates = roadmapCourses.filter(c =>
        !c.isCompleted &&
       isElectiveCategory(c.categoryName)  &&
        (getElectiveCategory(c.categoryName) === categoryType || 
         c.categoryName?.toLowerCase().includes(categoryType?.toLowerCase() || '')) &&
        c.semester <= currentSemester &&
        !excludeNames.has(c.courseName.toLowerCase())
    );

    console.log(`  Found ${candidates.length} elective candidates in roadmap`);

    // Try each candidate
    for (const candidate of candidates) {
        const match = findOffering(
            candidate.courseName, 
            cleanCredits(candidate.credits),
            offeredCourses, 
            program, 
            currentSemester, 
            placedTimetables, 
            {
                expectsLab: hasLabComponent(candidate.credits),
                requiredCredits: cleanCredits(candidate.credits)
            }
        );
        
        if (!match) continue;
        if (excludeOfferingIds.has(match.offering?.id)) continue;
        if (timeConflict.hasClash(match.offering?.timetables || [], placedTimetables)) continue;

        console.log(`  ✅ Found substitute: ${candidate.courseName} → ${match.offering?.courseName}`);
        return { 
            courseName: candidate.courseName, 
            credits: candidate.credits, 
            offering: match.offering, 
            isElectiveMatch: true 
        };
    }

    // Fallback: any offered elective (no clash)
    console.log(`  No roadmap electives found, trying any offered elective...`);
    
    const anyElective = offeredCourses.find(o => {
        const category = offeringCategory(o).toLowerCase();
        return category.includes('elective') &&
               !timeConflict.hasClash(o.timetables || [], placedTimetables) &&
               !excludeOfferingIds.has(o.id) &&
               !completedNames.has(o.courseName.toLowerCase());
    });

    if (anyElective) {
        console.log(`  ✅ Found any elective: ${anyElective.courseName}`);
        return { 
            courseName: anyElective.courseName, 
            credits: anyElective.credits || 3, 
            offering: anyElective, 
            isElectiveMatch: true, 
            isFallback: true 
        };
    }

    console.log(`  ❌ No elective substitute found`);
    return null;
};

export default findElectiveSubstitute;