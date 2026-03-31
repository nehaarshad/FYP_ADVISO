import express from "express";
import { uploadXlsx } from "../middleWares/uploadMiddleware.js";
import roadmapControllers from "../controllers/manageRoadmapController.js"
const {uploadNewRoadmap,getRoadmapDetails}=roadmapControllers;

const roadmapRoute = express.Router();

roadmapRoute.post("/upload", uploadXlsx.single("roadmapFile"), uploadNewRoadmap);
roadmapRoute.get("/roadmap-details/:programName", getRoadmapDetails);

export default roadmapRoute;
