
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


    //process courseDetails

    static uploadCourseDetailUrl = `${APIs.BASE_URL}/uploadCourseDetail`;
    static getCourseDetailUrl = `${APIs.BASE_URL}/getCoursesDetails`;


    //procecourseOffering

     static uploadCourseOfferingUrl = `${APIs.BASE_URL}/uploadCourseOffering`;
    static getCourseOfferingUrl = `${APIs.BASE_URL}/getCoursesOfferings`;


    //process timetable
    
     static uploadTimeTableUrl = `${APIs.BASE_URL}/uploadTimetable`;
    static getTimetableUrl = `${APIs.BASE_URL}/getTimetables`;


    //process results

        static uploadSessionalResultUrl = `${APIs.BASE_URL}/uploadSessionalResult`;

    // transcript
       static getStudentTranscriptSummaryUrl = `${APIs.BASE_URL}/getStudentTranscriptSummary/:id`;


}