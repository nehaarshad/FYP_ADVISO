// utils/fetchFWDgradeCourses.js

class TranscriptAnalyzer {

    constructor(config = {}) {
        this.config = {
            passingGrades: ['A+', 'A', 'B', 'C', 'D'],
            goodGrades: ['A+', 'A', 'B', 'C'],
            failingGrades: ['F'],
            withdrawnGrades: ['W'],
            ...config
        };
        
        this.courseCategories = config.courseCategories || {};
        this.courseGradeMap = new Map();
        this.categoryCompletionMap = new Map(); // FIX: Added this missing initialization
    }

    /**
     * Normalize course name for consistent matching
     */
    normalizeCourseName(courseName) {
        if (!courseName) return '';
        return courseName.toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ');
    }

    // Check if grade is passing 
    isPassingGrade(grade) {
        return this.config.passingGrades.includes(grade);
    }

    //Check if grade is good (not D)
    isGoodGrade(grade) {
        return this.config.goodGrades.includes(grade);
    }

    //Collect all course attempts from transcripts
    collectCourseAttempts(sessionalTranscripts) {
        // Handle both array and single object
        const transcripts = Array.isArray(sessionalTranscripts) ? sessionalTranscripts : [sessionalTranscripts];
        
        transcripts.forEach(transcript => {
            // FIX: Check if TranscriptCoursesDetails exists and is an array
            const coursesDetails = transcript.TranscriptCoursesDetails || [];
            
            coursesDetails.forEach(courseDetail => {
                // FIX: Handle different property naming conventions
                const courseName = courseDetail.courseName || courseDetail.CourseName;
                const courseCode = courseDetail.courseCode || courseDetail.CourseCode;
                const courseCategory = courseDetail.courseCategory || courseDetail.CourseCategory;
                const grade = courseDetail.grade || courseDetail.Grade;
                const creditHours = courseDetail.totalCreditHours || courseDetail.creditHours || courseDetail.CreditHours || 3.0;
                const semester = transcript.semester || transcript.Semester || 1;
                
                // Skip if no course name or grade
                if (!courseName || !grade) return;
                
                const normalizedName = this.normalizeCourseName(courseName);
                
                if (!this.courseGradeMap.has(normalizedName)) {
                    // Initialize course data if not present in the map
                    this.courseGradeMap.set(normalizedName, {
                        originalNames: new Set([courseName]),
                        attempts: [],
                        code: courseCode,
                        category: courseCategory,
                        creditHours: creditHours,
                    });
                }
                
                // Add attempt data to the course entry
                const courseData = this.courseGradeMap.get(normalizedName);
                courseData.originalNames.add(courseName);
                courseData.attempts.push({
                    grade,
                    creditHours,
                    semester,
                    courseCode,
                    courseCategory,
                    originalName: courseName,
                });
            });
        });
        
        // Sort attempts by semester for each course
        for (const [_, courseData] of this.courseGradeMap) {
            courseData.attempts.sort((a, b) => a.semester - b.semester);
        }
    }

    //Analyze individual course history
    analyzeCourse(courseName, courseData) {
        const attempts = courseData.attempts;
        const latestAttempt = attempts[attempts.length - 1];
        const latestGrade = latestAttempt.grade;
        
        // Check if the student has ever passed the course in any attempt
        const hasEverPassed = attempts.some(attempt => this.isPassingGrade(attempt.grade));
        // Check if the student has ever achieved a good grade (C or above) in any attempt
        const hasGoodGrade = attempts.some(attempt => this.isGoodGrade(attempt.grade));
        
        // Count the number of failing and withdrawn attempts
        const failCount = attempts.filter(a => this.config.failingGrades.includes(a.grade)).length;
        const withdrawCount = attempts.filter(a => this.config.withdrawnGrades.includes(a.grade)).length;
        
        const analysis = {
            courseName,
            creditHours: latestAttempt.creditHours,
            attempts: attempts.length,
            latestGrade,
            failCount,
            withdrawCount,
            hasEverPassed,
            hasGoodGrade,
            history: attempts.map(a => `${a.grade} (Sem ${a.semester})`).join(' → '),
            category: courseData.category,
            improvementNeeded: false,
            status: '',
            recommendation: '',
            actionRequired: ''
        };
        
        // Determine status and recommendation
        if (latestGrade === 'F') {
            analysis.status = 'FAILED';
            analysis.improvementNeeded = true;
            analysis.actionRequired = 'RETAKE';
            const canSubstitute = analysis.category && 
                                 analysis.category !== "University Elective" &&
                                 analysis.category.endsWith("Elective");
            analysis.recommendation = canSubstitute 
                ? `MUST RETAKE - Can Substitute with other course from ${analysis.category} Category` 
                : 'MUST RETAKE - Course failed';
        } 
        else if (latestGrade === 'W' && !hasEverPassed) {
            analysis.status = 'WITHDRAWN';
            analysis.actionRequired = 'RETAKE';
            analysis.improvementNeeded = true;
            const canSubstitute = analysis.category && 
                                 analysis.category !== "University Elective" &&
                                 analysis.category.endsWith("Elective");
            analysis.recommendation = canSubstitute 
                ? `MUST RETAKE - Can Substitute with other course from ${analysis.category} Category` 
                : 'MUST RETAKE - Course withdrawn without ever passing';
        }
        else if (latestGrade === 'D') {
            analysis.status = 'PASSING_LOW';
            analysis.actionRequired = 'IMPROVEMENT_RECOMMENDED';
            analysis.improvementNeeded = true;
            const canSubstitute = analysis.category && 
                                 analysis.category !== "University Elective" &&
                                 analysis.category.endsWith("Elective");
            analysis.recommendation = canSubstitute 
                ? `Can Substitute with other course from ${analysis.category} Category` 
                : 'CAN IMPROVE - Low passing grade (D)';
        }
        else if (this.isGoodGrade(latestGrade)) {
            analysis.status = 'PASSING_GOOD';
            analysis.improvementNeeded = false;
            analysis.actionRequired = 'NONE';
            analysis.recommendation = 'COMPLETED - Satisfactory grade';
        }
        
        return analysis;
    }

    // Generate course recommendations based on CGPA
    generateRecommendations(analysisResults, currentCGPA, studentStatus) {
        const recommendations = {
            mandatoryRetakes: [],
            improvementSuggestions: [],
            completedCourses: [],
            totalRequiredCredits: 0,
            totalSuggestedCredits: 0
        };
        
        for (const course of analysisResults) {
            switch (course.actionRequired) {
                case 'RETAKE':
                    recommendations.mandatoryRetakes.push(course);
                    recommendations.totalRequiredCredits += course.creditHours || 0;
                    break;
                case 'IMPROVEMENT_RECOMMENDED':
                    recommendations.improvementSuggestions.push(course);
                    recommendations.totalSuggestedCredits += course.creditHours || 0;
                    break;
                case 'NONE':
                    recommendations.completedCourses.push(course);
                    break;
                default:
                    console.warn(`Unknown action required for course ${course.courseName}`);
            }
        }
        
        // Prioritize based on CGPA
        if (currentCGPA < 2.0 || (studentStatus && (studentStatus.toLowerCase() === "relegated" || studentStatus.toLowerCase() === "serious warning"))) {
            recommendations.priority = 'HIGH';
            recommendations.message = `Based on Current CGPA (${currentCGPA}) & Student Status (${studentStatus}) - Mandatory retakes required`;
        } 
        else if (currentCGPA < 2.5) {
            recommendations.priority = 'MEDIUM';
            recommendations.message = 'CGPA below 2.5 - Strongly recommend improving D grades';
        } 
        else {
            recommendations.priority = 'LOW';
            recommendations.message = 'CGPA satisfactory - No mandatory retakes, but consider improving D grades for better performance';
        }
        
        return recommendations;
    }

    analyzeTranscript(sessionalTranscripts, options = {}) {
        try {
            // Clear maps for fresh analysis
            this.courseGradeMap.clear();
            this.categoryCompletionMap.clear();
            
            // Collect all attempts
            this.collectCourseAttempts(sessionalTranscripts);
            
            // Analyze each course
            const analysisResults = [];
            for (const [_, courseData] of this.courseGradeMap) { // FIX: Added _ to get the value
                const analysis = this.analyzeCourse(
                    Array.from(courseData.originalNames)[0], 
                    courseData
                );
                analysisResults.push(analysis);
            }
            
            // Generate recommendations
            const recommendations = this.generateRecommendations(
                analysisResults, // FIX: Changed from remainingCourses to analysisResults
                options.currentCGPA || 0,
                options.studentStatus || "Promoted"
            );
            
            // Return comprehensive result
            return {
                success: true,
                timestamp: new Date().toISOString(),
                summary: {
                    totalCoursesAnalyzed: analysisResults.length,
                    mandatoryRetakes: recommendations.mandatoryRetakes.length,
                    improvementSuggestions: recommendations.improvementSuggestions.length,
                    completedCourses: recommendations.completedCourses.length,
                },
                failedCourses: recommendations.mandatoryRetakes,
                dGradedCourses: recommendations.improvementSuggestions,
                withdrawnCourses: analysisResults.filter(c => c.status === 'WITHDRAWN'),
                completedCourses: recommendations.completedCourses,
                recommendations: recommendations,
                detailedAnalysis: analysisResults
            };
        } catch (error) {
            console.error("Error in analyzeTranscript:", error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
                summary: {
                    totalCoursesAnalyzed: 0,
                    mandatoryRetakes: 0,
                    improvementSuggestions: 0,
                    completedCourses: 0,
                },
                failedCourses: [],
                dGradedCourses: [],
                withdrawnCourses: [],
                completedCourses: [],
                recommendations: {
                    mandatoryRetakes: [],
                    improvementSuggestions: [],
                    completedCourses: [],
                    totalRequiredCredits: 0,
                    totalSuggestedCredits: 0,
                    priority: 'LOW',
                    message: 'Error analyzing transcript'
                },
                detailedAnalysis: []
            };
        }
    }
}

const transcriptAnalyzer = new TranscriptAnalyzer();
export default transcriptAnalyzer;

