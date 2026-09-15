import express from 'express';
import batchTimetableController from '../controllers/batchTimetableController.js';

const batchTimetableRoutes = express.Router();

batchTimetableRoutes.post('/addBatchTimetable', batchTimetableController.addBatchTimetable);
batchTimetableRoutes.put('/updateBatchTimetable', batchTimetableController.updateBatchTimetable);
batchTimetableRoutes.delete('/deleteBatchTimetable/:id/:userId', batchTimetableController.deleteBatchTimetable);
batchTimetableRoutes.get('/getBatchTimetable/:userId', batchTimetableController.getBatchTimetable);

export default batchTimetableRoutes;