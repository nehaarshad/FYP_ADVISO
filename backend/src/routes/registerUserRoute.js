import express from "express";
import registerUserControllers from "../controllers/registerUserController.js"
const {addAdvisor,addNewStudent,updateAdvisor,assignBatchToAdvisor}=registerUserControllers;

const registerUserRoute = express.Router();

registerUserRoute.post("/addadvisor", addAdvisor);
registerUserRoute.post("/addnewstudent", addNewStudent);
registerUserRoute.put("/updateadvisor/:id", updateAdvisor);
registerUserRoute.put("/assignbatchtoadvisor", assignBatchToAdvisor);

export default registerUserRoute;
