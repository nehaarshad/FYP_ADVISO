import express from "express";
import transcriptControllers from "../controllers/transcriptManagementController.js"
const {getStudentTranscriptSummary}=transcriptControllers;

const resultRoute = express.Router();

resultRoute.get("/getStudentTranscriptSummary/:id", getStudentTranscriptSummary);
// courseDetailRoute.get("/getCoursesDetails", getCoursesDetails);

export default resultRoute;