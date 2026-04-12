import express from "express";
import courseRecommendationControllers from "../controllers/courseRecommendationController.js"
const { recommendCourses, loginUser }=courseRecommendationControllers;

const suggestCoursesRoute = express.Router();

suggestCoursesRoute.get("/suggestCourses/:id", recommendCourses);
// suggestCoursesRoute.post("/getSuggestedCourses/:id", loginUser);

export default suggestCoursesRoute;
