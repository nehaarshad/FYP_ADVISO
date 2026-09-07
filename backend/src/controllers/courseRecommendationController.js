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
import SessionalRecommendation from "../models/sessionalRecommdentationModel.js";
import SuggestedCourses from "../models/suggestedCoursesModel.js";
import generateRecommendations from "../services/courseRecommendationEngine.js";
import helpingFunctions from '../utils/courseHelpingChecks.js';
const {cleanCredits} =helpingFunctions


const recommendCourses = async (req, res) => {
    const startTime = Date.now();
    console.log('\n' + '='.repeat(80));
    console.log('RECOMMEND COURSES API CALLED');
    console.log('='.repeat(80));
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Request params: ${JSON.stringify(req.params)}`);
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    
    try {
        console.log('\n--- STEP 1: Fetching Student Data ---');
        const { id } = req.params;
        const { sessionType, sessionYear } = req.body;

        const student = await Student.findOne({
            where: { id },
            include: [
                { model: StudentStatus },
                { model: BatchModel, include: { model: ProgramModel } }
            ]
        });

        if (!student) {
            console.log(' Student not found');
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        console.log(`   Student found: ${JSON.stringify(student)}`);

        console.log('\n--- STEP 2: Fetching Session Data ---');
        const session = await SessionModel.findOne({ where: { sessionType, sessionYear } });
        if (!session) {
            console.log('Session not found');
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        console.log('\n--- STEP 3: Fetching Degree Transcript ---');
        const degreeTranscript = await DegreeTranscript.findOne({ where: { studentId: student.id } });
        if (!degreeTranscript) {
            console.log('Degree transcript not found');
            return res.status(404).json({ success: false, message: "Degree transcript not found" });
        }
        console.log(`   STUDENT TRANSCRIPT: ${JSON.stringify(degreeTranscript)}`);

        console.log('\n--- STEP 4: Fetching Sessional Transcripts ---');
        const sessionalTranscript = await SessionalTranscript.findAll({
            where: { degreeTranscriptId: degreeTranscript.id },
            include: [{ model: TranscriptCoursesDetail }]
        });

          console.log(`   STUDENT SESSIONAL TRANSCRIPT: ${JSON.stringify(sessionalTranscript)}`);

        console.log('\n--- STEP 5: Analyzing Transcript ---');
        let suggestedCourses = transcriptAnalyzer.analyzeTranscript(
            sessionalTranscript,
            {
                currentCGPA: parseFloat(degreeTranscript.currentCGPA),
                studentStatus: student.StudentStatus ? student.StudentStatus.currentStatus : "Unknown"
            }
        );

          console.log(`   SUGGESTED COURSES: ${JSON.stringify(suggestedCourses)}`);
        console.log(`   Transcript analysis complete`);
        console.log(`   Failed courses: ${suggestedCourses.failedCourses?.length || 0}`);
        console.log(`   Withdrawn courses: ${suggestedCourses.withdrawnCourses?.length || 0}`);
        console.log(`   D-graded courses: ${suggestedCourses.dGradedCourses?.length || 0}`);
        console.log(`   Completed courses: ${suggestedCourses.completedCourses?.length || 0}`);

        console.log('\n--- STEP 6: Fetching Offered Courses ---');
        let offeredCourses = await CourseOfferingModel.findAll({
            where: { sessionId: session.id },
            include: [{ model: BatchModel }, { model: ProgramModel }]
        });
        
        console.log('\n--- STEP 7: Fetching Timetables ---');
        const courseOfferingIds = offeredCourses.map(course => course.id);
        let timetablesMap = new Map();

        if (courseOfferingIds.length > 0) {
            const timetables = await TimetableModel.findAll({
                where: { courseOfferingId: courseOfferingIds },
                raw: true
            });

            timetables.forEach(timetable => {
                const courseId = timetable.courseOfferingId;
                if (!timetablesMap.has(courseId)) {
                    timetablesMap.set(courseId, []);
                }
                timetablesMap.get(courseId).push(timetable);
            });
            console.log(` Found ${timetables.length} timetable entries`);
        }

        offeredCourses = offeredCourses.map(course => ({
            ...course.toJSON(),
            timetables: timetablesMap.get(course.id) || []
        }));

        console.log(`offered courses ${JSON.stringify(offeredCourses)}`)
        console.log('\n--- STEP 8: Fetching Roadmap ---');
        const roadmapId = student.BatchModel.roadmapId;
        
        const roadmap = await RoadmapModel.findOne({
            where: { id: roadmapId },
            include: [
                { model: RoadmapCourseCategoryModel, include: [{ model: CategoryModel }] },
                {
                    model: SemesterRoadmapModel,
                    include: [{
                        model: SemesterCourseModel,
                        include: [{
                            model: CourseCategoryModel,
                            include: [{
                                model: CoursesModel,
                                attributes: ["id", "courseName", "courseCredits"],
                                include: [
                                    { model: CoursePreReqModel, as: "prerequisites", include: [{ model: CoursesModel, as: "prerequisiteCourse" }] },
                                    { model: CoursePreReqModel, as: "usedAsPrerequisiteFor", include: [{ model: CoursesModel, as: "mainCourse" }] }
                                ]
                            }, {
                                model: CategoryModel,
                                attributes: ["id", "categoryName", "colorScheme"]
                            }]
                        }]
                    }]
                }
            ]
        });

        if (!roadmap) {
            console.log('Roadmap not found');
            return res.status(404).json({ success: false, message: "Roadmap not found" });
        }

        console.log('\n--- STEP 9: Processing Roadmap Courses ---');
        const { roadmapCourses } = await mapCourseOfferingsWithUnClearRoadmap(
            suggestedCourses,
            roadmap.SemesterRoadmapModels
        );
    //    console.log(` Processed ${roadmapCourses.length} roadmap courses\n ${JSON.stringify(roadmapCourses)}`);

        console.log('\n--- STEP 10: Calculating Credit Hours ---');
        const allowedCHR = getCreditHours(parseFloat(degreeTranscript.currentCGPA));
        console.log(` Allowed credit hours: ${allowedCHR}`);

        console.log('\n--- STEP 11: Generating Recommendations ---');
        const systemRecommendations = generateRecommendations({
            student,
            degreeTranscript,
            studentStatus: student.StudentStatus.currentStatus,
            suggestedCourses,
            offeredCourses,
            roadmapCourses,
            allowedCredits: allowedCHR,
            program: student.BatchModel?.ProgramModel?.programName || student.BatchModel?.programName || 'SE',
            placedNames: new Set(),
            placedOfferingIds: new Set(),
            placedTimetables: [],
        });

console.log(` Recommendations generated successfully`);
console.log(`   Total recommended credits: ${systemRecommendations.summary.totalRequiredCredits}`);
console.log(`   Critical: ${systemRecommendations.summary.priorityBreakdown.critical}`);
console.log(`   High: ${systemRecommendations.summary.priorityBreakdown.high}`);
console.log(`   Medium: ${systemRecommendations.summary.priorityBreakdown.medium}`);
console.log(`   Low: ${systemRecommendations.summary.priorityBreakdown.low}`);
console.log(`   Special requests: ${systemRecommendations.specialRequests?.length || 0}`);

console.log('\n--- STEP 12: Saving Recommendation ---');
const sessionalRecommendation = await SessionalRecommendation.create({
    recommendationText: systemRecommendations.detailedExplanation,
    recommendedCoursesSummary: systemRecommendations.summary,
    priorityWiseCourses: systemRecommendations.recommendations,
    totalCreditsAllowed: systemRecommendations.summary.totalCreditsAllowed,
    sessionId: session.id,
    studentId: student.id
});
console.log(` Recommendation saved (ID: ${sessionalRecommendation.id})`);

console.log('\n--- STEP 13: Saving Individual Course Recommendations ---');

const allRecommendations = [
    ...(systemRecommendations.recommendations.critical || []).map(c => ({ ...c, priority: 'critical' })),
    ...(systemRecommendations.recommendations.high || []).map(c => ({ ...c, priority: 'high' })),
    ...(systemRecommendations.recommendations.medium || []).map(c => ({ ...c, priority: 'medium' })),
    ...(systemRecommendations.recommendations.low || []).map(c => ({ ...c, priority: 'low' }))
];

console.log(`   Total course recommendations to save: ${allRecommendations.length}`);

 await Promise.all(allRecommendations.map(rec => {
const metadata = {
    originalCourseName: rec.originalCourseName || null,
    courseCode: rec.courseCode || null,
    actionRequired: rec.actionRequired || null,
    substituteCourses: rec.substituteCourses || [],
    isElective: rec.isElective || false,
    electiveType: rec.electiveType || null,
    isOtherSemester: rec.isOtherSemester || false,
    isOtherProgram: rec.isOtherProgram || false,
    needsReview: rec.needsReview || false,
    creditMismatch: rec.creditMismatch || false,
    requiredCredits: rec.requiredCredits || null,
    availableCredits: rec.availableCredits || null,
    electiveOptions: rec.electiveOptions || [],
    totalElectiveOptions: rec.totalOptions || 0,
    recommendedAction: rec.recommendedAction || null,
    
    // ✅ Clash and alternative data
    isNotSuggested: rec.isNotSuggested || false,
    notSuggestedReason: rec.notSuggestedReason || null,
    clashDetails: rec.clashDetails || null,
    clashesWith: rec.clashesWith || null,
    clashSlots: rec.clashSlots || null,
    alternativeReason: rec.alternativeReason || null,
    resolvesClash: rec.resolvesClash || false,
    clashResolved: rec.clashResolved || false,
    alternativeScore: rec.score || null,
    alternativeRank: rec.rank || null,
    
    // ✅ Best match details
    bestMatchDetails: rec.bestMatchDetails ? {
        score: rec.bestMatchDetails.score,
        sameSemester: rec.bestMatchDetails.sameSemester,
        semester: rec.bestMatchDetails.semester,
        creditMatch: rec.bestMatchDetails.creditMatch,
        isCore: rec.bestMatchDetails.isCore,
        hasDependents: rec.bestMatchDetails.hasDependents,
        matchReasons: rec.bestMatchDetails.matchReasons || {}
    } : null,
    
    // ✅ All alternatives with detailed status
    allAlternatives: rec.allAlternatives ? {
        available: rec.allAlternatives.available.map(a => ({
            courseName: a.courseName,
            credits: a.credits,
            semester: a.semester,
            category: a.category,
            isElective: a.isElective || false,
            status: a.status,
            reason: a.reason,
            score: a.score,
            timeSlot: a.timeSlot,
            timetableDetails: a.timetableDetails || [],
            matchReasons: a.matchReasons || {}
        })),
        timeClashes: rec.allAlternatives.timeClashes.map(a => ({
            courseName: a.courseName,
            credits: a.credits,
            semester: a.semester,
            reason: a.reason,
            clashesWith: a.clashesWith,
            clashSlots: a.clashSlots,
            clashDetails: a.clashDetails || []
        })),
        notOffered: rec.allAlternatives.notOffered.map(a => ({
            courseName: a.courseName,
            credits: a.credits,
            semester: a.semester,
            reason: a.reason
        })),
        alreadyPlaced: rec.allAlternatives.alreadyPlaced.map(a => ({
            courseName: a.courseName,
            credits: a.credits,
            semester: a.semester,
            reason: a.reason
        })),
        summary: rec.allAlternatives.summary || {
            totalEligible: 0,
            available: 0,
            timeClashes: 0,
            notOffered: 0,
            alreadyPlaced: 0
        }
    } : null,
    totalAlternatives: rec.totalAvailable || 0,
    
    labDetails: rec.labDetails || null,
    labClash: rec.labClash || false,
    labProgram: rec.labProgram || null,
    labProgramId: rec.labProgramId || null,
    originalCredits: rec.originalCredits || null,
    lostCredits: rec.lostCredits || null,
    timetableDetails: rec.timetableDetails || [],
    timeSlot: rec.timeSlot || null,
    batch: rec.batch || 'N/A',
    offeredProgramId: rec.offeredProgramId || null,
    program: rec.program || null,
    semester: rec.semester || null,
    matchScore: rec.score || null,
    fuzzyMatch: rec.fuzzy || false,
    isCombined: rec.isCombined || false,
    labOffering: rec.labOffering || null,
    hasLab: rec.hasLab || false,
    priorityOrder: rec.priority || null,
    extra: rec.extra || {},
    allAlternatives: rec.allAlternatives ? {
        available: rec.allAlternatives.available.map(a => ({
            courseName: a.courseName,
            credits: a.credits,
            semester: a.semester,
            category: a.category,
            isElective: a.isElective || false,
            status: a.status,
            reason: a.reason,
            score: a.score,
            timeSlot: a.timeSlot,
            timetableDetails: a.timetableDetails || [],
            matchReasons: a.matchReasons || {}
        })),
        timeClashes: rec.allAlternatives.timeClashes.map(a => ({
            courseName: a.courseName,
            credits: a.credits,
            semester: a.semester,
            reason: a.reason,
            clashesWith: a.clashesWith,
            clashSlots: a.clashSlots,
            clashDetails: a.clashDetails || []
        })),
        notOffered: rec.allAlternatives.notOffered.map(a => ({
            courseName: a.courseName,
            credits: a.credits,
            semester: a.semester,
            reason: a.reason
        })),
        alreadyPlaced: rec.allAlternatives.alreadyPlaced.map(a => ({
            courseName: a.courseName,
            credits: a.credits,
            semester: a.semester,
            reason: a.reason
        })),
        summary: rec.allAlternatives.summary || {
            totalEligible: 0,
            available: 0,
            timeClashes: 0,
            notOffered: 0,
            alreadyPlaced: 0
        }
    } : null,
    bestMatchDetails: rec.bestMatchDetails || null,
    totalAvailable: rec.totalAvailable || 0
};

    Object.keys(metadata).forEach(key => {
        if (metadata[key] === undefined || metadata[key] === null) {
            delete metadata[key];
        }
        if (Array.isArray(metadata[key]) && metadata[key].length === 0) {
            delete metadata[key];
        }
        if (typeof metadata[key] === 'object' && metadata[key] !== null && Object.keys(metadata[key]).length === 0) {
            delete metadata[key];
        }
    });

    return SuggestedCourses.create({
        courseName: rec.courseName,
        courseCode: rec.courseCode || null,
        credits: cleanCredits(rec.credits || 0),
        category: rec.category || null,
        sessionalRecommendationId: sessionalRecommendation.id,
        priority: rec.priority ? rec.priority.toUpperCase() : 'MEDIUM',
        reason: rec.reason || null,
        isOffered: rec.isOffered !== undefined ? rec.isOffered : true,
        offeredProgram: rec.offeredProgram || rec.program || null,
        timeSlot: rec.timeSlot || null,
        metadata: metadata
    });
}));

console.log(` All course recommendations saved`);

const data = await SessionalRecommendation.findOne({
    where: { id: sessionalRecommendation.id },
    include: [
        {
            model: SuggestedCourses,
        }
    ]
});

const totalTime = Date.now() - startTime;
console.log('\n' + '='.repeat(80));
console.log(`RECOMMENDATION COMPLETE - Total time: ${totalTime}ms`);
console.log('='.repeat(80) + '\n');


    console.log('\n=== RECOMMENDATION SUMMARY ===');
    console.log(JSON.stringify(data));

            return res.status(200).json({
                success: true,
                data: data,
                message: 'Course recommendations generated successfully'
            });

    } catch (error) {
        console.error('\n' + '='.repeat(80));
        console.error('❌ ERROR IN RECOMMENDATION PROCESS');
        console.error('='.repeat(80));
        console.error(`Error: ${error.message}`);
        console.error(`Stack: ${error.stack}`);
        console.error('='.repeat(80) + '\n');
        
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