import BatchModel from '../models/batchModel.js';
import StudentTranscript from './transcriptManagementController.js';
import ExcelJS from 'exceljs';
import utils from '../utils/sheetProcessingHelperFunction.js';
const { getCellText } = utils;
import ProgramModel from '../models/programModel.js';
import SessionModel from '../models/sessionModel.js';
import fs from 'fs';
const {processStudentTranscript} = StudentTranscript

const uploadSessionalResult = async(req,res) =>{
    const resultFile = req.file;
    try {
        const {sessionType, sessionYear, programName, batchName, batchYear} = req.body;
        console.log("Check Body:", req.body);

        
        if(!resultFile){
             fs.unlinkSync(resultFile.path); // Delete the uploaded file after processing
       
            return res.status(400).json({ error: "No file uploaded" });
        }

        const [session] = await SessionModel.findOrCreate({where:{sessionType, sessionYear}});
        console.log("Session:", session.sessionType, session.sessionYear);

        const [program] = await ProgramModel.findOrCreate({where:{programName}, defaults:{programName}});
        console.log("Program:", program.programName);

        const [batch] = await BatchModel.findOrCreate({where:{batchName, batchYear, programId:program.id}});
        console.log("Batch:", batch.batchName, batch.batchYear);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(resultFile.path);
        const worksheet = workbook.worksheets[0]; 
        const sheetName = worksheet.name;
        console.log("Worksheet name:", sheetName);

        // Find header row
        let headerRowIndex = -1;
        for(let i = 1; i <= 10; i++) { 
            const firstCell = getCellText(worksheet.getCell(i, 1));
            console.log(`Row ${i}, Column 1: "${firstCell}"`);
            if(firstCell === "Sr No." || firstCell === "Sr No") {
                headerRowIndex = i;
                console.log(`Found header at row ${headerRowIndex}`);
                break;
            }
        }
        
        if (headerRowIndex === -1) {
             fs.unlinkSync(resultFile.path); // Delete the uploaded file after processing
       
            throw new Error('Could not find header row in the sheet');
        }

        // Extract headers with their column positions
        const headerMap = new Map(); // header name -> column index
        
        console.log("\n=== Extracting Headers ===");
        for(let col = 1; col <= worksheet.columnCount; col++) {
            const cellValue = getCellText(worksheet.getCell(headerRowIndex, col));
            if(cellValue && cellValue !== '') {
                headerMap.set(cellValue, col);
                console.log(`Column ${col}: "${cellValue}"`);
            }
        }
        
        console.log(`\nTotal headers found: ${headerMap.size}`);
        
        // Helper function to get cell value by header name
        const getCellByHeader = (headerName, rowNum) => {
            const colIndex = headerMap.get(headerName);
            if (!colIndex) {
                return '';
            }
            try {
                return getCellText(worksheet.getCell(rowNum, colIndex));
            } catch (error) {
                return '';
            }
        };
        
        // Process students
        const students = [];
let processedCount = 0;
let skippedCount = 0;
let errorCount = 0;

console.log("\n=== Processing Student Data ===");

for (let rowNum = headerRowIndex + 1; rowNum <= worksheet.rowCount; rowNum++) {
    const srNo = getCellText(worksheet.getCell(rowNum, 1));
    
    // Skip empty rows
    if (!srNo || srNo === '' || srNo === 'null') {
        skippedCount++;
        continue;
    }
    
    const student = {
        srNo: parseInt(srNo),
        studentNo: getCellText(worksheet.getCell(rowNum, 2)),
        studentName: getCellText(worksheet.getCell(rowNum, 4)),
        holdStatus: getCellText(worksheet.getCell(rowNum, 10)),
        remarks: getCellText(worksheet.getCell(rowNum, 11)),
        totalAttemptedCRH: 0,
        totalGradedCRH: 0, // This will store earned credits
        gpa: 0,
        cgpa: 0,
        progressionStatus: '',
        modules: []
    };
    
    // Skip if student has no name or ID
    if (!student.studentName || !student.studentNo || student.studentName === 'null' || student.studentNo === 'null') {
        console.log(`\nRow ${rowNum}: Skipping - invalid student data (Name: ${student.studentName}, ID: ${student.studentNo})`);
        skippedCount++;
        continue;
    }
    
    // Get values using header mapping
    const totalAttemptedCRH = getCellByHeader('Total Attemted CRH', rowNum);
    student.totalAttemptedCRH = totalAttemptedCRH ? parseFloat(totalAttemptedCRH) : 0;
    
    const totalGradedCRH = getCellByHeader('Total Graded CRH', rowNum);
    student.totalGradedCRH = totalGradedCRH ? parseFloat(totalGradedCRH) : 0;
    
    const gpa = getCellByHeader('GPA', rowNum);
    student.gpa = gpa ? parseFloat(gpa) : 0;
    
    const cgpa = getCellByHeader('CGPA', rowNum);
    student.cgpa = cgpa ? parseFloat(cgpa) : 0;
    
    student.progressionStatus = getCellByHeader('Progression Status', rowNum);
    
    console.log(`\nRow ${rowNum}: ${student.studentName} (${student.studentNo})`);
    console.log(`  GPA: ${student.gpa}, CGPA: ${student.cgpa}, Status: ${student.progressionStatus}, Earned CRH: ${student.totalGradedCRH}, Attempted CRH: ${student.totalAttemptedCRH}`);
    
    // Parse modules - iterate through possible module numbers
    let moduleNum = 1;
    let hasValidModules = false;
    
    while(moduleNum <= 20) {
        const moduleCodeHeader = `Module${moduleNum} Code`;
        const moduleIdHeader = `Module${moduleNum} Id`;
        const moduleNameHeader = `Module${moduleNum} Name`;
        
        const moduleCode = getCellByHeader(moduleCodeHeader, rowNum);
        
        // Stop if no more modules
        if (!moduleCode || moduleCode === '' || moduleCode === 'null') {
            if (moduleNum === 1) {
                console.log(`  No modules found for this student`);
            }
            break;
        }
        
        let grade = '';
        let chrEarned = 0;
        let chrAttempted = 0;
        let marks = 0;
        let gradePoint = 0;
        let moduleProduct = '';

        const moduleCodeCol = headerMap.get(moduleCodeHeader);
        if (moduleCodeCol) {
            const gradeCol = moduleCodeCol + 3;
            const chrEarnedCol = moduleCodeCol + 4;
            const chrAttemptedCol = moduleCodeCol + 5;
            const marksCol = moduleCodeCol + 6;
            const gradePointCol = moduleCodeCol + 7;
            const moduleProductCol = moduleCodeCol + 8;
            
            grade = getCellText(worksheet.getCell(rowNum, gradeCol));
            chrEarned = parseFloat(getCellText(worksheet.getCell(rowNum, chrEarnedCol))) || 0;
            chrAttempted = parseFloat(getCellText(worksheet.getCell(rowNum, chrAttemptedCol))) || 0;
            marks = parseFloat(getCellText(worksheet.getCell(rowNum, marksCol))) || 0;
            gradePoint = parseFloat(getCellText(worksheet.getCell(rowNum, gradePointCol))) || 0;
            moduleProduct = getCellText(worksheet.getCell(rowNum, moduleProductCol));
        }
        
        const module = {
            code: moduleCode,
            id: getCellByHeader(moduleIdHeader, rowNum),
            name: getCellByHeader(moduleNameHeader, rowNum),
            grade: grade,
            chrEarned: chrEarned,
            chrAttempted: chrAttempted,
            marks: marks,
            gradePoint: gradePoint,
            moduleProduct: moduleProduct
        };
        
        // Only add if module has valid code and name
        if (module.code && module.code !== '' && module.code !== 'null') {
            console.log(`  Module ${moduleNum}: ${module.code} - ${module.name || 'N/A'} (Grade: ${module.grade || 'N/A'}, Marks: ${module.marks})`);
            student.modules.push(module);
            hasValidModules = true;
        }
        moduleNum++;
    }
    
    if (hasValidModules && student.modules.length > 0) {
        try {
            const result = await processStudentTranscript(student, session.id, batch.id);
            students.push(student);
            processedCount++;
            console.log(`Successfully processed ${student.studentName}`);
        } catch (error) {
            console.error(` Error processing student ${student.studentName}:`, error.message);
            errorCount++;
            // Continue with next student
            continue;
        }
    } else {
        console.log(` Warning: No valid modules found for ${student.studentName}`);
        skippedCount++;
    }
}

        console.log(`\n=== Summary ===`);
        console.log(`Processed: ${processedCount} students`);
        console.log(`Skipped: ${skippedCount} students`);
        console.log(`Errors: ${errorCount} students`);
        
        if(processedCount === 0) {
             fs.unlinkSync(resultFile.path); // Delete the uploaded file after processing
            throw new Error('No student data found in the sheet');
        }
         fs.unlinkSync(resultFile.path); // Delete the uploaded file after processing
       
        
         return res.status(200).json({message:"Sessional Result file parsed successfully",success:true});
 
    } catch (error) {
        console.error("Error in upload sessional result:", error);
         fs.unlinkSync(resultFile.path); // Delete the uploaded file after processing
       
        return res.status(500).json({
            success: false,
            error: "Something went wrong, Try Again",
            details: error.message
        });
    }
};


export default {uploadSessionalResult}