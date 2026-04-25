import bcrypt from "bcryptjs";
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js";
import Coordinator from "../models/coordinatorModel.js";
import Admin from "../models/adminModel.js";

//Sigup functionality for admin and coordinator
const createNewUser = async (req, res) => {

    try{
        const { sapid, password, role, name,email,department,contactNumber} = req.body;

        if(!sapid||!password  ){
            return res.status(400).json({message:"All fields are required to filled!",success:false})
        }
       else{
        const existingUser = await User.findOne({ where: { sapid } });
        if (existingUser) {
            return res.status(400).json({message:"SAP ID Already Exist",success:false});
        }
        else{
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newuser = await User.create({ sapid, password: hashedPassword, role });
            
        //create profile of coordinator & admin

        let newUserInfo;
        if(role=="coordinator")
        {
            newUserInfo = await Coordinator.create({coordinatorName:name,email,contactNumber,userId:newuser.id,department})
        }
        else if(role=="admin")
        {
            newUserInfo = await Admin.create({name,email,contactNumber,userId:newuser.id,department})
        }

        console.log("New ",role," is added", newuser, newUserInfo)

       return res.status(201).json({ 
           success:true,
           message: role.charAt(0).toUpperCase() + role.slice(1) + " created successfully",
           data:{
            id: newuser.id, 
            sapid: newuser.sapid, 
            role: newuser.role, 
            isActive: newuser.isActive,
            sessionToken: generateToken(newuser.id) 
           }
        });
        }
       }

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Internal Server Error"})
    }

};

const forgetPassword = async (req, res) => {
    try {
        const { sapid,password } = req.body;
       console.log(req.body)
        const user = await User.findOne({ where: { sapid } });
        if (!user) {
               console.error("Incorrect SAP ID");
            return res.status(404).json({ message: "Incorrect SAP ID",success:false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update({ password: hashedPassword }, { where: { sapid } });
        res.status(200).json({ message: "Password updated successfully",success:true });

    } catch (error) {
        console.error("Error in forgetPassword:", error);
        res.status(500).json({ error: "Internal server error",success:false });
    }
};

const loginUser = async (req, res) => {
    try{
    const { sapid, password } = req.body;
     console.log(req.body)
    if(!sapid ||!password ){
        return res.status(400).json({message:"All fields are required to filled!",success:false})
    }
    else{
    const existingUser = await User.findOne({ where: { sapid } });

    if (existingUser) {

        const checkpassword=await bcrypt.compare(password, existingUser.password);

        if(!checkpassword){

            res.status(401).json( {message: "Incorrect Password",success:false} );
        }
        else{
            const token = generateToken(existingUser.id);
            res.status(200).json({ 
                message: "Login successful",
                success:true,
                data:{
                    
                id: existingUser.id, 
                sapid: existingUser.sapid, 
                role: existingUser.role, 
                sessionToken: token
                }
            });
            console.log({
                id: existingUser.id, 
                sapid: existingUser.sapid, 
                role: existingUser.role,
                contactnumber:existingUser.contactnumber, 
                role: existingUser.role, 
                sessionToken: token
            })
        }
       
    } 
    else {
        res.status(401).json( {message: "Incorrect SAP ID",success:false} );
    }
    }
   }catch(error){
    console.log(error);
    res.status(500).json({error:"Internal Server Error",success:false})
    }
};

const logout=async(req,res)=>{
    
        try {
            const {id}= req.params;
    
            await User.update({ sessionToken: null }, { where: { id } });
            console.log('Logged out successfully');
            return res.status(200).json({ message: 'Logged out successfully',success:true });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Server error',success:false });
        }
    
}

export default { createNewUser, loginUser,logout ,forgetPassword };
