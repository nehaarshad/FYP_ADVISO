import express from "express";
import courseRecommendationControllers from "../controllers/courseRecommendationController.js"
const { recommendCourses, finalizeRecommendation, getAdvisoryLogs,getRecommendationById,getStudentRecommendations }=courseRecommendationControllers;

const suggestCoursesRoute = express.Router();

suggestCoursesRoute.post("/suggestCourses/:id", recommendCourses);
suggestCoursesRoute.post('/finalize', finalizeRecommendation);
suggestCoursesRoute.get('/advisor/:advisorId',getAdvisoryLogs);
suggestCoursesRoute.get('/getRecommendation/:id', getRecommendationById);
suggestCoursesRoute.get('/student/:studentId',getStudentRecommendations);
 
export default suggestCoursesRoute;
