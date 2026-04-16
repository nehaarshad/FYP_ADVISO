import CoursePreReqModel from "../models/coursePreReqModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import TranscriptCoursesDetail from "../models/TranscriptCoursesDetailModel.js"
import SessionalTranscript from "../models/sessionalTranscriptModel.js"
import DegreeTranscript from "../models/degreeTranscriptModel.js"
import CategoryModel from "../models/categoryModel.js"
import CourseCategoryModel from "../models/courseCategoryModel.js"
import CoursesModel from "../models/coursesModel.js"
import RoadmapModel from "../models/roadmapModel.js";
import Student from "../models/studentModel.js";
import getCreditHours from "../utils/getAllowedCredits.js";
import mapCourseOfferingsWithUnClearRoadmap from "../utils/sesssionOfferedCourses.js"
import transcriptAnalyzer from "../utils/fetchFWDgradeCourses.js";
import CourseOfferingModel from "../models/courseOfferingModel.js";
import BatchModel from "../models/batchModel.js";
import ProgramModel from "../models/programModel.js";
import SessionModel from '../models/sessionModel.js';
import SemesterRoadmapModel from "../models/semesterRoadmapModel.js";
import SemesterCourseModel from "../models/semesterCourseModel.js";
import RoadmapCourseCategoryModel from "../models/RoadmapCourseCategoryModel.js";
import TimetableModel from "../models/timetableModel.js";
import llmRecommendationService from "../services/llmRecommendationService.js";
import SessionalRecommendation from "../models/sessionalRecommdentationModel.js";
import SuggestedCourses from "../models/suggestedCoursesModel.js";

const recommendCourses = async (req, res) => {
    try {
        const { id } = req.params;
        const { sessionType, sessionYear } = req.body;
        
        const student = await Student.findOne({
            where: { id },
            include: [
                { 
                    model: StudentStatus,
                   
                },
                { 
                    model: BatchModel,
                }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        console.log("Student found:", student);

        const degreeTranscript = await DegreeTranscript.findOne({ 
            where: { studentId: student.id } 
        });

        if (!degreeTranscript) {
            return res.status(404).json({ success: false, message: "Degree transcript not found for the student" });
        }

        const sessionalTranscript = await SessionalTranscript.findAll({
            where: { degreeTranscriptId: degreeTranscript.id },
            include: [
                {
                    model: TranscriptCoursesDetail,
                
                }
            ]
        });

        if (!sessionalTranscript || sessionalTranscript.length === 0) {
            return res.status(404).json({ success: false, message: "Sessional transcript not found for the student" });
        }

        let hasCourseDetails = false;
        for (const transcript of sessionalTranscript) {
            const details = transcript.TranscriptCoursesDetails || transcript.TranscriptCoursesDetails;
            if (details && details.length > 0) {
                hasCourseDetails = true;
                break;
            }
        }

        if (!hasCourseDetails) {
            return res.status(400).json({ success: false, message: "No course details found in sessional transcripts" });
        }

        // Determine allowed credit hours based on CGPA
        let allowedCHR = getCreditHours(parseFloat(degreeTranscript.currentCGPA));
        console.log("Allowed Credit Hours:", allowedCHR);

        // Extract F, W and D grade courses
        let suggestedCourses = transcriptAnalyzer.analyzeTranscript(
            sessionalTranscript,
            {
                currentCGPA: parseFloat(degreeTranscript.currentCGPA),
                studentStatus: student.StudentStatus ? student.StudentStatus.currentStatus : "Unknown"
            }
        );
        console.log("Suggested Courses:", suggestedCourses);

        // Get new course offering list along with timetable
            let offeredCourses = await CourseOfferingModel.findAll({
                
                include: [
                    {
                        model: BatchModel,
                       
                    },
                    {
                        model: ProgramModel
                    },
                    {
                        model: SessionModel,
                        where: { 
                            sessionType: sessionType,
                            sessionYear: sessionYear
                        }
                    },
                    {
                        model: TimetableModel, 
                        
                    }
                ]
            });

         console.log("Offered Courses Count:", offeredCourses);

        const roadmapId = student.BatchModel.roadmapId;
        // Get student roadmap from the already fetched data
        let roadmap = await RoadmapModel.findOne({
                    where: { id: roadmapId },
                    include: [
                        {
                            model: RoadmapCourseCategoryModel,
                            include: [
                                {
                                model: CategoryModel,

                            }
                        ]
                    },
                    {
                        model: SemesterRoadmapModel,
                        include: [
                            {
                                model: SemesterCourseModel,
                                include: [
                                    {
                                        model: CourseCategoryModel,
                                        include: [
                                            {
                                                model: CoursesModel,
                                                attributes: ["id", "courseName", "courseCredits"],
                                                include: [{
                        
                                                        model: CoursePreReqModel,
                                                        as: "prerequisites",  // Courses this course requires (incoming)
                                                        include: [{
                                                            model: CoursesModel,
                                                            as: "prerequisiteCourse"
                                                        }]
                                                        },
                                                        {
                                                        model: CoursePreReqModel,
                                                        as: "usedAsPrerequisiteFor",  // Courses that require this course (outgoing)
                                                        include: [{
                                                            model: CoursesModel,
                                                            as: "mainCourse"
                                                        }]
                                                        
                                                        }]
                                            },
                                            {
                                                model: CategoryModel,
                                                attributes: ["id", "categoryName", "colorScheme"]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        
        if (!roadmap) {
            console.warn("No roadmap found for student's batch");
            return res.json({message:"Roadmap not found",success:false})
        }
        
        console.log("Roadmap:  ", roadmap)
       
            if (roadmap && roadmap.SemesterRoadmapModels) {
                  const { roadmapCourses } = await mapCourseOfferingsWithUnClearRoadmap(
                                        suggestedCourses, 
                                        roadmap.SemesterRoadmapModels,
                                    );
                
                const studentDataForLLM = {
                        currentSemester: student.currentSemester,
                        cgpa: degreeTranscript.currentCGPA,
                        failedCourses: suggestedCourses.failedCourses || [],
                        withdrawnCourses: suggestedCourses.withdrawnCourses || [],
                        dGradedCourses: suggestedCourses.dGradedCourses || [],
                        eligibleCourses: roadmapCourses.filter(c => 
                            c.prerequisiteStatus === 'CLEAR' && 
                            c.status !== 'Completed' &&
                            c.actionRequired !== 'RETAKE'
                        ).map(c => ({
                            courseId: c.id,
                            courseName: c.courseName,
                            credits: c.credits,
                            category: c.categoryName,
                            semester: c.semester
                        }))
                    };
        
        // Prepare offered courses for LLM
        const offeredCoursesForLLM = offeredCourses.map(oc => ({
            courseName: oc.courseName,
            credits: oc.credits,
            category: oc.courseCategory,
            timetables: (oc.TimetableModels || []).map(t => ({
                day: t.day,
                startTime: t.startTime,
                endTime: t.endTime,
                venue: t.venue,
                instructor: t.instructor,
                program: oc.ProgramModel?.programName || 'N/A',
                batch: oc.BatchModel?.batchName || 'N/A'
            }))
        }));
        
        const llmRecommendations = await llmRecommendationService.generateRecommendations(
            studentDataForLLM,
            offeredCoursesForLLM,
            allowedCHR,
            student.StudentStatus.currentStatus
        );
        
        // Save to database
        const session = await SessionModel.findOne({
            where: { sessionType, sessionYear }
        });
        
        const sessionalRecommendation = await SessionalRecommendation.create({
            recommendationText: llmRecommendations.detailedExplanation,
            recommendedCoursesSummary: llmRecommendations.summary,
            priorityWiseCourses: llmRecommendations.recommendations,
            totalCreditsAllowed: llmRecommendations.summary.totalCreditsAllowed,
            sessionId: session.id,
            studentId: student.id
        });
        
        // Save suggested courses
        const allRecommendations = [
                    ...(llmRecommendations.recommendations.critical || []).map(c => ({ ...c, priority: 'critical' })),
                    ...(llmRecommendations.recommendations.high || []).map(c => ({ ...c, priority: 'high' })),
                    ...(llmRecommendations.recommendations.medium || []).map(c => ({ ...c, priority: 'medium' })),
                    ...(llmRecommendations.recommendations.low || []).map(c => ({ ...c, priority: 'low' }))
                ];

        
        for (const rec of allRecommendations) {
          const suggestedCourses = await SuggestedCourses.create({
                 courseName: rec.courseName,
                credits: rec.credits,
                category: rec.category,
                sessionalRecommendationId: sessionalRecommendation.id,
                priority: rec.priority || llmRecommendationService.generateRecommendations(rec),
                reason: rec.reason,
                isOffered: rec.isOffered || false,
                offeredProgram: rec.offeredProgram,
                timeSlot: rec.timeSlot
            });
        }
        
        return res.status(200).json({
            success: true,
            data: {
                allowedCreditHours: allowedCHR,
                llmRecommendations: llmRecommendations,
                savedRecommendationId: sessionalRecommendation.id
            }
        });
        
    }
} catch (error) {
        console.error("Error recommending courses:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};


export default { recommendCourses };