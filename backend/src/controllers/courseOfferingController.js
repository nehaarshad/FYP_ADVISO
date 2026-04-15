import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import CourseOfferingModel from '../models/courseOfferingModel.js';
import BatchModel from '../models/batchModel.js';
import ProgramModel from '../models/programModel.js';
import sheetProcessingHelperFunction from '../utils/sheetProcessingHelperFunction.js';
const { getCellText } = sheetProcessingHelperFunction;
import SessionModel from '../models/sessionModel.js';
import { Op } from 'sequelize';

dotenv.config();

const uploadCourseOffering = async (req, res) => {
    try {
        const {sessionType, sessionYear,programName} = req.body;
        console.log("Received session info:", sessionType, sessionYear);

        const [session] = await SessionModel.findOrCreate({
            where: {
                sessionType: sessionType,
                sessionYear: sessionYear
            }
        });
       console.log("Session lookup result:", session ? `${session.sessionType} ${session.sessionYear}` : "No session found");
        if (!session) {
            return res.status(500).json({ message: 'Failed to create or find session' });
        }
        const courseFile = req.file;
        if (!courseFile) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(courseFile.path);
        const worksheet = workbook.worksheets[0];
        
        console.log("Processing course offering sheet:", worksheet.name);
        console.log("Extracted program name:", programName);
        
        const program = await ProgramModel.findOne({
            where: {
                [Op.or]: [
                    { programName: { [Op.like]: `%${programName}%` } },
                ]
            }
        });
        
        console.log("Program lookup result:", program ? program.programName : "No program found");
        if (!program) {
            return res.status(404).json({ 
                message: 'Program not found'
            });
        }
        
        console.log("Found program:", program.programName);
        
        let currentBatch = null;
        const offerings = [];
        
        // Process rows starting from row 3 (after headers)
        for (let i = 2; i <= worksheet.rowCount; i++) {
           const batchInfoCell = worksheet.getCell(i, 1);
            const semesterCourseCell = worksheet.getCell(i, 2);
            const creditsCell = worksheet.getCell(i, 4);
            const categoryCell = worksheet.getCell(i, 6);
            
            // Use helper functions on the cell objects (not on .value)
            const batchInfo = getCellText(batchInfoCell).toUpperCase();
            const semesterCourse = getCellText(semesterCourseCell);
            const credits = getCellText(creditsCell);
            const courseCategory = getCellText(categoryCell);
            console.log(`Row ${i} - Batch Info: "${batchInfo}", Semester/Course: "${semesterCourse}", Credits: "${credits}", Category: "${courseCategory}"`);
            // Skip empty rows
            if (!batchInfo && !semesterCourse) {
                continue;
            }
            
            // Check if this row contains batch/semester header (e.g., "Spring 2026", "Fall 2025")
            if (batchInfo && semesterCourse && batchInfo.match(/^(Spring|Fall|Summer)\s+\d{4}/i)) {
                // Extract batch name and year
                const batchMatch = batchInfo.match(/^(Spring|Fall|Summer)\s+(\d{4})/i);
                if (batchMatch) {
                    const batchSeason = batchMatch[1];
                    const batchYear = batchMatch[2];
                    const batchName = batchSeason.toUpperCase() ;
                    
                    console.log(`Processing batch: ${batchName}`);
                    
                    // Find or create batch
                    currentBatch = await BatchModel.findOne({
                        where: {
                            batchName: batchName,
                            batchYear: batchYear,
                            programId: program.id
                        }
                    });
                    
                    if (!currentBatch) {
                        console.log(`Batch not found: ${batchName} for program ${program.programName}Id ${program.id}, batch Year ${batchYear}`);

                        currentBatch =await BatchModel.create({
                        
                            batchName: batchName,
                            batchYear: batchYear,
                            programId: program.id
                        
                    });
                    } else {
                        console.log(`Found batch: ${currentBatch.batchName} ${currentBatch.batchYear}`);
                    
                        // Process course offering if we have valid course data
            if (semesterCourse && credits && currentBatch) {
                let courseName = semesterCourse;
                // Parse credits 
                let creditHours = parseInt(credits);
                
                
                
                // Check if offering already exists
                const existingOffering = await CourseOfferingModel.findOne({
                    where: {
                          courseName: courseName,
                        credits: creditHours,
                        courseCategory: courseCategory,
                        batchId: currentBatch.id,
                         sessionId: session.id,
                        programId: program.id
                    }
                });
                
                if (!existingOffering) {
                    const offeringData = {
                        courseName: courseName,
                        credits: creditHours,
                        courseCategory: courseCategory,
                        batchId: currentBatch.id,
                         sessionId: session.id,
                        programId: program.id
                    };
                    
                    const offering = await CourseOfferingModel.create(offeringData);
                    offerings.push(offering);
                    console.log(`Added offering: ${courseName} (${creditHours} credits) for batch ${currentBatch.batchName} ${currentBatch.batchYear}`);
                } else {
                    console.log(`Offering already exists: ${courseName} for batch ${currentBatch.batchName} ${currentBatch.batchYear}`);
     
                }
            } 


                    }
                }
                continue;
            }
        
        }
        
        // Return success response
        res.status(200).json({data:offerings,success:true});
        
    } catch (error) {
        console.error('Error uploading course offering:', error);
        res.status(500).json({ 
            message: 'Failed to upload course offering',
            error: error.message 
        });
    }
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