import express from "express";
import { uploadXlsx } from "../middleWares/uploadMiddleware.js";
import resultControllers from "../controllers/resultController.js"
const {uploadSessionalResult}=resultControllers;

const resultRoute = express.Router();

resultRoute.post("/uploadSessionalResult", uploadXlsx.single("resultFile"), uploadSessionalResult);
// courseDetailRoute.get("/getCoursesDetails", getCoursesDetails);

export default resultRoute;
