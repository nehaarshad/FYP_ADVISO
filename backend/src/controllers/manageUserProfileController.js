import User from "../models/userModel.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import StudentGuardians from "../models/studentGuardianModel.js";
import BatchModel from "../models/batchModel.js"
import Student from "../models/studentModel.js";
import Admin from "../models/adminModel.js";

const updateAdvisorProfile = async(req,res)=>{

    try {

        const {id} = req.params;
        const{email,gender,contactNumber}= req.body;

        const batchAdvisor = await BatchAdvisor.findByPk(id);
        if (!batchAdvisor) {
            return res.status(404).json("Advisor not found");
        }
        else{
          
            const updates=await BatchAdvisor.update(
                {
                    email,contactNumber,gender
                },
                 {
                   where: { id } 
                 }
                )

            console.log("advisor is updated", updates)

            return res.json("Update successfully")

        }
        
        
    } catch (error) {

        console.error("Error while adding the new batch advisor",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const updateStudentProfile = async(req,res)=>{

    try {

        const {id}=req.params;
        const{registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber,fullName,guardianemail,guardiancontactNumber}= req.body;

        const existingUser = await Student.findByPk(id);
        if (!existingUser) {
            return res.json("Student not found");
        }
        else{

                const updates=await Student.update(
                    {registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber},
                    {where:id}
                )

                console.log("Student data updated", updates)

                if(fullName && guardiancontactNumber){
                   const studentGuardian =  await StudentGuardians.create({fullName,contactNumber:guardiancontactNumber,email:guardianemail,studentId:id})
                   console.log("New Student guardian",studentGuardian)
                }

                return res.status(201).json("Student Profile Updated Successfully")
            
        }
        
        
    } catch (error) {

        console.error("Error while adding the new student",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const updateCoordinatorProfile = async(req,res)=>{

    try {

        const{spassword,studentName,registrationNumber,dateOfBirth,cnic,currentSemester,email,contactNumber,batchName,batchYear,currentStatus,reason,fullName,guardianemail,guardiancontactNumber}= req.body;

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

                await batch.update({
                    totalStudent:batch.totalStudent++
                })

                await batch.save();

                return res.status(201).json("User Created Successfully")
            }

        }
        
        
    } catch (error) {

        console.error("Error while adding the new student",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

const updateAdminProfile = async(req,res)=>{

    try {

        const{id}=req.params;

        const{sapid,name,email,contactNumber,department}= req.body;

        const existingUser = await Admin.findByPk(id);
        if (!existingUser) {
            return res.json("user not found");
        }
        else{
    
            await Admin.update(
                {sapid,name,email,contactNumber,department},
                {where:{id}}
            );

            console.log("admin profile updated ")
            }
        
        
    } catch (error) {

        console.error("Error while adding the new student",error)
        return res.status(500).json("Internal Server Error")
        
    }
}

export default {addAdvisor,addNewStudent}
