import express from "express";
import degreeGuidelinesRoutes from "./degreeGuidlineRoutes.js";
import supportingVideoRoutes from "./supportingVideosRoutes.js";
import roadmapRoute from "./roadmapRoute.js";
import courseDetailRoute from "./courseDetailRouter.js";
import registerUserRoute from "./registerUserRoute.js";
import courseOfferingRoute from "./courseOfferingRoute.js";
import timetableRoute from "./timetableRoute.js";
import manageUserRoute from "./manageUserRoute.js";
import authroute from "./userRoute.js";
import resultRoute from "./resultRoute.js";
import transcriptRoute from "./transcriptRoute.js";
import programRoute from "./programRoute.js";
import suggestCoursesRoute from "./suggestCoursesRoute.js";
import CourseManagementRouter from "./courseManagementRoute.js";
import chatRouter from "./chatRoute.js";
import advisorNotesRoutes from "./advisorNotesRoutes.js"
import facultyRecommendationRoute from "./facultyRecommendationRoute.js";
import batchTimetableRoutes from "./batchTimetableRoute.js";
import advisorTimetableRoutes from "./advisorTimetableRoute.js";
import batchMeetingRoutes from './batchMeetingRoute.js'
import auth from "../middleWares/authMiddleware.js";

const router = express.Router();

//router routes
router.use('/auth', authroute);
router.use('/auth',auth, roadmapRoute);
router.use('/auth',auth, courseDetailRoute);
router.use('/auth', auth, registerUserRoute);
router.use('/auth', auth, courseOfferingRoute);
router.use('/auth', auth, facultyRecommendationRoute);
router.use('/auth', auth, timetableRoute);
router.use('/auth', auth, suggestCoursesRoute);
router.use('/auth', auth, manageUserRoute);
router.use('/auth', auth, resultRoute);
router.use('/auth', auth, transcriptRoute);
router.use('/auth', auth, programRoute);
router.use('/auth', auth, CourseManagementRouter);
router.use('/auth', auth, chatRouter);
router.use('/auth', auth, advisorNotesRoutes)
router.use('/auth', auth, degreeGuidelinesRoutes);
router.use('/auth', auth, supportingVideoRoutes);
router.use('/auth', auth, batchTimetableRoutes);
router.use('/auth', auth, advisorTimetableRoutes);
router.use('/auth', auth, batchMeetingRoutes);

export default router