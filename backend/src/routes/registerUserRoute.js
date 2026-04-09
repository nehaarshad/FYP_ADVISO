import express from "express";
import registerUserControllers from "../controllers/registerUserController.js"
const {addAdvisor,addNewStudent,updateAdvisor,updateStudent,updateStudentStatus,addViaExcelSheet}=registerUserControllers;

const registerUserRoute = express.Router();

registerUserRoute.post("/addadvisor", addAdvisor);
registerUserRoute.post("/addnewstudent", addNewStudent);
registerUserRoute.put("/updateadvisor/:id", updateAdvisor);
registerUserRoute.put("/updatestudent/:id", updateStudent);
registerUserRoute.put("/updatestudentstatus", updateStudentStatus);
registerUserRoute.post("/addviaexcelsheet", addViaExcelSheet);


export default registerUserRoute;
