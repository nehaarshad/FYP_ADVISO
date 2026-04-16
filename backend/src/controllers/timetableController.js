import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import TimetableModel from '../models/timetableModel.js';
import CourseOfferingModel from '../models/courseOfferingModel.js';
import BatchModel from '../models/batchModel.js';
import utils from '../utils/sheetProcessingHelperFunction.js';
const { getCellText , parseTime, cleanCourseName,splitCourseWithSlash, normalizeOfferingName ,getProgramCode} = utils;
import ProgramModel from '../models/programModel.js';
import SessionModel from '../models/sessionModel.js';
import { Op } from 'sequelize';
import fs from 'fs';

dotenv.config();

const uploadTimetable = async (req, res) => {
     const timetableFile = req.file;
    try {

        const {sessionType, sessionYear,programName} = req.body;
        console.log("Received session info:", sessionType, sessionYear);

        // find session and program to get their IDs
        const [session] = await SessionModel.findOrCreate({
            where: {
                sessionType: sessionType,
                sessionYear: sessionYear
            }
        });
        
        const program = await ProgramModel.findOne({
            where: {
                [Op.or]: [
                    { programName: { [Op.like]: `%${programName}%` } },
                ]
            }
        });
        
        console.log("Program lookup result:", program ? program.programName : "No program found");
        if (!program) {
            fs.unlinkSync(timetableFile.path); // Delete the uploaded file after processing
        
            return res.status(404).json({ 
                message: 'Program not found',
                searchedProgram: programName 
            });
        }
        
        console.log("Found program:", program.programName);

        if (!timetableFile) {
            
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(timetableFile.path);
        const worksheet = workbook.worksheets[0];
        
        console.log("Processing timetable sheet:", worksheet.name);
        
        const courseOfferings = await CourseOfferingModel.findAll({
            where: { programId: program.id,sessionId: session.id },
        
        });
        
        console.log(`Found ${courseOfferings.length} course offerings`);
        
        const offeringMap = new Map();

        console.log("\nMapping course offerings:");
         for (const offering of courseOfferings) {
            // Split by "/" if exists
            const normalizedNames = splitCourseWithSlash(offering.courseName);
            
            for (const normalizedName of normalizedNames) {
                if (!offeringMap.has(normalizedName)) {
                    offeringMap.set(normalizedName, offering);
                    console.log(`   "${normalizedName}" -> "${offering.courseName}"`);
                }
            }
        }
        
        console.log(`Total mappings: ${offeringMap.size}`);
        
        const timetables = [];
        
        // Process each row of the timetable
        for (let i = 3; i <= worksheet.rowCount; i++) {
            const title = getCellText(worksheet.getCell(i, 1));
            const day = getCellText(worksheet.getCell(i, 2));
            const time = getCellText(worksheet.getCell(i, 3));
            const venue = getCellText(worksheet.getCell(i, 4));
            const instructor = getCellText(worksheet.getCell(i, 5));
            
            if (!title || !day || !time) continue;
            
            // Normalize the timetable course name
            const normalizedTitle = normalizeOfferingName(title);
            console.log(`\n📋 "${title}" -> "${normalizedTitle}"`);

                console.log(`   getProgramCode: "${getProgramCode(title)}"`);
                console.log(`   cleanCourseName: "${cleanCourseName(title)}"`);

const matchedOffering = offeringMap.get(normalizedTitle);
            console.log("in mapping function ",offeringMap.get(normalizedTitle))
            
            
            if (!matchedOffering) {
                console.log(`   No match found`);
                continue;
            }
            
            console.log(`   Matched with: "${matchedOffering.courseName}"`);
            
            // Parse time
            const timeInfo = parseTime(time);
            if (!timeInfo) {
                console.log(`   Could not parse time`);
                continue;
            }
            
            // Check for duplicate
            const existing = await TimetableModel.findOne({
                where: {
                    courseOfferingId: matchedOffering.id,
                    day: day,
                    startTime: timeInfo.start,
                    endTime: timeInfo.end
                }
            });
            
            if (existing) {
                console.log(`    Already exists`);
                continue;
            }
            
            // Create timetable entry
            const timetable = await TimetableModel.create({
                courseOfferingId: matchedOffering.id,
                day: day,
                venue: venue || 'TBA',
                instructor: instructor || 'TBA',
                startTime: timeInfo.start,
                endTime: timeInfo.end
            });
            
            timetables.push(timetable);
            console.log(`    Created entry`);
        }
        
           fs.unlinkSync(timetableFile.path); // Delete the uploaded file after processing
               
        res.status(200).json({data:timetables});
        
    } catch (error) {
           fs.unlinkSync(timetableFile.path); // Delete the uploaded file after processing
               
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to upload timetable', error: error.message });
    }
};

const getTimetable = async (req, res) => {
    try {
        
        const timetables = await TimetableModel.findAll({
            include: [
            {
                model: CourseOfferingModel,
                include: [
                    { model: BatchModel, attributes: ['id', 'batchName', 'batchYear'] },
                    { model: ProgramModel, attributes: ['id', 'programName'] },
                    { model: SessionModel, attributes: ['id', 'sessionType', 'sessionYear'] }
                ]
            }
        ],
            order:  [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            message: 'Timetable retrieved successfully',
            data: timetables
        });
        
    } catch (error) {
        console.error('Error retrieving timetable:', error);
        res.status(500).json({
            message: 'Failed to retrieve timetable',
            error: error.message
        });
    }
};


export default { uploadTimetable, getTimetable };