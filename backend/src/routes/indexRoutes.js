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

const router = express.Router();

//router routes
router.use('/auth', authroute);
router.use('/auth', roadmapRoute);
router.use('/auth', courseDetailRoute);
router.use('/auth', registerUserRoute);
router.use('/auth', courseOfferingRoute);
router.use('/auth', timetableRoute);
router.use('/auth', suggestCoursesRoute);
router.use('/auth', manageUserRoute);
router.use('/auth', resultRoute);
router.use('/auth', transcriptRoute);
router.use('/auth', programRoute);
router.use('/auth', CourseManagementRouter);
router.use('/auth', chatRouter);
router.use('/auth', advisorNotesRoutes)
router.use('/auth', degreeGuidelinesRoutes);
router.use('/auth', supportingVideoRoutes)

export default router