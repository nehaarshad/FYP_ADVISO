import sequelize from "../config/dbConfig.js";
import User from "../models/userModel.js";
import CategoryModel from "../models/categoryModel.js";
import CourseModel from "../models/coursesModel.js";
import CourseOfferingModel from "../models/courseOfferingModel.js";
import CourseCategoryModel from "../models/courseCategoryModel.js";
import CoursePreReqModel from "../models/coursePreReqModel.js";
import Admin from "../models/adminModel.js";
import BatchAssignment from "../models/batchAssignmentModel.js";
import BatchModel from "../models/batchModel.js";
import BatchMeeting from "../models/BatchMeetingModel.js";
import AdvisorDecision from "../models/AdvisorDecisionModel.js";
import AdvisorNotes from "../models/AdvisorNotes.js";
import Coordinator from "../models/coordinatorModel.js";
import DegreeTranscript from "../models/degreeTranscriptModel.js";
import EnrolledCoursesModel from "../models/enrolledCoursesModel.js";
import FacultyRecommendation from "../models/facultyRecommendationModel.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import MeetingReminder from "../models/meetingReminder.js";
import Message from "../models/messagesModel.js";
import ProgramModel from "../models/programModel.js";
import RecommendationCategory from "../models/RecommendationModel.js";
import RequestFormType from "../models/RequestFormTypeModel.js";
import RoadmapModel from "../models/RoadmapModel.js";
import RoadmapCourseCategoryModel from "../models/RoadmapCourseCategoryModel.js";
import SemesterCourseModel from "../models/semesterCourseModel.js";
import SemesterRoadmapModel from "../models/semesterRoadmapModel.js";
import SessionModel from "../models/sessionModel.js";
import SessionalTranscript from "../models/sessionalTranscriptModel.js";
import StudentGuardian from "../models/studentGuardianModel.js";
import Student from "../models/studentModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import SupportingVideo from "../models/supportingVideoModel.js";
import SubmittedRequestForm from "../models/SubmittedRequestForm.js";
import TimetableModel from "../models/timetableModel.js";
import TranscriptCoursesDetail from "../models/TranscriptCoursesDetailModel.js";
import UploadedContentModel from "../models/uploadedContentModel.js";
import Chat from "../models/ChatsModel.js";
import relations from "./tableRelations.js";
    
relations();

const models={
    User,
    Admin,
    AdvisorDecision,
    AdvisorNotes,
    BatchAdvisor,
    BatchAssignment,
    BatchMeeting,
    BatchModel,
    CategoryModel,
    Chat,
    Coordinator,
    CourseCategoryModel,
    CourseModel,
    CoursePreReqModel,
    CourseOfferingModel,
    DegreeTranscript,
    EnrolledCoursesModel,
    FacultyRecommendation,
    MeetingReminder,
    Message,
    ProgramModel,
    RecommendationCategory,
    RequestFormType,
    RoadmapCourseCategoryModel,
    RoadmapModel,
    SemesterCourseModel,
    SemesterRoadmapModel,
    SessionModel,
    SessionalTranscript,
    Student,
    StudentGuardian,
    StudentStatus,
    SubmittedRequestForm,
    SupportingVideo,
    TimetableModel,
    TranscriptCoursesDetail,
    UploadedContentModel

}

const modelsSync=async()=>{
    try{

        await sequelize.sync({ force: false}).then(() => {   
            console.log("All models are synchronized successfully");
        }).catch((err) => {
            console.log("all models are not synchronized successfully",err)
         });
        }
    catch(err){
        console.log("Failed to synchronized Models",err)
    }
}

export default {models,modelsSync}
