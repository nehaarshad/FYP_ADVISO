import User from "../models/userModel.js";
import ChatsModel from "../models/ChatsModel.js";
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
import RoadmapModel from "../models/roadmapModel.js";
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
import SessionalRecommendation from "../models/sessionalRecommdentationModel.js";
import SuggestedCourses from "../models/suggestedCoursesModel.js";


export default function relations() {
  // ==================== User & Auth Relations ====================
  User.hasOne(Admin, { foreignKey: "userId" });
  Admin.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Coordinator, { foreignKey: "userId" });
  Coordinator.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Student, { foreignKey: "userId" });
  Student.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(BatchAdvisor, { foreignKey: "userId" });
  BatchAdvisor.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Message, { foreignKey: "senderId" });
  Message.belongsTo(User, { foreignKey: "senderId" });

  User.hasMany(Message, { foreignKey: "receiverId" });
  Message.belongsTo(User, { foreignKey: "receiverId" }); 

  User.hasMany(Chat, { foreignKey: "senderId" });
  Chat.belongsTo(User, { foreignKey: "senderId" });

  User.hasMany(Chat, { foreignKey: "receiverId" });
  Message.belongsTo(User, { foreignKey: "receiverId" }); 

  // ==================== Student ====================

  Student.hasOne(StudentStatus, { foreignKey: "studentId" });
  StudentStatus.belongsTo(Student, { foreignKey: "studentId" });

  Student.hasMany(EnrolledCoursesModel, { foreignKey: "studentId" });
  EnrolledCoursesModel.belongsTo(Student, { foreignKey: "studentId" });

  Student.hasOne(DegreeTranscript, { foreignKey: "studentId" });
  DegreeTranscript.belongsTo(Student, { foreignKey: "studentId" });

  Student.hasMany(SessionalTranscript, { foreignKey: "studentId" });
  SessionalTranscript.belongsTo(Student, { foreignKey: "studentId" });

  Student.hasMany(SubmittedRequestForm, { foreignKey: "studentId" });
  SubmittedRequestForm.belongsTo(Student, { foreignKey: "studentId" });

  Student.hasMany(AdvisorDecision, { foreignKey: "studentId" });
  AdvisorDecision.belongsTo(Student, { foreignKey: "studentId" });

  BatchAdvisor.hasMany(AdvisorNotes, { foreignKey: "advisorId" });
  AdvisorNotes.belongsTo(BatchAdvisor, { foreignKey: "advisorId" });

  Student.hasMany(StudentGuardian, { foreignKey: "studentId" });
  StudentGuardian.belongsTo(Student, { foreignKey: "studentId" });

Student.belongsTo(BatchModel, { foreignKey: "batchId" });
BatchModel.hasMany(Student, { foreignKey: "batchId" });
  // ==================== Program ====================

  BatchModel.belongsTo(ProgramModel, { foreignKey: "programId" });
  ProgramModel.hasMany(BatchModel, { foreignKey: "programId" });

  ProgramModel.hasMany(RoadmapModel, { foreignKey: "programId" });
  RoadmapModel.belongsTo(ProgramModel, { foreignKey: "programId" });

  
  ProgramModel.hasMany(CourseOfferingModel, { foreignKey: "programId" });
  CourseOfferingModel.belongsTo(ProgramModel, { foreignKey: "programId" });

  BatchModel.hasOne(RoadmapModel, { foreignKey: "roadmapId" });
  RoadmapModel.belongsTo(BatchModel, { foreignKey: "roadmapId" });

  // ==================== Batch & Assignment ====================
  BatchAssignment.belongsTo(BatchModel, { foreignKey: "batchId" });
  BatchModel.hasMany(BatchAssignment, { foreignKey: "batchId" });

  BatchAssignment.belongsTo(BatchAdvisor, { foreignKey: "advisorId" });
  BatchAdvisor.hasMany(BatchAssignment, { foreignKey: "advisorId" });

  BatchModel.hasMany(BatchMeeting, { foreignKey: "batchId" });
  BatchMeeting.belongsTo(BatchModel, { foreignKey: "batchId" });

  
  BatchModel.hasMany(CourseOfferingModel, { foreignKey: "batchId" });
  CourseOfferingModel.belongsTo(BatchModel, { foreignKey: "batchId" });

  BatchMeeting.hasMany(MeetingReminder, { foreignKey: "meetingId" });
  MeetingReminder.belongsTo(BatchMeeting, { foreignKey: "meetingId" });

  // ==================== Sessional Recommendation Courses ====================

  Student.hasMany(SessionalRecommendation, { foreignKey: "studentId" });
  SessionalRecommendation.belongsTo(Student, { foreignKey: "studentId" });

  SessionModel.hasMany(SessionalRecommendation, { foreignKey: "sessionId" });
  SessionalRecommendation.belongsTo(SessionModel, { foreignKey: "sessionId" });

  CourseModel.hasMany(SuggestedCourses, { foreignKey: "courseId" });
  SuggestedCourses.belongsTo(CourseModel, { foreignKey: "courseId" });

  SuggestedCourses.belongsTo(SessionalRecommendation, { foreignKey: "sessionalRecommendationId" });
  SessionalRecommendation.hasMany(SuggestedCourses, { foreignKey: "sessionalRecommendationId" });

  // ==================== Faculty Advisor ====================
  BatchAdvisor.hasMany(FacultyRecommendation, { foreignKey: "advisorId" });
  FacultyRecommendation.belongsTo(BatchAdvisor, { foreignKey: "advisorId" });

  BatchAdvisor.hasMany(AdvisorDecision, { foreignKey: "advisorId" });
  AdvisorDecision.belongsTo(BatchAdvisor, { foreignKey: "advisorId" });

  BatchAdvisor.hasMany(AdvisorNotes, { foreignKey: "advisorId" });
  AdvisorNotes.belongsTo(BatchAdvisor, { foreignKey: "advisorId" });

  BatchAdvisor.hasMany(MeetingReminder, { foreignKey: "advisorId" });
  MeetingReminder.belongsTo(BatchAdvisor, { foreignKey: "advisorId" });

  // ==================== Recommendation ====================
  RecommendationCategory.hasMany(FacultyRecommendation, { foreignKey: "recommendationCategoryId" });
  FacultyRecommendation.belongsTo(RecommendationCategory, { foreignKey: "recommendationCategoryId" });

  // ==================== Request Forms ====================
  RequestFormType.hasMany(SubmittedRequestForm, { foreignKey: "formTypeId" });
  SubmittedRequestForm.belongsTo(RequestFormType, { foreignKey: "formTypeId" });

  SubmittedRequestForm.hasMany(SupportingVideo, { foreignKey: "formId" });
  SupportingVideo.belongsTo(SubmittedRequestForm, { foreignKey: "formId" });

  SubmittedRequestForm.hasOne(AdvisorDecision, { foreignKey: "formId" });
  AdvisorDecision.belongsTo(SubmittedRequestForm, { foreignKey: "formId" });

  // ==================== Course & Offerings ====================
  CourseOfferingModel.hasMany(CourseModel, { foreignKey: "courseId" });
  CourseModel.belongsTo(CourseOfferingModel, { foreignKey: "courseId" });

  CourseCategoryModel.belongsTo(CourseModel, { foreignKey: "courseId" });
  CourseCategoryModel.belongsTo(CategoryModel, { foreignKey: "categoryId" });

  // Prerequisites (self-referential many-to-many)
   CourseModel.hasMany(CoursePreReqModel, {foreignKey: "courseid",
        as: "prerequisites", 
        sourceKey: "id",
    });
    
    CourseModel.hasMany(CoursePreReqModel, {foreignKey: "preReqCourseId",
        as: "usedAsPrerequisiteFor",
        sourceKey: "id",
    });
    
    CoursePreReqModel.belongsTo(CourseModel, {
        foreignKey: "courseid",
        as: "mainCourse",
        targetKey: "id",
    });
    
    CoursePreReqModel.belongsTo(CourseModel, {
        foreignKey: "preReqCourseId",
        as: "prerequisiteCourse",
        targetKey: "id",
    });

  // ==================== Session & Enrollment ====================
  SessionModel.hasMany(CourseOfferingModel, { foreignKey: "sessionId" });
  CourseOfferingModel.belongsTo(SessionModel, { foreignKey: "sessionId" });

  SessionModel.hasMany(UploadedContentModel, { foreignKey: "sessionId" });
  UploadedContentModel.belongsTo(SessionModel, { foreignKey: "sessionId" });

  EnrolledCoursesModel.belongsTo(SessionModel, { foreignKey: "sessionId" });
  SessionModel.hasMany(EnrolledCoursesModel, { foreignKey: "sessionId" });

// ==================== Roadmap & Semester ====================
RoadmapModel.hasMany(RoadmapCourseCategoryModel, { foreignKey: "roadmapId", });
RoadmapCourseCategoryModel.belongsTo(RoadmapModel, { foreignKey: "roadmapId",  });

RoadmapModel.hasMany(SemesterRoadmapModel, { foreignKey: "roadmapId",  });
SemesterRoadmapModel.belongsTo(RoadmapModel, { foreignKey: "roadmapId", });

// RoadmapCourseCategory → Category (NOT the other way around)
RoadmapCourseCategoryModel.belongsTo(CategoryModel, { foreignKey: "categoryId", });
CategoryModel.hasMany(RoadmapCourseCategoryModel, { foreignKey: "categoryId", });

// Category → CourseCategoryModel
CategoryModel.hasMany(CourseCategoryModel, { foreignKey: "categoryId", });
CourseCategoryModel.belongsTo(CategoryModel, { foreignKey: "categoryId",  });

// CourseModel → CourseCategoryModel
CourseModel.hasMany(CourseCategoryModel, { foreignKey: "courseId",  });
CourseCategoryModel.belongsTo(CourseModel, { foreignKey: "courseId",  });

// Semester courses
SemesterRoadmapModel.hasMany(SemesterCourseModel, { foreignKey: "semesterRoadmapId", });
SemesterCourseModel.belongsTo(SemesterRoadmapModel, { foreignKey: "semesterRoadmapId",  });

SemesterCourseModel.belongsTo(CourseCategoryModel, { foreignKey: "courseCategoryId", });
CourseCategoryModel.hasMany(SemesterCourseModel, { foreignKey: "courseCategoryId",  });

  // ==================== Timetable ====================

    CourseOfferingModel.hasMany(TimetableModel, { foreignKey: "courseOfferingId"  });

    TimetableModel.belongsTo(CourseOfferingModel, { foreignKey: "courseOfferingId",});
    
  // ==================== Chat & Messages ====================
  ChatsModel.hasMany(Message, { foreignKey: "chatId" });
  Message.belongsTo(ChatsModel, { foreignKey: "chatId" });

  // ==================== Transcripts Management ====================
  SessionalTranscript.hasMany(TranscriptCoursesDetail, { foreignKey: "sessionalTranscriptId" });
  TranscriptCoursesDetail.belongsTo(SessionalTranscript, { foreignKey: "sessionalTranscriptId" });

  SessionalTranscript.hasMany(EnrolledCoursesModel, { foreignKey: "enrolledCoursesId" });
  EnrolledCoursesModel.belongsTo(SessionalTranscript, { foreignKey: "enrolledCoursesId" });

  SessionalTranscript.hasOne(SessionModel, { foreignKey: "sessionId" });
  SessionModel.belongsTo(SessionalTranscript, { foreignKey: "sessionId" });

  TranscriptCoursesDetail.hasMany(CourseModel, { foreignKey: "courseId" });

    // ==================== Degree Transcripts ====================

  DegreeTranscript.hasMany(SessionalTranscript, { foreignKey: "degreeTranscriptId" });
  SessionalTranscript.belongsTo(DegreeTranscript, { foreignKey: "degreeTranscriptId" });
  
  DegreeTranscript.hasMany(Student, { foreignKey: "studentId" });
  Student.belongsTo(DegreeTranscript, { foreignKey: "studentId" });

}