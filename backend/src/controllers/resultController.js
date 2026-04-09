import BatchModel from '../models/batchModel.js';
import User from "../models/userModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import TranscriptCoursesDetail from "../models/TranscriptCoursesDetailModel.js"
import SessionalTranscript from "../models/sessionalTranscriptModel.js"
import DegreeTranscript from "../models/degreeTranscriptModel.js"
import CategoryModel from "../models/categoryModel.js"
import CourseCategoryModel from "../models/courseCategoryModel.js"
import CoursesModel from "../models/coursesModel.js"
import Student from "../models/studentModel.js";
import ExcelJS from 'exceljs';
import utils from '../utils/sheetProcessingHelperFunction.js';
const { getCellText , parseTime, cleanCourseName,splitCourseWithSlash, normalizeOfferingName ,getProgramCode} = utils;
import ProgramModel from '../models/programModel.js';
import SessionModel from '../models/sessionModel.js';
import { Op } from 'sequelize';
import e from 'express';


const uploadSessionalResult = async(req,res) =>{

    try {

        const {sessionType,sessionYear,programName,batchName,batchYear} = req.body;
        console.log("Check Body ",req.body)

        const resultFile = req.file;
        if(!resultFile){
            return res.json("No file uploaded")
        }

        const [session] = await SessionModel.findOrCreate({where:{sessionType,sessionYear}})
        console.log("Session ",session.sessionType,session.sessionYear)

        const [program] =  await ProgramModel.findOrCreate({where:{programName},defaults:{programName}})
        console.log("Program ",program.programName)

        const [batch] = await BatchModel.findOrCreate({where:{batchName,batchYear,programId:program.id}})
        console.log("Batch ",batch.batchName,batch.batchYear)

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(resultFile.path);
        const worksheet = workbook.worksheets[0]; 
        const sheetName = worksheet._name;
        console.log("Extracted name of worksheet:", sheetName);

        let data = [];
        let headerRowIndex = -1;
        let headers = [];
        
        for (let i = 1; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            console.log("Processing Row ",getCellText(row.getCell(1).value))
           if (getCellText(row.getCell(1).value) === 'Sr No.') {
                headerRowIndex = i ;
                for (let j = 1; j <= worksheet.rowCount; j++) {
                headers = getCellText(i.getCell(j).value);
                console.log("Header Cell Value:", headers);
                }
                console.log("Clean Headers:", headers);
              break;
            }
        }
        
        if (headerRowIndex === -1) {
            throw new Error('Could not find header row in the sheet');
        }
        
        return res.json("Sessional Result Uploaded Successfully")

        
    } catch (error) {
        console.log("Error in upload sessional result",error)
        return res.json(" Something went wrong, Try Again")
    }
}



export default {uploadSessionalResult}