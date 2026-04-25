import User from "../models/userModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import TranscriptCoursesDetail from "../models/TranscriptCoursesDetailModel.js"
import SessionalTranscript from "../models/sessionalTranscriptModel.js"
import DegreeTranscript from "../models/degreeTranscriptModel.js"
import CategoryModel from "../models/categoryModel.js"
import CourseCategoryModel from "../models/courseCategoryModel.js"
import CoursesModel from "../models/coursesModel.js"
import Student from "../models/studentModel.js";

// Function to process and save student transcript
const processStudentTranscript = async (studentData, sessionId, batchId,res) => {
    try {
        console.log(`\nProcessing transcript for: ${studentData.studentName} (${studentData.studentNo}),${studentData.progressionStatus},${studentData.cgpa}, Batch ID: ${batchId}, Session ID: ${sessionId})`);
        
        let user = await User.findOne({
            where: { sapid: studentData.studentNo }
        });
        
        if (!user) {
            return res.status(404).json({ success: false, message: `User with SAP ID ${studentData.studentNo} not found` });
            }
        
        let student = await Student.findOne({
            where: { userId: user.id, batchId: batchId ,studentName: studentData.studentName},
        });
        
        if (!student) {
            return res.status(404).json({ success: false, message: `Student record for ${studentData.studentName} not found in batch ${batchId}` });
        }


        //UPDATE OR CREATE STUDENT STATUS

         const studentStatus =  await StudentStatus.findOne({where:{studentId:student.id}})
            if(studentStatus){
                if(studentStatus.currentStatus !== studentData.progressionStatus && studentStatus.currentStatus === 'Promoted'){
                    await studentStatus.update({currentStatus:studentData.progressionStatus,reason:`Status changed from ${studentStatus.currentStatus} to ${studentData.progressionStatus} based on semester results`})
                }
               }
            else{
                await StudentStatus.create({currentStatus:studentData.progressionStatus,reason:`Initial Status  is ${studentData.progressionStatus} based on semester results`,studentId:student.id})    
            }
        
        //Get or create degree transcript
        let degreeTranscript = await DegreeTranscript.findOne({
            where: { studentId: student.id },
        });
        
        if (!degreeTranscript) {
            degreeTranscript = await DegreeTranscript.create({
                totalEarnedCreditHours: studentData.totalAttemptedCRH,
                currentCGPA: studentData.cgpa,
                studentId: student.id
            });
            console.log(`  Created degree transcript`);
        }
        else{
            degreeTranscript.totalEarnedCreditHours = degreeTranscript.totalEarnedCreditHours + studentData.totalAttemptedCRH;
            degreeTranscript.currentCGPA = studentData.cgpa;
            await degreeTranscript.save();
            console.log(`  Updated degree transcript with new total credits and CGPA from sheet`);
        }

        //get or create a sessional transcript for this semester

        let semesterTranscript = await SessionalTranscript.findOne({
            where: {
                degreeTranscriptId: degreeTranscript.id,
                sessionId: sessionId
            }
        });

        if(!semesterTranscript){
            semesterTranscript = await SessionalTranscript.create({
                semesterEarnedCreditHours: studentData.totalAttemptedCRH,
                semesterGPA: studentData.gpa,
                degreeTranscriptId: degreeTranscript.id,
                sessionId: sessionId
            });
        }

        else{
            semesterTranscript.semesterEarnedCreditHours = studentData.totalAttemptedCRH;
            semesterTranscript.semesterGPA = studentData.gpa;
            await semesterTranscript.save();
        }
        
        for (const module of studentData.modules) {
            // Find course
            let course = await CoursesModel.findOne({
                where: {
                    courseCode: module.code,
                    courseName: module.name
                },
            });
            
            if (!course) {

               return res.status(404).json({ success: false, message: `Course with code ${module.code} and name ${module.name} not found in database` });
                
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
        
       student.currentSemester=student.currentSemester+1;
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

