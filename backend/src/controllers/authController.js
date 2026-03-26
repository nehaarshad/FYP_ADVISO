import bcrypt from "bcryptjs";
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js";

const createNewUser = async (req, res) => {

    try{
        const { sapid, password, role,isActive } = req.body;

        if(!sapid||!password  ){
            return res.json({message:"All fields are required to filled!"})
        }
       else{
        const existingUser = await User.findOne({ where: { sapid } });
        if (existingUser) {
            return res.json("SAP ID Already Exist");
        }
        else{
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newuser = await User.create({ sapid, password: hashedPassword, role,isActive });
            //create profile based on role
       return res.json({ 
            id: newuser.id, 
            sapid: newuser.sapid, 
            role: newuser.role, 
            isActive: newuser.isActive,
            sessionToken: generateToken(newuser.id) 
        });
        }
       }

    }catch(error){
        console.log(error);
        return res.json({error:"Internal Server Error"})
    }

};

const forgetPassword = async (req, res) => {
    try {
        const { sapid,email ,password } = req.body;
       console.log(req.body)
        const user = await User.findOne({ where: { email, sapid } });
        if (!user) {
               console.error("Incorrect Email or SAP ID");
            return res.status(404).json({ message: "Incorrect Email or SAP ID" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update({ password: hashedPassword }, { where: { email, sapid } });
        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error in forgetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try{
    const { sapid, password } = req.body;
     console.log(req.body)
    if(!sapid ||!password ){
        return res.json("All fields are required to filled!")
    }
    else{
    const existingUser = await User.findOne({ where: { sapid } });

    if (existingUser) {

        const checkpassword=await bcrypt.compare(password, existingUser.password);

        if(!checkpassword){

            res.status(401).json( "Incorrect Password" );
        }
        else{
            const token = generateToken(existingUser.id);
            res.json({ 
                id: existingUser.id, 
                sapid: existingUser.sapid, 
                role: existingUser.role, 
                sessionToken: token
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
        res.status(401).json( "Incorrect SAP ID" );
    }
    }
   }catch(error){
    console.log(error);
    res.json({error:"Internal Server Error"})
    }
};

const logout=async(req,res)=>{
    
        try {
            const {id}= req.params;
            const token = req.header('Authorization'); 
    
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
    
            await User.update({ sessionToken: null }, { where: { id } });
            console.log('Logged out successfully');
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Server error' });
        }
    
}

export default { createNewUser, loginUser,logout ,forgetPassword };
