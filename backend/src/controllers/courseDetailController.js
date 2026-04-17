import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import CoursesModel from '../models/coursesModel.js';
import CoursePreReqModel from '../models/coursePreReqModel.js';
import CourseCategoryModel from '../models/courseCategoryModel.js';
import { Op } from 'sequelize';
import CategoryModel from '../models/categoryModel.js';
import fs from 'fs';
dotenv.config();

const uploadCourseDetail = async (req, res) => {
     const courseFile = req.file;
    try {
       
        if (!courseFile) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(courseFile.path);
        const worksheet = workbook.worksheets[0];
        const versionName = worksheet.name;
        console.log("Processing sheet:", versionName);

        const coursesMap = new Map(); // courseCode -> {courseId, courseName, credits}
        const prerequisitesToAdd = []; // Store prerequisites to add after all courses are processed
        
        // 1: Process all courses from the sheet
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const courseCode = worksheet.getCell(i, 1).value?.toString().trim();
            const prerequisiteCourse = worksheet.getCell(i, 2).value?.toString().trim();
            const courseName = worksheet.getCell(i, 3).value?.toString().trim();
            const creditHours = worksheet.getCell(i, 4).value;
            
            // Skip empty rows
            if (!courseCode || !courseName) {
                continue;
            }
            
            console.log(`Processing course: ${courseCode} - ${courseName}`);
            
            // Check if course exists in database
            let existingCourse = await CoursesModel.findOne({
                where: {
                    [Op.or]: [
                        { courseCode: courseCode },
                        { 
                            courseName: courseName,
                            courseCredits: parseInt(creditHours)
                        }
                    ]
                }
            });
            
            let courseId;
            let  newMappedCourse;
            
            if (existingCourse) {
             
                let needsUpdate = false;
                
                // just to assign code to the course
                if (!existingCourse.courseCode && courseCode) {  //match course code exists f||t
                    existingCourse.courseCode = courseCode;
                    needsUpdate = true;
                }
                
                // Checking if course name or credits are different
                if (existingCourse.courseName !== courseName  //t
                          || 
                    existingCourse.courseCredits !== parseInt(creditHours)  //f
                ) {

                    // create new course if its name or credits are changed
                 existingCourse =    await CoursesModel.create({
                        courseCode: courseCode,
                        courseName: courseName,
                        courseCredits: parseInt(creditHours)
                    });
                    console.log(`Created new course due to name/credits change: ${courseCode} - ${courseName}`);
                    
                }

                console.log(`Existing course found: ${existingCourse.id}, ${existingCourse.courseCode} - ${existingCourse.courseName} with credits ${existingCourse.courseCredits}`);
                
                if (needsUpdate) {
                    await existingCourse.save();
                    courseId = existingCourse.id;
                    console.log(`Updated course: ${courseCode} - ${courseName}`);
                } if(newMappedCourse){
                    courseId = existingCourse.id;
                }
                 else {
                    console.log(`Course already exists with correct data: ${courseCode}`);
                    courseId = existingCourse.id;
                }
                
                
            } 
            else {
                // Create new course
                const newCourse = await CoursesModel.create({
                    courseCode: courseCode,
                    courseName: courseName,
                    courseCredits: parseInt(creditHours)
                });
                courseId = newCourse.id;
                console.log(`Created new course: ${courseCode} - ${courseName}`);
            }
            
            // Store all courses and access them via name
            coursesMap.set(courseName, {
                id: courseId,
                code: courseCode,
                credits: parseInt(creditHours)
            });
            
            console.log(`Course mapped: ${courseName} -> ID: ${courseId}, Code: ${courseCode}, Credits: ${creditHours}`);
            // map which code has which prereqCourse or have no any preReq
              prerequisitesToAdd.push({
                    courseName: courseName,  //actual course name
                    prerequisiteCourse: prerequisiteCourse ? prerequisiteCourse : null //preReq courseName might be null
                });
            
        }
        
        // 2: Process prerequisites
        
        for (const prereq of prerequisitesToAdd) {
            const course = coursesMap.get(prereq.courseName); //get complateCourseDetail to which preReq assign
            const prerequisiteCourse = coursesMap.get(prereq.prerequisiteCourse); // using courseName, get courseId of preReqCourse
  
            console.log(`Processing prerequisite for course: ${prereq.courseName} - Prerequisite: ${prereq.prerequisiteCourse}`);
            console.log(`Course details: ${course ? `ID: ${course.id}, Code: ${course.code}` : 'Not found'}, Prerequisite course details: ${prerequisiteCourse ? `ID: ${prerequisiteCourse.id}, Code: ${prerequisiteCourse.code}` : 'Not found'}`);
            
            if (!course) {
                console.log(` Could not find course for ${prereq.courseName}`);
                continue;
            }
            
            // Check if prerequisite already exists in database
            const existingPreReq = await CoursePreReqModel.findOne({ 
                where: {
                    courseid: course.id,
                    preReqCourseId: prerequisiteCourse ? prerequisiteCourse.id : null

                }
            });
            
            if (!existingPreReq) {
                // Add new prerequisite
                await CoursePreReqModel.create({
                    courseid: course.id,
                    preReqCourseId: prerequisiteCourse ? prerequisiteCourse.id : null
                });
                console.log(`Added prerequisite: ${prereq.courseCode} `);
            } 
        }
           fs.unlinkSync(courseFile.path); // Delete the uploaded file after processing
               
        // Return success response
        res.status(200).json({
            message: 'Course details uploaded successfully',
        });
        
    } catch (error) {
           fs.unlinkSync(courseFile.path); // Delete the uploaded file after processing
               
        console.error('Error uploading course detail:', error);
        res.status(500).json({ 
            message: 'Failed to upload course detail',
            error: error.message 
        });
    }
};

const getCoursesDetails = async (req, res) => {
    try {
        const courses = await CoursesModel.findAll({
            include: [
                {
                    model: CourseCategoryModel,
                    include: [{
                        model: CategoryModel
                    }],
                    required: false  
                },
                {
                    model: CoursePreReqModel,
                    as: "prerequisites",
                    include: [{
                        model: CoursesModel,
                        as: "prerequisiteCourse"
                    }],
                    required: false
                },
                {
                    model: CoursePreReqModel,
                    as: "usedAsPrerequisiteFor",
                    include: [{
                        model: CoursesModel,
                        as: "mainCourse"
                    }],
                    required: false
                }
            ]
        });
        
        res.status(200).json({
            message: 'Courses details retrieved successfully',
            data: courses
        });
    } catch (error) {
        console.error('Error retrieving courses details:', error);
        res.status(500).json({
            message: 'Failed to retrieve courses details',
            error: error.message
        });
    }
};

export default { uploadCourseDetail , getCoursesDetails};