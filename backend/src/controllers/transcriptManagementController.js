import User from "../models/userModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import TranscriptCoursesDetail from "../models/TranscriptCoursesDetailModel.js"
import SessionalTranscript from "../models/sessionalTranscriptModel.js"
import DegreeTranscript from "../models/degreeTranscriptModel.js"
import CategoryModel from "../models/categoryModel.js"
import CourseCategoryModel from "../models/courseCategoryModel.js"
import CoursesModel from "../models/coursesModel.js"
import Student from "../models/studentModel.js";
import RoadmapModel from "../models/roadmapModel.js";
import BatchModel from "../models/batchModel.js";

// Function to process and save student transcript
const processStudentTranscript = async (studentData, sessionId, batchId) => {
    try {
        console.log(`\nProcessing transcript for: ${studentData.studentName} (${studentData.studentNo}),${studentData.progressionStatus},${studentData.cgpa}, Batch ID: ${batchId}, Session ID: ${sessionId})`);
        
        let user = await User.findOne({
            where: { sapid: studentData.studentNo }
        });
        console.log(`  Found user in transcript: ${user ? user.id : 'None'}`);
   if (!user) {
    throw new Error(`User with SAP ID ${studentData.studentNo} not found`);
}
        
        let student = await Student.findOne({
            where: { userId: user.id, batchId: batchId ,studentName: studentData.studentName},
        });
        console.log(`  Found student record: ${student ? student.id : 'None'}`);
        if (!student) {
    throw new Error(`Student record for ${studentData.studentName} not found in batch ${batchId}`);
}

const assignedRoadmap = await BatchModel.findOne({
    where: { id: batchId },
    include: [{ model: RoadmapModel }]
});


        //UPDATE OR CREATE STUDENT STATUS

        const studentStatus = await StudentStatus.findOne({ where: { studentId: student.id } });
console.log(`  Found student status: ${studentStatus ? studentStatus.currentStatus : 'None'}`);

if (studentStatus) {
    console.log(`  Current DB status: "${studentStatus.currentStatus}"`);
    console.log(`  New status from Excel: "${studentData.progressionStatus}"`);
    console.log(`  Are they different? ${studentStatus.currentStatus !== studentData.progressionStatus}`);
    
    if (studentStatus.currentStatus !== studentData.progressionStatus) {
        console.log(`  Updating status from "${studentStatus.currentStatus}" to "${studentData.progressionStatus}"`);
        await studentStatus.update({
            currentStatus: studentData.progressionStatus,
            reason: `Status changed from ${studentStatus.currentStatus} to ${studentData.progressionStatus} based on semester results`
        });
        console.log(`  Status updated successfully`);
    } else {
        console.log(`   Status already matches, no update needed`);
    }
} else {
    console.log(`  Creating new student status: "${studentData.progressionStatus}"`);
    await StudentStatus.create({
        currentStatus: studentData.progressionStatus,
        reason: `Initial Status is ${studentData.progressionStatus} based on semester results`,
        studentId: student.id
    });
}
        
        //Get or create degree transcript
            let degreeTranscript = await DegreeTranscript.findOne({
                where: { studentId: student.id },
            });

            if (!degreeTranscript) {
                degreeTranscript = await DegreeTranscript.create({
                    totalEarnedCreditHours: studentData.totalGradedCRH, // Use graded (earned) credits, not attempted
                    currentCGPA: studentData.cgpa,
                    studentId: student.id
                });
                console.log(`  Created degree transcript with ${studentData.totalGradedCRH} earned credits`);
            } else {
                const totalCHR=parseInt(degreeTranscript.totalEarnedCreditHours) + parseInt(studentData.totalGradedCRH)
                console.log("sum of ", degreeTranscript.totalEarnedCreditHours , "+" ,studentData.totalGradedCRH,"=",totalCHR,typeof(totalCHR))
                // Add new earned credits to existing total
                degreeTranscript.totalEarnedCreditHours = totalCHR.toString();
                degreeTranscript.currentCGPA = studentData.cgpa;
                await degreeTranscript.save();
                console.log(`  Updated degree transcript: added ${studentData.totalGradedCRH} earned credits, new total: ${degreeTranscript.totalEarnedCreditHours}`);
            }

        //get or create a sessional transcript for this semester
            let semesterTranscript = await SessionalTranscript.findOne({
                where: {
                    degreeTranscriptId: degreeTranscript.id,
                    sessionId: sessionId
                }
            });

            if (!semesterTranscript) {
                semesterTranscript = await SessionalTranscript.create({
                    semesterEarnedCreditHours: studentData.totalGradedCRH, 
                    semesterGPA: studentData.gpa,
                    degreeTranscriptId: degreeTranscript.id,
                    sessionId: sessionId
                });
                student.currentSemester=student.currentSemester+1;
                console.log(`  Created semester transcript with ${studentData.totalGradedCRH} earned credits`);
            } else {
                semesterTranscript.semesterEarnedCreditHours = studentData.totalGradedCRH;
                semesterTranscript.semesterGPA = studentData.gpa;
                await semesterTranscript.save();
                console.log(`  Updated semester transcript with ${studentData.totalGradedCRH} earned credits`);
            }
        
        for (const module of studentData.modules) {

             if (!module.code || module.code === '' || module.code === 'null') {
                    console.log(`  Skipping module with null code`);
                    continue;
                }
            // Find course
            let course = await CoursesModel.findOne({
                where: {
                    courseCode: module.code,
                    courseName: module.name
                },
            });
            
                if (!course) {
                    throw new Error(`Course with code ${module.code} and name ${module.name} not found in database`);
                }
            
                    //find course category
                    let courseCategory = await CourseCategoryModel.findOne({
                        where: { courseId: course.id },
                    });

                    courseCategory = courseCategory ? await CategoryModel.findOne({ where: { id: courseCategory.categoryId } }) : null;


            console.log(`    Found course: ${course.courseCode} - ${course.courseName}, Category: ${courseCategory ? courseCategory.categoryName : 'None'}`);
            const courseCategoryName = courseCategory  ? courseCategory.categoryName : 'Unknown';

            //add in to sessional transcript details

            const CourseDetail = await TranscriptCoursesDetail.findOne({
                    where: {
                courseCode: module.code,
                sessionalTranscriptId: semesterTranscript.id
                    }
            });
           if(!CourseDetail){

             const sessionCourseDetail = await TranscriptCoursesDetail.create({
                courseName: module.name,
                courseCode: module.code,
                courseCategory: courseCategoryName,
                points: module.gradePoint,
                grade: module.grade,
                marks: module.marks,
                earnedCreditHours: module.chrEarned.toString(),
                totalCreditHours: module.chrAttempted.toString(),
                sessionalTranscriptId: semesterTranscript.id
            });

           }
            else{
                CourseDetail.courseName = module.name;
                CourseDetail.courseCategory = courseCategoryName;
                CourseDetail.points = module.gradePoint;
                CourseDetail.grade = module.grade;
                CourseDetail.marks = module.marks;
                CourseDetail.earnedCreditHours = module.chrEarned.toString();
                CourseDetail.totalCreditHours = module.chrAttempted.toString();
                await CourseDetail.save();
            }
            console.log(`Processed course: ${module.code} - ${module.name} | Grade: ${module.grade}, Points: ${module.gradePoint}, Earned CHR: ${module.chrEarned}`);
        }
        
   
       const studentTranscriptSummary = await DegreeTranscript.findOne({
        where: { studentId: student.id },
        include: [
            {
                model: SessionalTranscript,
                include: [TranscriptCoursesDetail]
            }
        ]
       }); 
        
       
       await student.save()
       if(parseInt(student.totalGradedCRH)>=parseInt(assignedRoadmap.RoadmapModel.totalCreditHours)){
        console.log(`Student ${studentData.studentName} has completed the required credit hours. Deactivating user account.`);
        user.isActive=false;
        await user.save();
        studentStatus.currentStatus="Graduated";
        studentStatus.reason="Student has completed the required credit hours and graduated.";
        await studentStatus.save();
       }
        if(studentData.progressionStatus==="Graduated" || studentData.progressionStatus==="Dropped" || studentData.progressionStatus==="Discontinued" || studentData.progressionStatus==="Dismissed" || studentData.progressionStatus==="Expelled" || studentData.progressionStatus==="Relegated" || studentData.progressionStatus==="Suspended" || studentData.progressionStatus==="Terminated" || studentData.progressionStatus==="Inactive" || studentData.progressionStatus==="Alumni"){
        console.log(`Student ${studentData.studentName} current status is ${studentData.progressionStatus}. Deactivating user account.`);
        user.isActive=false;
        await user.save();
        studentStatus.currentStatus=studentData.progressionStatus;
        studentStatus.reason="Student has been marked as " + studentData.progressionStatus + " in the system. ";
        await studentStatus.save();
       }
        await student.save()
        return {studentTranscriptSummary };
        
    } catch (error) {
        console.error(`Error processing transcript for ${studentData.studentName}:`, error);
        return error;
    }
};

const getStudentTranscriptSummary = async (req,res) => {
    
    const { id } = req.params; // student ID from request parameters

    try {
        const studentTranscriptSummary = await DegreeTranscript.findOne({
            where: { studentId: id },
            include: [
                {
                    model: SessionalTranscript,
                    include: [TranscriptCoursesDetail]
                }
            ]
        });

        return res.status(200).json({data:studentTranscriptSummary,success:true} );
    } catch (error) {
        console.error(`Error fetching transcript summary for student ${id}:`, error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export default { processStudentTranscript, getStudentTranscriptSummary };

