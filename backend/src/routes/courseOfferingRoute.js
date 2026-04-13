import express from "express";
import { uploadXlsx } from "../middleWares/uploadMiddleware.js";
import courseOfferingControllers from "../controllers/courseOfferingController.js"
const {uploadCourseOffering,getCourseOfferings}=courseOfferingControllers;

const courseOfferingRoute = express.Router();

courseOfferingRoute.post("/uploadCourseOffering", uploadXlsx.single("courseOfferingFile"), uploadCourseOffering);
courseOfferingRoute.get("/getCoursesOfferings", getCourseOfferings);

export default courseOfferingRoute;
