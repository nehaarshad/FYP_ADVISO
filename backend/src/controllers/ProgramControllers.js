import ProgramModel from "../models/programModel.js";

const addProgram = async(req,res)=>{
try {
    const { programName, } = req.body;
        console.log("Received data for new program:", req.body);
        const [program] = await ProgramModel.findOrCreate({ where: { programName } }); //find if program exist otherwise create new program like CA
       return res.json({message:"New program successfully added",success:true})
    
} catch (error) {
    console.log(error)
    return res.json({error:"Internal Server Error"})
}
}

const getProgram = async(req,res)=>{
    try {
        const program = await ProgramModel.findAll(); 
        return res.json({data:program,success:true})
    
} catch (error) {
    console.log(error)
    return res.json({error:"Internal Server Error"})
}
}

export default {addProgram,getProgram}