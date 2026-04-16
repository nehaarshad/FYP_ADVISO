import express from "express";
import programController from "../controllers/ProgramControllers.js"
const {addProgram,getProgram}=programController;

const programRoute = express.Router();

programRoute.post("/addProgram", addProgram);
programRoute.get("/getPrograms", getProgram);


export default programRoute;
