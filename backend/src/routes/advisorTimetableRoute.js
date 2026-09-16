import express from 'express';
import advisorTimetableController from '../controllers/advisorTimetableController.js';

const advisorTimetableRoutes = express.Router();

advisorTimetableRoutes.post('/addAdvisorTimetable', advisorTimetableController.addAdvisorTimetable);
advisorTimetableRoutes.put('/updateAdvisorTimetable', advisorTimetableController.updateAdvisorTimetable);
advisorTimetableRoutes.delete('/deleteAdvisorTimetable/:id/:userId', advisorTimetableController.deleteAdvisorTimetable);
advisorTimetableRoutes.get('/getAdvisorTimetable/:userId', advisorTimetableController.getAdvisorTimetable);

export default advisorTimetableRoutes;