import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import CourseOfferingModel from '../models/courseOfferingModel.js';
import BatchModel from '../models/batchModel.js';
import ProgramModel from '../models/programModel.js';
import sheetProcessingHelperFunction from '../utils/sheetProcessingHelperFunction.js';
const { getCellText } = sheetProcessingHelperFunction;
import SessionModel from '../models/sessionModel.js';
import { Op } from 'sequelize';
import fs from 'fs';
dotenv.config();

const uploadCourseOffering = async (req, res) => {
    //  const courseFile = req.file;
    // try {
    //     const {sessionType, sessionYear,programName} = req.body;
    //     console.log("Received session info:", sessionType, sessionYear);

    //     const [session] = await SessionModel.findOrCreate({
    //         where: {
    //             sessionType: sessionType,
    //             sessionYear: sessionYear
    //         }
    //     });
    //    console.log("Session lookup result:", session ? `${session.sessionType} ${session.sessionYear}` : "No session found");
    //     if (!session) {
    //         return res.status(500).json({ message: 'Failed to create or find session' });
    //     }
       
    //     if (!courseFile) {
    //         return res.status(400).json({ message: 'No file uploaded' });
    //     }

    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.readFile(courseFile.path);
    //     const worksheet = workbook.worksheets[0];
        
    //     console.log("Processing course offering sheet:", worksheet.name);
    //     console.log("Extracted program name:", programName);
        
    //     const program = await ProgramModel.findOne({
    //         where: {
    //             [Op.or]: [
    //                 { programName: { [Op.like]: `%${programName}%` } },
    //             ]
    //         }
    //     });
        
    //     console.log("Program lookup result:", program ? program.programName : "No program found");
    //     if (!program) {
    //         return res.status(404).json({ 
    //             message: 'Program not found'
    //         });
    //     }
        
    //     console.log("Found program:", program.programName);
        
    //     let currentBatch = null;
    //     const offerings = [];
        
    //     for (let i = 1; i <= worksheet.rowCount; i++) {
    //         let batchCell;
    //         let coursecell;
    //         let creditcell;
    //         let categorycell;

    //         //to get the headings columns
    //         for(let j = 1; j <= worksheet.columnCount; j++) {
    //             const cell = worksheet.getCell(i, j);
    //             const cellText = getCellText(cell);
    //             console.log(`Row ${i}, Column ${j}: "${cellText}"`);
    //             batchCell = cellText && cellText.match(/^(Batch*)\s+\d{4}/i);
    //             coursecell = cellText && cellText.match(/^(Course*)\s+\d{4}/i);
    //             creditcell = cellText && cellText.match(/^(Credits*|Cr*|Credit*)\s+\d{4}/i);
    //             categorycell = cellText && cellText.match(/^(Category*|Cat*|*Category)\s+\d{4}/i);
    //         }
    //         const batchInfoCell = worksheet.getCell(i, batchCell ? batchCell.index : 1);
    //         const semesterCourseCell = worksheet.getCell(i, coursecell ? coursecell.index : 2);
    //         const creditsCell = worksheet.getCell(i, creditcell ? creditcell.index : 4);
    //         const categoryCell = worksheet.getCell(i, categorycell ? categorycell.index : 6);

    //         const batchInfo = getCellText(batchInfoCell).toUpperCase();
    //         const semesterCourse = getCellText(semesterCourseCell);
    //         const credits = getCellText(creditsCell);
    //         const courseCategory = getCellText(categoryCell);
    //         console.log(`Row ${i} - Batch Info: "${batchInfo}", Semester/Course: "${semesterCourse}", Credits: "${credits}", Category: "${courseCategory}"`);
    //         // Skip empty rows
    //         if (!batchInfo && !semesterCourse) {
    //             continue;
    //         }
            
    //         // Check if this row contains batch/semester header (e.g., "Spring 2026", "Fall 2025")
    //         const isBatchHeader = batchInfo && batchInfo.match(/^(Spring|Fall|Summer)\s+\d{4}/i);
            
    //         if (isBatchHeader) {
    //             // Extract batch name and year
    //             const batchMatch = batchInfo.match(/^(Spring|Fall|Summer)\s+(\d{4})/i);
    //             if (batchMatch) {
    //                 const batchSeason = batchMatch[1];
    //                 const batchYear = batchMatch[2];
    //                 const batchName = batchSeason.toUpperCase();
                    
    //                 console.log(`Processing batch: ${batchName}`);
                    
    //                 // Find or create batch
    //                 currentBatch = await BatchModel.findOne({
    //                     where: {
    //                         batchName: batchName,
    //                         batchYear: batchYear,
    //                         programId: program.id
    //                     }
    //                 });
                    
    //                 if (!currentBatch) {
    //                     console.log(`Batch not found: ${batchName} for program ${program.programName}Id ${program.id}, batch Year ${batchYear}`);
    //                     currentBatch = await BatchModel.create({
    //                         batchName: batchName,
    //                         batchYear: batchYear,
    //                         programId: program.id
    //                     });
    //                     console.log(`Created new batch: ${currentBatch.batchName} ${currentBatch.batchYear}`);
    //                 } else {
    //                     console.log(`Found batch: ${currentBatch.batchName} ${currentBatch.batchYear}`);
    //                 }
                    
    //                 if (semesterCourse && credits && !semesterCourse.match(/^Sem\d+\s*-\s*\d+cr/i)) {
                     
    //                     let courseName = semesterCourse;
    //                     let creditHours = parseInt(credits);
                        
    //                     if (!isNaN(creditHours) && creditHours > 0) {
                         
    //                         const existingOffering = await CourseOfferingModel.findOne({
    //                             where: {
    //                                 courseName: courseName,
    //                                 credits: creditHours,
    //                                 courseCategory: courseCategory,
    //                                 batchId: currentBatch.id,
    //                                 sessionId: session.id,
    //                                 programId: program.id
    //                             }
    //                         });
                            
    //                         if (!existingOffering) {
    //                             const offeringData = {
    //                                 courseName: courseName,
    //                                 credits: creditHours,
    //                                 courseCategory: courseCategory,
    //                                 batchId: currentBatch.id,
    //                                 sessionId: session.id,
    //                                 programId: program.id
    //                             };
                                
    //                             const offering = await CourseOfferingModel.create(offeringData);
    //                             offerings.push(offering);
    //                             console.log(`Added offering: ${courseName} (${creditHours} credits) for batch ${currentBatch.batchName} ${currentBatch.batchYear}`);
    //                         } else {
    //                             console.log(`Offering already exists: ${courseName} for batch ${currentBatch.batchName} ${currentBatch.batchYear}`);
    //                         }
    //                     }
    //                 }
    //             }
    //             continue; 
    //         }
    //         if (semesterCourse && credits && currentBatch) {
    //             if (semesterCourse.match(/^Sem\d+\s*-\s*\d+cr/i)) {
    //                 console.log(`Skipping semester header: ${semesterCourse}`);
    //                 continue;
    //             }
                
    //             let courseName = semesterCourse;
    //             let creditHours = parseInt(credits);
                
    //             // Validate credit hours
    //             if (isNaN(creditHours) || creditHours <= 0) {
    //                 console.log(`Skipping row ${i}: Invalid credits "${credits}"`);
    //                 continue;
    //             }
                
    //             // Check if offering already exists
    //             const existingOffering = await CourseOfferingModel.findOne({
    //                 where: {
    //                     courseName: courseName,
    //                     credits: creditHours,
    //                     courseCategory: courseCategory,
    //                     batchId: currentBatch.id,
    //                     sessionId: session.id,
    //                     programId: program.id
    //                 }
    //             });
                
    //             if (!existingOffering) {
    //                 const offeringData = {
    //                     courseName: courseName,
    //                     credits: creditHours,
    //                     courseCategory: courseCategory,
    //                     batchId: currentBatch.id,
    //                     sessionId: session.id,
    //                     programId: program.id
    //                 };
                    
    //                 const offering = await CourseOfferingModel.create(offeringData);
    //                 offerings.push(offering);
    //                 console.log(`Added offering: ${courseName} (${creditHours} credits) for batch ${currentBatch.batchName} ${currentBatch.batchYear}`);
    //             } else {
    //                 console.log(`Offering already exists: ${courseName} for batch ${currentBatch.batchName} ${currentBatch.batchYear}`);
    //             }
    //         }
    //     }
        
    //     fs.unlinkSync(courseFile.path); // Delete the uploaded file after processing
               
    //     res.status(200).json({
    //         data: offerings,
    //         success: true,
    //         message: `Successfully processed ${offerings.length} course offerings`
    //     });
        
    // } catch (error) {
    //     try {
    //         if (courseFile && fs.existsSync(courseFile.path)) {
    //             fs.unlinkSync(courseFile.path);
    //         }
    //     } catch (unlinkError) {
    //         console.error('Error deleting file:', unlinkError);
    //     }
               
    //     console.error('Error uploading course offering:', error);
    //     res.status(500).json({ 
    //         message: 'Failed to upload course offering',
    //         error: error.message 
    //     });
    // }
};
const getCourseOfferings = async (req, res) => {
    try {
        const offerings = await CourseOfferingModel.findAll({
            
            include: [
                {
                    model: BatchModel,
                },
                {
                    model: ProgramModel,
                   
                },
                {
                    model: SessionModel,
                   
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        console.log(`Retrieved ${offerings.length} course offerings from database`);
        res.status(200).json({data:offerings,success:true});
    } catch (error) {
        console.error('Error retrieving course offerings:', error);
        res.status(500).json({
            message: 'Failed to retrieve course offerings',
            error: error.message
        });
    }
};



export default { 
    uploadCourseOffering, 
    getCourseOfferings, 
};