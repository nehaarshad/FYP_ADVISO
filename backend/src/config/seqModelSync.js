import sequelize from "../config/dbConfig.js";
import User from "../models/userModel.js";

const models={
    User,
}

const modelsSync=async()=>{
    try{

        await sequelize.sync({ force: false}).then(() => {   
            console.log("All models are synchronized successfully");
        }).catch((err) => {
            console.log("all models are not synchronized successfully",err)
         });
        }
    catch(err){
        console.log("Failed to synchronized Models",err)
    }
}

export default {models,modelsSync}
