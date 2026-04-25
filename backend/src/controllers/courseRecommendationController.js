import CoursePreReqModel from "../models/coursePreReqModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import TranscriptCoursesDetail from "../models/TranscriptCoursesDetailModel.js"
import SessionalTranscript from "../models/sessionalTranscriptModel.js"
import DegreeTranscript from "../models/degreeTranscriptModel.js"
import CategoryModel from "../models/categoryModel.js"
import User from "../models/userModel.js";
import CourseCategoryModel from "../models/courseCategoryModel.js"
import CoursesModel from "../models/coursesModel.js"
import RoadmapModel from "../models/roadmapModel.js";
import Student from "../models/studentModel.js";
import getCreditHours from "../utils/getAllowedCredits.js";
import AdvisorFinalRecommendation from '../models/advisorFinalCourseRecommendation.js';
import BatchAdvisor from '../models/FacultyAdvisorModel.js'; 
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

        const session = await SessionModel.findOne({ where: { sessionType, sessionYear } });
      if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
 

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
      //  console.log("Suggested Courses:", suggestedCourses);

                 let offeredCourses = await CourseOfferingModel.findAll({
            where: { sessionId: session.id },
            include: [
                { model: BatchModel },
                { model: ProgramModel }
            ]
        });

        if(!offeredCourses){
            return res.json({error:"No courses offered in this session yet",success:false})
        }

        console.log(`Found ${offeredCourses.length} course offerings for session ${session.id}`);
const courseOfferingIds = offeredCourses.map(course => course.id);
        
        let timetablesMap = new Map();
        
        if (courseOfferingIds.length > 0) {
            const timetables = await TimetableModel.findAll({
                where: { 
                    courseOfferingId: courseOfferingIds 
                },
                raw: true
            });
            
            console.log(`Found ${timetables.length} timetables for these course offerings`);
             if(!timetables){
            return res.json({error:"No Timetable set for this session yet",success:false})
        }

            // Group timetables by courseOfferingId
            timetables.forEach(timetable => {
                const courseId = timetable.courseOfferingId;
                if (!timetablesMap.has(courseId)) {
                    timetablesMap.set(courseId, []);
                }
                timetablesMap.get(courseId).push(timetable);
            });
        }

        // STEP 3: Attach timetables to each course offering
        offeredCourses = offeredCourses.map(course => {
            const courseJson = course.toJSON();
            const courseTimetables = timetablesMap.get(course.id) || [];
            
            return {
                ...courseJson,
                timetables: courseTimetables
            };
        });

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
        if (!roadmap.SemesterRoadmapModels?.length) {
            return res.status(400).json({ success: false, message: 'Roadmap has no semester data' });
        }
        
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
        
        
        const llmRecommendations = await llmRecommendationService.generateRecommendations(
            studentDataForLLM,
            offeredCourses,
            allowedCHR,
            student.BatchModel?.programName || 'SE', 
            student.StudentStatus.currentStatus
        );
    
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

        
                await Promise.all( allRecommendations.map(rec =>
                            SuggestedCourses.create({
                                courseName:                 rec.courseName,
                                credits:                    rec.credits,
                                category:                   rec.category,
                                sessionalRecommendationId:  sessionalRecommendation.id,
                                priority:                   rec.priority.toUpperCase(),  
                                reason:                     rec.reason,
                                isOffered:                  rec.isOffered    || false,
                                offeredProgram:             rec.offeredProgram || null,
                                timeSlot:                   rec.timeSlot      || null,
                            })
            )
        );
        
        return res.status(200).json({
            success: true,
            data: {
                sessionId:session.id,
                allowedCreditHours: allowedCHR,
                llmRecommendations: llmRecommendations,
                savedRecommendationId: sessionalRecommendation.id
            }
        });
        
    }
       return res.status(400).json({ success: false, message: 'Roadmap has no semester data' });

} catch (error) {
        console.error("Error recommending courses:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

 const finalizeRecommendation = async (req, res) => {
    try {
        const {
            advisorId,
            studentId,
            sessionId,
            sessionalRecommendationId,
            selectedCourses,
            notes,
        } = req.body;
 
        if (!advisorId || !studentId || !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'advisorId, studentId, and sessionId are required',
            });
        }
 
        if (!selectedCourses || !Array.isArray(selectedCourses) || selectedCourses.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one course must be selected',
            });
        }

        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
 
        const session = await SessionModel.findByPk(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        const existing = await AdvisorFinalRecommendation.findOne({
            where: { advisorId, studentId, sessionId },
        });
 
        const totalCredits = selectedCourses.reduce(
            (sum, c) => sum + (parseInt(c.credits) || 0), 0
        );
 
        let finalRec;
        if (existing) {
            await existing.update({
                sessionalRecommendationId: sessionalRecommendationId || existing.sessionalRecommendationId,
                recommendedCourses: selectedCourses,
                totalCredits,
                notes: notes || existing.notes,
            });
            finalRec = existing;
        } else {
            finalRec = await AdvisorFinalRecommendation.create({
                advisorId,
                studentId,
                sessionId,
                sessionalRecommendationId: sessionalRecommendationId || null,
                recommendedCourses: selectedCourses,
                totalCredits,
                notes: notes || null,
            });
        }
 
        return res.status(200).json({
            success: true,
            message: existing
                ? 'Recommendation updated and sent to student'
                : 'Recommendation finalized and sent to student',
            data: {
                id: finalRec.id,
                advisorId: finalRec.advisorId,
                studentId: finalRec.studentId,
                sessionId: finalRec.sessionId,
                totalCredits: finalRec.totalCredits,
                coursesCount: selectedCourses.length,
                createdAt: finalRec.createdAt,
                updatedAt: finalRec.updatedAt,
            },
        });
 
    } catch (error) {
        console.error('Finalize recommendation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

 const getAdvisoryLogs = async (req, res) => {
    try {
        const { advisorId } = req.params;
        const {
            sessionId,
            studentId,
            page = 1,
            limit = 20,
        } = req.query;
 
        if (!advisorId) {
            return res.status(400).json({ success: false, message: 'advisorId is required' });
        }
 
        // ── Build dynamic where clause ───────────────────────────────────────
        const where = { advisorId: parseInt(advisorId) };
        if (sessionId) where.sessionId = parseInt(sessionId);
        if (studentId) where.studentId = parseInt(studentId);
 
        const offset = (parseInt(page) - 1) * parseInt(limit);
 
        const { count, rows: logs } = await AdvisorFinalRecommendation.findAndCountAll({
            where,
            include: [
                {
                    model: Student,
                    as: 'Student',
                    include: [
                                {
                            model:User,
                            attributes:{exclude:["password"]}
                        },
                        {
                            model:BatchModel,
                            include:[
                                {
                                    model:ProgramModel,
                                },
                            ]
                        },
                    ],
                },
                {
                    model: SessionModel,
                    as: 'Session',
                    attributes: ['id', 'sessionType', 'sessionYear'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });
 
        return res.status(200).json({
            success: true,
            data: {
                logs,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / parseInt(limit)),
                },
            },
        });
 
    } catch (error) {
        console.error('Get advisory logs error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
 
 const getRecommendationById = async (req, res) => {
    try {
        const { id } = req.params;
 
        const recommendation = await SessionalRecommendation.findOne({
            where: { id },
            include: [
                {
                    model: SuggestedCourses,
                    as: 'SuggestedCourses',
                },
                {
                    model: Student,
                    attributes: ['id', 'studentName', 'currentSemester'],
                },
                {
                    model: SessionModel,
                    attributes: ['id', 'sessionType', 'sessionYear'],
                },
            ],
        });
 
        if (!recommendation) {
            return res.status(404).json({ success: false, message: 'Recommendation not found' });
        }
 
        // Reconstruct the priority-bucketed shape the frontend expects
        const courses = recommendation.SuggestedCourses || [];
        const llmRecommendations = {
            summary: recommendation.recommendedCoursesSummary,
            recommendations: {
                critical: courses.filter(c => c.priority === 'critical'),
                high:     courses.filter(c => c.priority === 'high'),
                medium:   courses.filter(c => c.priority === 'medium'),
                low:      courses.filter(c => c.priority === 'low'),
            },
            detailedExplanation: recommendation.recommendationText,
        };
 
        return res.status(200).json({
            success: true,
            data: {
                allowedCreditHours: recommendation.totalCreditsAllowed,
                llmRecommendations,
                savedRecommendationId: recommendation.id,
            },
        });
 
    } catch (error) {
        console.error('Get recommendation by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
 
 const getStudentRecommendations = async (req, res) => {
    try {
        const { studentId } = req.params;
   
        const where = { studentId: parseInt(studentId) };
        
        const recommendations = await AdvisorFinalRecommendation.findAll({
            where,
            include: [
                {
                    model: SessionModel,
                    as: 'Session',
                    attributes: ['id', 'sessionType', 'sessionYear'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
 
        if (!recommendations.length) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No recommendations found for this student',
            });
        }
 
        // Shape response to match ViewRecommedCourse component props
        const shaped = recommendations.map(rec => ({
            id: rec.id,
            sessionType: rec.Session?.sessionType,
            sessionYear: rec.Session?.sessionYear,
            totalCredits: rec.totalCredits,
            notes: rec.notes,
            courses: rec.recommendedCourses,   // the JSON array
            sentAt: rec.createdAt,
        }));
 
        return res.status(200).json({ success: true, data: shaped });
 
    } catch (error) {
        console.error('Get student recommendations error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


export default { recommendCourses ,finalizeRecommendation, getAdvisoryLogs,getRecommendationById,getStudentRecommendations};