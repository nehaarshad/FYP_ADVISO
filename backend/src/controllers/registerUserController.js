import User from "../models/userModel.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import StudentGuardians from "../models/studentGuardianModel.js";
import BatchModel from "../models/batchModel.js"
import Student from "../models/studentModel.js";

const addAdvisor = async(req,res)=>{

    try {

        const{sapid,password,advisorName,email,gender,contactNumber}= req.body;

        const existingUser = await User.findOne({ where: { sapid } });
        if (existingUser) {
            return res.json("SAP ID Already Exist");
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newuser = await User.create({ sapid, password: hashedPassword, role });

            const newUserInfo=await BatchAdvisor.create({advisorName,email,contactNumber,gender,userId:newuser.id})

            console.log("New advisor is added", newuser, newUserInfo)

        }
        
        
    } catch (error) {

        console.error("Error while adding the new batch advisor",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const addNewStudent = async(req,res)=>{

    try {

        const{sapid,password,studentName,registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber,batchName,batchYear,currentStatus,reason,fullName,guardianemail,guardiancontactNumber}= req.body;

        const existingUser = await User.findOne({ where: { sapid } });
        if (existingUser) {
            return res.json("SAP ID Already Exist");
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newuser = await User.create({ sapid, password: hashedPassword, role });

            const batch = await BatchModel.findOne({where:{batchName,batchYear}})
         
            console.log("Batch of Student",batch);

            if(!batch){
                return res.status(404).json("Batch Not Found")
            }
            else{
                const newUserInfo=await Student.create({studentName,registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber,userId:newuser.id,batchId:batch.id})

                console.log("New advisor is added", newuser, newUserInfo)

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

export default {addAdvisor,addNewStudent}
