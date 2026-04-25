import express from "express";
import { uploadXlsx } from "../middleWares/uploadMiddleware.js";
import timetableControllers from "../controllers/timetableController.js"
const {uploadTimetable,getTimetable}=timetableControllers;

const timetableRoute = express.Router();

timetableRoute.post("/uploadTimetable", uploadXlsx.single("timetableFile"), uploadTimetable);
timetableRoute.get("/getTimetables", getTimetable);

export default timetableRoute;
