import express from "express";
import { uploadXlsx } from "../middleWares/uploadMiddleware.js";
import roadmapControllers from "../controllers/manageRoadmapController.js"
const {uploadNewRoadmap,getProgramRoadmaps,getBatchRoadmap}=roadmapControllers;

const roadmapRoute = express.Router();

roadmapRoute.post("/upload", uploadXlsx.single("roadmapFile"), uploadNewRoadmap);
roadmapRoute.get("/roadmap-details/:programName", getProgramRoadmaps);
roadmapRoute.get("/batch-roadmap/:batchName/:batchYear/:programName", getBatchRoadmap);

export default roadmapRoute;
