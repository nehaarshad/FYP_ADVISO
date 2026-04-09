import User from "../models/userModel.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import StudentGuardians from "../models/studentGuardianModel.js";
import BatchAssignment from "../models/batchAssignmentModel.js";
import ProgramModel from "../models/programModel.js";
import bcrypt from "bcryptjs";
import BatchModel from "../models/batchModel.js"
import Student from "../models/studentModel.js";
import { Op } from "sequelize";

const addAdvisor = async(req,res)=>{

    try {

        const{sapid,password,advisorName,email,gender,contactNumber}= req.body;
        console.log("Request Body",req.body) 
        const existingUser = await User.findOne({ where: { sapid } });
        if (existingUser) {
            return res.json("SAP ID Already Exist");
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newuser = await User.create({ sapid, password: hashedPassword, role:"advisor" });

            const number= parseInt(contactNumber)

            let newUserInfo=await BatchAdvisor.findOne({where:{email}})
            console.log("Existing Advisor",newUserInfo)
            if(newUserInfo){
                await newuser.destroy(); // Delete the newly created user if email already exists
                return res.json("Email Already Exist")
            }
             newUserInfo=await BatchAdvisor.create({advisorName,email,contactNumber:number,gender,userId:newuser.id})
           
            console.log("New advisor is added", newuser, newUserInfo)

            return res.status(201).json(newUserInfo)

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
            return res.json("Batch Advisor Not Found");
        }

                        const emailExists = await BatchAdvisor.findOne({
                    where: {
                        email,
                        id: { [Op.ne]: id } // exclude current advisor
                    }
                });

                if (emailExists) {
                    console.log("Email already used by another advisor", emailExists)
                    return res.status(400).json("Email already used by another advisor");
                }
        else{

            await BatchAdvisor.update({advisorName,email,contactNumber,gender}, {where:{id}})

            if(batchName && batchYear && programName){

                const program = await ProgramModel.findOne({where:{programName}})

                if(!program){
                    return res.status(404).json("Program Not Found")
                }

                const batch = await BatchModel.findOne({where:{batchName,batchYear,programId:program.id}})
                if(!batch){
                    return res.status(404).json("Batch Not Found")
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

        return res.json("advisor updated successfully")
        
        
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
            return res.json("SAP ID Already Exist");
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newuser = await User.create({ sapid, password: hashedPassword, role:"student" });

            const program = await ProgramModel.findOne({where:{programName}})

            if(!program){
                return res.status(404).json("Program Not Found")
            }
            const batch = await BatchModel.findOne({where:{batchName,batchYear,programId:program.id}})
            if(!batch){
                return res.status(404).json("Batch Not Found")
            }
         
            console.log("Batch of Student",batch);

            if(!batch){
                return res.status(404).json("Batch Not Found")
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

                return res.status(201).json("User Created Successfully")
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
            return res.json("Student Not Found");
        }
            const program = await ProgramModel.findOne({where:{programName}})

            if(!program){
                return res.status(404).json("Program Not Found")
            }
            const batch = await BatchModel.findOne({where:{batchName,batchYear,programId:program.id}})
            if(!batch){
                return res.status(404).json("Batch Not Found")
            }
         
            console.log("Batch of Student",batch);

            if(!batch){
                return res.status(404).json("Batch Not Found")
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

                return res.status(201).json("User updates Successfully")
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
            return res.json("User Not Found");
        }

        existingUser = await Student.findOne({where:{studentName:studentname,userId:existingUser.id}});
        if (!existingUser) {
            return res.json("Student Not Found");
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

}

export default {addAdvisor,addNewStudent,updateAdvisor,updateStudent,updateStudentStatus,addViaExcelSheet}
