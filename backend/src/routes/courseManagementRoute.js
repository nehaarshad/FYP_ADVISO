import courseManagementController from '../controllers/courseManagementController.js';
const {updateCourseCredentials} = courseManagementController;
import express from "express";
const CourseManagementRouter = express.Router();

CourseManagementRouter.put('/updateCourse/:courseId', updateCourseCredentials);
export default CourseManagementRouter;