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

const getAllUsers = async (req,res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        return res.status(200).json({data:users,success:true})
    } catch (error) {
        console.error("Error while fetching users",error)
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}

const getAllStudents = async (req,res) => {
    try {
        const students = await Student.findAll({
            include:[
                {
                    model:User,
                    attributes:{exclude:["password"]}
                },
                {
                    model:StudentStatus,
                },
                {
                    model:StudentGuardians,
                },
                {
                            model:BatchModel,
                            include:[
                                {
                                    model:ProgramModel,
                                },
                                {   
                    model:BatchAssignment,
                    include:[
                        {
                            model:BatchAdvisor,
                            include:[
                                {
                                    model:User,
                                    attributes:{exclude:["password"]}
                                }
                            ]
                        },
                    ]
                }
                            ]
                        },
                
            ]
        })
        return res.status(200).json({data:students,success:true})
     } catch (error) {
        console.error("Error while fetching students",error)
        return res.status(500).json({message:"Internal Server Error",success:false})
     }
}

const getAllAdvisors = async (req,res) => {
    try {
        const advisors = await BatchAdvisor.findAll({
            include:[
                {
                    model:User,
                    attributes:{exclude:["password"]}
                },
                {
                    model:BatchAssignment,
                    include:[
                        {
                            model:BatchModel,
                            include:[
                                {
                                    model:ProgramModel,
                                }
                            ]
                        },
                    ],
                }
            ]
        })
        return res.status(200).json({data:advisors,success:true})
     } catch (error) {
        console.error("Error while fetching advisors",error)
        return res.status(500).json({message:"Internal Server Error",success:false})
     }
}

const updateUserStatus = async (req,res) => {
    try {
        const {sapid,isActive} = req.body
        const user = await User.findOne({where:{sapid}})
        if(!user){
            return res.status(404).json({message:"User not found",success:false})
        }
        user.isActive = isActive
        if(!isActive){
            user.deactivateAt = new Date()
        }
        else{
            user.deactivateAt = null
        }
        await user.save()
        return res.status(200).json({message:"User status updated successfully",success:true})
    } catch (error) {
        console.error("Error while updating user status",error)
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}

const updateUserRole = async (req,res) => {
    try {
        const {sapid,role} = req.body
        const user = await User.findOne({where:{sapid}})
        if(!user){
            return res.status(404).json({message:"User not found",success:true})
        }
        user.role = role
        await user.save()
        return res.status(200).json({message:"User role updated successfully",success:false})
    }
        catch (error) {
        console.error("Error while updating user role",error)
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}

export default {getAllUsers,getAllAdvisors,getAllStudents,updateUserStatus,updateUserRole}