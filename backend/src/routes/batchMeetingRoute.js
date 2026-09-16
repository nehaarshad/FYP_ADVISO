import express from 'express';
import batchMeetingController from '../controllers/batchMeetingController.js';

const batchMeetingRoutes = express.Router();

batchMeetingRoutes.post('/createMeeting', batchMeetingController.createMeeting);
batchMeetingRoutes.get('/getMeetingSuggestions/:userId', batchMeetingController.getMeetingSuggestions);
batchMeetingRoutes.get('/getMeetingsForAdvisor/:userId', batchMeetingController.getMeetingsForAdvisor);
batchMeetingRoutes.put('/updateMeeting/:id', batchMeetingController.updateMeeting);

export default batchMeetingRoutes;