import User from "../models/userModel.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import StudentGuardians from "../models/studentGuardianModel.js";
import BatchAssignment from "../models/batchAssignmentModel.js";
import ProgramModel from "../models/programModel.js";
import bcrypt from "bcryptjs";
import BatchModel from "../models/batchModel.js"
import Student from "../models/studentModel.js";
import ExcelJS from 'exceljs';
import utils from '../utils/sheetProcessingHelperFunction.js';
const { getCellText } = utils;

import fs from 'fs';
import { Op } from "sequelize";

const addAdvisor = async(req,res)=>{

    try {

        const{sapid,password,advisorName,email,gender,contactNumber}= req.body;
        console.log("Request Body",req.body) 
        const existingUser = await User.findOne({ where: { sapid } });
        if (existingUser) {
            return res.json({message:"SAP ID Already Exist"});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newuser = await User.create({ sapid, password: hashedPassword, role:"advisor" });

            const number= parseInt(contactNumber)

            let newUserInfo=await BatchAdvisor.findOne({where:{email}})
            console.log("Existing Advisor",newUserInfo)
            if(newUserInfo){
                await newuser.destroy(); // Delete the newly created user if email already exists
                return res.json({message:"Email Already Exist"})
            }
             newUserInfo=await BatchAdvisor.create({advisorName,email,contactNumber:number,gender,userId:newuser.id})
           
            console.log("New advisor is added", newuser, newUserInfo)

            return res.status(201).json({data:newUserInfo,success:true})

        }
        
        
    } catch (error) {

        console.error("Error while adding the new batch advisor",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const updateAdvisor = async(req,res)=>{
  try {

        const {id} = req.params;
        const{advisorName,email,gender,contactNumber,batchName,batchYear,programName,isCurrentlyAdvised}= req.body;

        console.log("Request Body",req.body)
        let existingUser;


         existingUser = await BatchAdvisor.findByPk(id);
        if (!existingUser) {
            return res.json({message:"Batch Advisor Not Found"});
        }

                        const emailExists = await BatchAdvisor.findOne({
                    where: {
                        email,
                        id: { [Op.ne]: id } // exclude current advisor
                    }
                });

                if (emailExists) {
                    console.log("Email already used by another advisor", emailExists)
                    return res.status(400).json({message:"Email already used by another advisor"});
                }
        else{

            await BatchAdvisor.update({advisorName,email,contactNumber,gender}, {where:{id}})

            if(batchName && batchYear && programName){

                const program = await ProgramModel.findOne({where:{programName}})

                if(!program){
                    return res.status(404).json({message:"Program Not Found"})
                }

                const batch = await BatchModel.findOne({where:{batchName,batchYear,programId:program.id}})
                if(!batch){
                    return res.status(404).json({message:"Batch Not Found"})
                }

                let batchAssignment;

                    //if batch is already advised by other advisor - set it to ended
                  await BatchAssignment.update({
                                                        isCurrentlyAdvised:false,endDate:new Date()},
                                                        {where:{batchId:batch.id,isCurrentlyAdvised:true}  
                                                    })
                //if advisor already advisor any other batch then end it
                 await BatchAssignment.update({endDate:new Date(),isCurrentlyAdvised:false},{where:{advisorId:id}})
               
                //if advisor already advised similar batch in past then update it
                 batchAssignment = await BatchAssignment.findOne({
                        where: {
                            advisorId: id,
                            batchId: batch.id
                        }
                    });
                 console.log("Previous Batch Assignment",batchAssignment)

              if (batchAssignment) {
                    const endDate = isCurrentlyAdvised === false ? new Date() : null;

                    await batchAssignment.update({
                        isCurrentlyAdvised,
                        endDate
                    });

                } else {
                    // 5. If not exists → create new
                    await BatchAssignment.create({
                        advisorId: id,
                        batchId: batch.id,
                        startDate: new Date(),
                        isCurrentlyAdvised: true
                    });
                }
                                console.log("Batch Assign",batchAssignment)
                            
                            }

                        }

        return res.json({message:"advisor updated successfully"})
        
        
    } catch (error) {

        console.error("Error while updating the batch advisor",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const addNewStudent = async(req,res)=>{

    try {

        const{sapid,password,studentName,registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber,programName,batchName,batchYear,currentStatus,reason,fullName,guardianemail,guardiancontactNumber}= req.body;

        const existingUser = await User.findOne({ where: { sapid } });
        if (existingUser) {
            return res.status(400).json({error:"SAP ID Already Exist"});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newuser = await User.create({ sapid, password: hashedPassword, role:"student" });

            const program = await ProgramModel.findOne({where:{programName}})

            if(!program){
                await User.destroy({where:sapid})
                return res.status(404).json({message:"Program Not Found"})
            }
            const batch = await BatchModel.findOne({where:{batchName,batchYear,programId:program.id}})
            if(!batch){
                return res.status(404).json({message:"Batch Not Found"})
            }
         
            console.log("Batch of Student",batch);

            if(!batch){
                return res.status(404).json({message:"Batch Not Found"})
            }
            else{
                const newUserInfo=await Student.create({studentName,registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber,userId:newuser.id,batchId:batch.id})

                console.log("New user is added", newuser, newUserInfo)

                if(currentStatus && reason){
                  const studentStatus =  await StudentStatus.create({currentStatus,reason,studentId:newUserInfo.id})
                  console.log("New Student Status",studentStatus)
                }

                if(fullName && guardiancontactNumber && guardianemail){
                   const studentGuardian =  await StudentGuardians.create({fullName,contactNumber:guardiancontactNumber,email:guardianemail,studentId:newUserInfo.id})
                   console.log("New Student guardian",studentGuardian)
                }
                    batch.totalStudent += 1;
                    await batch.save();

                return res.status(201).json({message:"User Created Successfully"})
            }

        }
        
        
    } catch (error) {

        console.error("Error while adding the new student",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const updateStudent = async(req,res)=>{

    try {

        const {id} = req.params;//stdId
        const{studentName,registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber,programName,batchName,batchYear,currentStatus,reason,fullName,guardianemail,guardiancontactNumber}= req.body;

            let existingUser;
                existingUser = await Student.findByPk(id);

        if (!existingUser) {
            return res.json({message:"Student Not Found"});
        }
            const program = await ProgramModel.findOne({where:{programName}})

            if(!program){
                return res.status(404).json({message:"Program Not Found"})
            }
            const batch = await BatchModel.findOne({where:{batchName,batchYear,programId:program.id}})
            if(!batch){
                return res.status(404).json({message:"Batch Not Found"})
            }
         
            console.log("Batch of Student",batch);

            if(!batch){
                return res.status(404).json({message:"Batch Not Found"})
            }
            else{
                existingUser=await Student.update({studentName,registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber,batchId:batch.id}, {where:{id}})

                console.log("Student updated", existingUser)

                if(currentStatus && reason){
                  const studentStatus =  await StudentStatus.findOne({where:{studentId:id}})
                    if(studentStatus){
                        await studentStatus.update({currentStatus,reason})
                    }
                    else{
                        await StudentStatus.create({currentStatus,reason,studentId:id})    
                    }
                }

                if(fullName && guardiancontactNumber && guardianemail){

                    let studentGuardian = await StudentGuardians.findOne({where:{studentId:id}})
                    if(studentGuardian){
                        await studentGuardian.update({fullName,contactNumber:guardiancontactNumber,email:guardianemail})
                    }
                    else{
                        studentGuardian =  await StudentGuardians.create({fullName,contactNumber:guardiancontactNumber,email:guardianemail,studentId:id})
                    }
                }

                return res.status(201).json({message:"User updates Successfully"})
            }

        
        
    } catch (error) {

        console.error("Error while updating the student",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const updateStudentStatus = async(req,res)=>{

    try {
        const{sapid,studentname,currentStatus,reason}= req.body;

        let existingUser;

        existingUser = await User.findOne({where:{sapid,role:"student"},include:[{model:Student}]})
        if (!existingUser) {
            return res.json({message:"User Not Found"});
        }

        existingUser = await Student.findOne({where:{studentName:studentname,userId:existingUser.id}});
        if (!existingUser) {
            return res.json({message:"Student Not Found"});
        }
        const studentStatus =  await StudentStatus.findOne({where:{studentId:existingUser.id}})
            if(studentStatus){
                await studentStatus.update({currentStatus,reason})
            }
            else{
                await StudentStatus.create({currentStatus,reason,studentId:existingUser.id})    
            }

        return res.status(201).json("Student Status Updated Successfully")
    }

        catch (error) {
            console.error("Error while updating the student status",error)
            return res.status(500).json("Internal Server Error")
        }
}


const addViaExcelSheet = async(req,res)=>{
            const studentFile = req.file;
    try {
        const {programName, batchName, batchYear} = req.body;
        console.log("Check Body:", req.body);


        if(!studentFile) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Find or create program
        const [program] = await ProgramModel.findOrCreate({
            where: { programName },
            defaults: { programName }
        });
        console.log("Program:", program.programName);

        // Find or create batch
        const [batch] = await BatchModel.findOrCreate({
            where: { 
                batchName, 
                batchYear, 
                programId: program.id 
            },
            defaults: {
                batchName,
                batchYear,
                programId: program.id,
                totalStudent: 0
            }
        });
        console.log("Batch:", batch.batchName, batch.batchYear);

        // Read Excel file
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(studentFile.path);
        const worksheet = workbook.worksheets[0];
        const sheetName = worksheet.name;
        console.log("Worksheet name:", sheetName);
        let headerRowIndex = 1;
        for(let i = 1; i <= 5; i++) { 
            const firstCell = getCellText(worksheet.getCell(i, 1));
            if(firstCell === "Sr No." || firstCell === "Sr No") {
                headerRowIndex = i;
                console.log(`Found header at row ${headerRowIndex}`);
                break;
            }
        }

        // Start processing from the row after header
        for(let i = headerRowIndex + 1; i <= worksheet.rowCount; i++) {
            const srNo = getCellText(worksheet.getCell(i, 1));
            let sapid = getCellText(worksheet.getCell(i, 2));
            const studentName = getCellText(worksheet.getCell(i, 3));
            
            console.log(`Processing Row ${i}: SrNo="${srNo}", SAPID="${sapid}", Name="${studentName}"`);
            
            // Skip empty rows or header rows
            if(!sapid || !studentName || sapid === "Student No." || studentName === "Student Name") {
                console.log(`Row ${i} skipped (missing SAPID or Student Name)`);
             
                continue;
            }
            
            // Parse SAPID as integer
            const parsedSapid = parseInt(sapid);
            if(isNaN(parsedSapid)) {
                console.log(`Row ${i} skipped (invalid SAPID: ${sapid})`);
               
                continue;
            }
            
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ 
                    where: { sapid: parsedSapid } 
                });
                
                if(existingUser) {
                    console.log(`User with SAPID ${parsedSapid} already exists, skipping...`);
                    continue;
                }
                
                // Generate credentials
                const password = `sap${parsedSapid}`;
                console.log(`Generated Password: ${password}`);
                const hashedPassword = await bcrypt.hash(password, 10);
                const email = `${parsedSapid}@students.riphah.edu.pk`;
                
                // Create user
                const newUser = await User.create({ 
                    sapid: parsedSapid, 
                    password: hashedPassword, 
                    role: "student" 
                });
                console.log(`Created User ID: ${newUser.id} for SAPID: ${parsedSapid}`);
                
                // Create student with default values for required fields
                const newStudent = await Student.create({
                    studentName: studentName.trim(),
                    registrationNumber: null,
                    dateOfBirth: null,
                    cnic: null,
                    currentSemester: 1, // Set default semester to 1 (or calculate based on batch)
                    email: email,
                    contactNumber: null,
                    userId: newUser.id,
                    batchId: batch.id
                });
                console.log(`Created Student ID: ${newStudent.id} for ${studentName}`);
                
                // Update batch total student count
                batch.totalStudent = (batch.totalStudent || 0) + 1;
                await batch.save();
                
            
                
            } catch(error) {
                console.error(`Error processing row ${i} for student ${studentName}:`, error.message);
            }
        }
        
    
           fs.unlinkSync(studentFile.path); // Delete the uploaded file after processing
               
        return res.status(200).json( {message:"Student upload completed",success:true} );
        
    } catch(error) {
        console.error("Error while uploading students via Excel sheet:", error);
         fs.unlinkSync(studentFile.path); // Delete the uploaded file after processing
        return res.status(500).json({ 
            error: error.message 
        });
    }
};


export default {addAdvisor,addNewStudent,updateAdvisor,updateStudent,updateStudentStatus,addViaExcelSheet}
