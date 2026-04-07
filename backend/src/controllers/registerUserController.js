import User from "../models/userModel.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import StudentGuardians from "../models/studentGuardianModel.js";
import BatchAssignment from "../models/batchAssignmentModel.js";
import ProgramModel from "../models/programModel.js";
import bcrypt from "bcryptjs";
import BatchModel from "../models/batchModel.js"
import Student from "../models/studentModel.js";

const addAdvisor = async(req,res)=>{

    try {

        const{sapid,password,advisorName,email,gender,contactNumber,batchName,batchYear,programName}= req.body;
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
                return res.json("Email Already Exist")
            }
             newUserInfo=await BatchAdvisor.create({advisorName,email,contactNumber:number,gender,userId:newuser.id})
           
            if(batchName && batchYear && programName){

                const program = await ProgramModel.findOne({where:{programName}})

                if(!program){
                    return res.status(404).json("Program Not Found")
                }

                const batch = await BatchModel.findOne({where:{batchName,batchYear,programId:program.id}})
                if(!batch){
                    return res.status(404).json("Batch Not Found")
                }

                const batchAssignment = await BatchAssignment.create({advisorId:newUserInfo.id,batchId:batch.id,startDate:new Date()})
                 console.log("Batch Assign",batchAssignment)
            }
            console.log("New advisor is added", newuser, newUserInfo)

            return res.status(201).json("Advisor Created Successfully")

        }
        
        
    } catch (error) {

        console.error("Error while adding the new batch advisor",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const updateAdvisor = async(req,res)=>{
  try {

        const {id} = req.params;
        const{sapid,advisorName,email,gender,contactNumber,batchName,batchYear,programName,isCurrentlyAdvised}= req.body;

        let existingUser;
        //update sap id
        if(sapid){
              existingUser = await User.findOne({ where: { sapid } });
            if (existingUser) {
                existingUser.sapid = sapid;
                await existingUser.save();
            }
        }

         existingUser = await BatchAdvisor.findByPk(id);
        if (!existingUser) {
            return res.json("Batch Advisor Not Found");
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

               if(isCurrentlyAdvised){
                  const batchAssignment = await BatchAssignment.create({advisorId:id,batchId:batch.id,startDate:new Date()})
                  //if advisor already advisor any other batch then end it
                  await BatchModel.update({endDate:new Date(),isCurrentlyAdvised:false},{where:{advisorId:id}})
                  console.log("Batch Assign",batchAssignment)
               }
            }
            console.log("New advisor is added", newuser, newUserInfo)

        }
        
        
    } catch (error) {

        console.error("Error while adding the new batch advisor",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const assignBatchToAdvisor = async(req,res)=>{
  try {
    const {advisorId, batchName,batchYear,programName,} = req.body;   

    const program = await ProgramModel.findOne({where:{programName}})

    if(!program){
        return res.status(404).json("Program Not Found")
    }

    const batch = await BatchModel.findOne({where:{batchName,batchYear,programId:program.id}})
    if(!batch){
        return res.status(404).json("Batch Not Found")
    }

    const batchAssignment = await BatchAssignment.create({advisorId,batchId:batch.id,startDate:new Date()})
    await BatchAssignment.update({endDate:new Date(),isCurrentlyAdvised:false},{where:{advisorId}})

    console.log("Batch Assign",batchAssignment)
  }
    catch (error) {
        console.error("Error while assigning batch to advisor",error)
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

                  await BatchModel.update(
                            {
                                totalStudent:batch.totalStudent++ // values to update
                            },
                            {
                                where: { id: batch.id } // condition to find the batch
                            }
                            
                        );

                return res.status(201).json("User Created Successfully")
            }

        }
        
        
    } catch (error) {

        console.error("Error while adding the new student",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const addViaExcelSheet = async(req,res)=>{

}

export default {addAdvisor,addNewStudent,updateAdvisor,assignBatchToAdvisor}
