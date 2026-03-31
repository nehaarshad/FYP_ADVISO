import RoadmapModel from '../models/RoadmapModel.js';
import RoadmapCourseCategoryModel from '../models/RoadmapCourseCategoryModel.js';
import CategoryModel from '../models/categoryModel.js';
import ProgramModel from '../models/programModel.js';
import BatchModel from '../models/batchModel.js';
import CourseCategoryModel from '../models/courseCategoryModel.js';
import SemesterCourseModel from '../models/semesterCourseModel.js';
import detectSummaryRow from '../utils/roadmapSummaryRow.js';
import extractCourses from '../utils/roadmapCoursesfetching.js';
import dotenv from 'dotenv';
dotenv.config();
import detectSemesters from '../utils/roadmapSemesterCreditHour.js';
import SemesterRoadmapModel from '../models/semesterRoadmapModel.js';
import CoursesModel from '../models/coursesModel.js';
import ExcelJS from 'exceljs';

const uploadNewRoadmap = async (req, res) => {
    try {
        const { programName, batchName,batchYear, } = req.body;
        console.log("Received data for new roadmap:", req.body);
        const roadmapFile=req.file; // Access the uploaded file

        console.log("Uploaded roadmap file:", roadmapFile);
        const [program] = await ProgramModel.findOrCreate({ where: { programName } }); //find if program exist otherwise create new program like CA
        const [batch] = await BatchModel.findOrCreate({ where: { programId:program.id,batchName,batchYear } }); //find the batch of program otherwise create new batch like Programs SE batch fall 2026
        console.log("Found or created program:", program);
        console.log("Found or created batch:", batch);

        if (!roadmapFile) {
            return res.status(400).json({ error: 'Roadmap file is required.' });
        }
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(roadmapFile.path);
        const worksheet = workbook.worksheets[0]; 
        const versionName = worksheet._name;
        console.log("Extracted name of worksheet:", versionName);

         const {  categories, totalCreditHours } = detectSummaryRow(worksheet);
         
         //1. create roadmap
        const pathUrl = `${process.env.BASE_URL}/src/uploads/${roadmapFile.filename}`;        
   
        let roadmap= await RoadmapModel.findOne({ where:
           { programId: program.id,
            versionName
           }
        });

        console.log("Existing roadmap found in database:", roadmap);

        if (!roadmap) {
            roadmap = await RoadmapModel.create({
                programId: program.id,
                versionName,
                totalCreditHours,
                roadmapFilePath: pathUrl, 
            });
        }
       
        console.log("Created roadmap in database:");

        //2. create categories and roadmap-category associations
            for (const category of categories) {
                const [Category] = await CategoryModel.findOrCreate({
                    where: { categoryName: category.name ,colorScheme:category.color},
                    });
                console.log(`Manage course category: ${Category.categoryName} (ID: ${Category.id})`);
                const isexist=await RoadmapCourseCategoryModel.findOne({where:{

                    roadmapId: roadmap.id, //1
                    categoryId: Category.id,//2
                }
                });
                if(!isexist){
                    await RoadmapCourseCategoryModel.create({
                    roadmapId: roadmap.id,
                    categoryId: Category.id,
                    requiredCredits: category.requiredCredits,
            
                });
                }
                console.log(`   Saved category details for: ${category.name}`);
            }

         //3. associate with semester roadmap table  
         const {semesters} = detectSemesters(worksheet, 2);
         for(const sem of semesters){
            const isFound= await SemesterRoadmapModel.findOne({where:{
                roadmapId: roadmap.id,
                semesterNo: sem.semesterNo,
            }});
            if(!isFound){
            await SemesterRoadmapModel.create({
                roadmapId: roadmap.id,
                semesterNo: sem.semesterNo,
                totalCreditHours: sem.totalCreditHours,
            });
            console.log(`   Saved semester details for: ${sem.semesterNo}`);
        }
         }

      //   4. extract courses and associate with roadmap

            const courses = extractCourses(worksheet, 4, categories);
                for (const course of courses) {

                    console.log(`Processing course: ${course.courseName} under category: ${course.categoryName} and semester ${course.semesterNo}`);
                   
                    const courseCategory = await CategoryModel.findOne({ where: { categoryName: course.categoryName } });
                    console.log(`   Found category in database: ${courseCategory.categoryName} (ID: ${courseCategory.id}) for course ${course.courseName}`);
                 
                    const semesterRoadmap = await SemesterRoadmapModel.findOne({ where: { roadmapId: roadmap.id, semesterNo: course.semesterNo } });
                console.log(`   Found semester roadmap in database: Semester ${semesterRoadmap.semesterNo} (ID: ${semesterRoadmap.id}) for course ${course.courseName}`);
                 
                
                let newCourse = await CoursesModel.findOne({ where: { courseName: course.courseName ,courseCredits: course.credits} });
                
                  if (!newCourse) {
                     newCourse = await CoursesModel.create({
                        courseName: course.courseName,
                        courseCredits: course.credits,
                    });
                     console.log(`Created new course: ${newCourse.courseName} ${newCourse.id} with credits ${newCourse.courseCredits}`);
  
                  
                 }
                 
                 let categoryOfCourse;

                  categoryOfCourse = await  CourseCategoryModel.findOne({ where: 
                        { 
                             courseId: newCourse.id, //1
                             categoryId: courseCategory.id 
                        }
                    } );

                    console.log(`Checking course-category mapping "${categoryOfCourse ? categoryOfCourse.id : 'N/A'}"`);

                        
                     if(!categoryOfCourse){   
                        categoryOfCourse = await CourseCategoryModel.create({
                            courseId: newCourse.id,
                            categoryId: courseCategory.id,
                        });
                         console.log(`Creating course-category mapping "${categoryOfCourse.id}`);

                     }

                 const mapWithRoadmapSemester = await  SemesterCourseModel.findOne({ where: 
                        { 
                             semesterRoadmapId: semesterRoadmap.id,
                             courseCategoryId: categoryOfCourse.id 
                        }
                    } );

                     if(!mapWithRoadmapSemester){   
                        await SemesterCourseModel.create({
                            semesterRoadmapId: semesterRoadmap.id,
                            courseCategoryId: categoryOfCourse.id,
                        });

                        console.log(`Mapped course "${course.courseName}" to semester ${course.semesterNo} under category "${course.categoryName}"`);
                     }


                    
                }

        return res.json({ message: 'Roadmap uploaded successfully', roadmap });


       // const totalCreditHours =0;
    }
    catch (error) {
        console.log(error); 
        return res.json({ error: "Internal Server Error" });
    }
};

const getRoadmapDetails = async (req, res) => {
    try {
        const { programName } = req.params;

        console.log("Received request for roadmap details with programName:", programName);
        
        // Find program by name
        const program = await ProgramModel.findOne({ 
            where: { 
                programName: programName 
            } 
        });

        if (!program) {
            return res.status(404).json({ error: "Program not found" });
        }
       const roadmap = await RoadmapModel.findOne({
    where: { programId: program.id },
    include: [
        {
            model: RoadmapCourseCategoryModel,
            include: [
                {
                    model: CategoryModel,
                    include: [
                        {
                            model: CourseCategoryModel,
                            include: [
                                {
                                    model: CoursesModel,
                                    attributes: ["id", "courseName", "courseCredits"]
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
                                    attributes: ["id", "courseName", "courseCredits"]
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
            return res.status(404).json({ error: "Roadmap not found for this program" });
        }
        
        
        return res.json( roadmap  );
        
    } catch (error) {
        console.error("Error in getRoadmapDetails:", error);
        return res.status(500).json({ 
            error: "Internal Server Error",
            details: error.message 
        });
    }
};


export default {
    uploadNewRoadmap,
    getRoadmapDetails,
}