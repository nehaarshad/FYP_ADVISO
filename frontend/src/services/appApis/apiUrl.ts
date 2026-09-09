
export default class APIs{

    static BASE_URL = process.env.NEXT_PUBLIC_API_URL
    

    //auth Module

          static SignUpUrl = `${APIs.BASE_URL}/registeruser`;
          static LoginUrl = `${APIs.BASE_URL}/login`;
          static LogOutUrl = `${APIs.BASE_URL}/logout/:id`;
          static ForgetPasswordUrl = `${APIs.BASE_URL}/forgetpassword`;
         
    //register user

          static addAdvisorUrl = `${APIs.BASE_URL}/addadvisor`;
          static addNewStudentUrl = `${APIs.BASE_URL}/addnewstudent`;
          static updateAdvisorUrl = `${APIs.BASE_URL}/updateadvisor/:id`;
          static updateStudentUrl = `${APIs.BASE_URL}/updatestudent/:id`;
          static updateStudentStatusUrl = `${APIs.BASE_URL}/updatestudentstatus`;
          static bulkStudentUploadUrl = `${APIs.BASE_URL}/addviaexcelsheet`;


    //manage users APIS

         static getAllCoordinatorsUrl = `${APIs.BASE_URL}/coordinators`;
         static getUserByIdUrl = `${APIs.BASE_URL}/getUserById/:id`;
         static getAllUsersUrl = `${APIs.BASE_URL}/users`;
         static getAdvisorsUrl = `${APIs.BASE_URL}/advisors`;
         static getStudentsUrl = `${APIs.BASE_URL}/students`;
         static updateUserStatusUrl = `${APIs.BASE_URL}/updateuserstatus`;
         static updateUserRoleUrl = `${APIs.BASE_URL}/updateuserrole`;


         // program Urls 

         static getProgramsUrl = `${APIs.BASE_URL}/getPrograms`;
         static addProgram = `${APIs.BASE_URL}/addProgram`;


    // process roadmap

    static uploadRoadmapUrl = `${APIs.BASE_URL}/upload`;
    static getProgramRoadmapsUrl = `${APIs.BASE_URL}/roadmap-details/:programName`;
    static getSepecifBatchProgramRoadmapsUrl = `${APIs.BASE_URL}/batch-roadmap/:batchName/:batchYear/:programName`;
    static assignRoadmapToBatchUrl = `${APIs.BASE_URL}/assign-to-batch`;

    //process courseDetails

    static uploadCourseDetailUrl = `${APIs.BASE_URL}/uploadCourseDetail`;
    static getCourseDetailUrl = `${APIs.BASE_URL}/getCoursesDetails`;
    static updateCourseDetailUrl = `${APIs.BASE_URL}/updateCourse/:courseId`;


    //procecourseOffering

     static uploadCourseOfferingUrl = `${APIs.BASE_URL}/uploadCourseOffering`;
    static getCourseOfferingUrl = `${APIs.BASE_URL}/getCoursesOfferings`;


    //process timetable
    
     static uploadTimeTableUrl = `${APIs.BASE_URL}/uploadTimetable`;
     static getTimetableUrl = `${APIs.BASE_URL}/getTimetables`;

      // Chat APIs
      static chatUploadUrl = `${APIs.BASE_URL}/chat/upload`;
      static chatDeleteUrl = `${APIs.BASE_URL}/chat/delete/:filename`;
      
       //process results

      static uploadSessionalResultUrl = `${APIs.BASE_URL}/uploadSessionalResult`;

        // transcript
       static getStudentTranscriptSummaryUrl = `${APIs.BASE_URL}/getStudentTranscriptSummary/:id`;

        // recommendCourses
       static recommendSessionalCoursesUrl = `${APIs.BASE_URL}/suggestCourses/:id`;
       static finalizeSessionalCourseRecommendationUrl = `${APIs.BASE_URL}/finalize`;
       static getAdvisoryLogsUrl = `${APIs.BASE_URL}/advisor/:advisorId`;
       static getRecommendationByIdUrl = `${APIs.BASE_URL}/getRecommendation/:id`;
       static getStudentRecommendationsUrl = `${APIs.BASE_URL}/student/:studentId`;

        //advisor Notes Module

        static createNotes = `${APIs.BASE_URL}/createNotes`;
        static updateNotes = `${APIs.BASE_URL}/updateNotes/:id`;
        static deleteNotes = `${APIs.BASE_URL}/deleteNotes/:id`;
        static getNotes = `${APIs.BASE_URL}/getNotes/:userId`;

        //supporting videos Module

        static createVideo = `${APIs.BASE_URL}/createVideo`;
        static getAllVideos = `${APIs.BASE_URL}/getAllVideos`;
        static updateVideo = `${APIs.BASE_URL}/updateVideo/:id`;
        static deleteVideo = `${APIs.BASE_URL}/deleteVideo/:id`;

            //requestForm Module

          static createRequestFormUrl = `${APIs.BASE_URL}/createRequestForm`;
          static getAllRequestFormUrl = `${APIs.BASE_URL}/getAllRequestForm`;
          static updateRequestFormUrl = `${APIs.BASE_URL}/updateRequestForm/:id`;

        //degreeguidlines Module

        static createGuideline = `${APIs.BASE_URL}/createGuideline`;
        static getAllGuidelines = `${APIs.BASE_URL}/getAllGuidelines`;
        static updateGuideline = `${APIs.BASE_URL}/updateGuideline/:id`;
        static deleteGuideline = `${APIs.BASE_URL}/deleteGuideline/:id`;

             // faculty recommendation
       static createRecommendationRequest = `${APIs.BASE_URL}/createRecommendationRequest/:userId`;
       static addCommentToRecommendation = `${APIs.BASE_URL}/addCommentToRecommendation/:userId`;
       static getAllRecommendations = `${APIs.BASE_URL}/getAllRecommendations`;
       static updateRecommendationStatus = `${APIs.BASE_URL}/updateRecommendationStatus/:userId`;
       static voteComment = `${APIs.BASE_URL}/voteComment/:commentId`;
       static acceptCommentAsSolution = `${APIs.BASE_URL}/acceptCommentAsSolution/:userId`;
       static deleteRecommendation = `${APIs.BASE_URL}/deleteRecommendation/:id`;
       static deleteRecommendationComment = `${APIs.BASE_URL}/deleteRecommendationComment/:id`;
       static updateCommentToRecommendation = `${APIs.BASE_URL}/updateCommentToRecommendation`;
       static updateRecommendationRequest = `${APIs.BASE_URL}/updateRecommendationRequest/:id`;


}