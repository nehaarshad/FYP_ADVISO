import express from "express";
import manageUserControllers from "../controllers/manageUserController.js"
const {getAllUsers,getAllAdvisors,getAllStudents,updateUserStatus,updateUserRole}=manageUserControllers;

const manageUserRoute = express.Router();

manageUserRoute.get("/users", getAllUsers);
manageUserRoute.get("/advisors", getAllAdvisors);
manageUserRoute.get("/students", getAllStudents);
manageUserRoute.put("/updateuserstatus", updateUserStatus);
manageUserRoute.put("/updateuserrole", updateUserRole);


export default manageUserRoute;
