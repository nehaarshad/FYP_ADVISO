import express from "express";
import { uploadXlsx } from "../middleWares/uploadMiddleware.js";
import courseDetailControllers from "../controllers/courseDetailController.js"
const {uploadCourseDetail,getCoursesDetails}=courseDetailControllers;

const courseDetailRoute = express.Router();

courseDetailRoute.post("/uploadCourseDetail", uploadXlsx.single("courseFile"), uploadCourseDetail);
courseDetailRoute.get("/getCoursesDetails", getCoursesDetails);

export default courseDetailRoute;
