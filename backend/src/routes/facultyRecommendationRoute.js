import express from 'express';
import FacultyRecommendationController from '../controllers/facultyRecommendationController.js';

const facultyRecommendationRoute = express.Router();

facultyRecommendationRoute.post('/createRecommendationRequest/:userId', FacultyRecommendationController.createRecommendationRequest);
facultyRecommendationRoute.post('/addCommentToRecommendation/:userId', FacultyRecommendationController.addCommentToRecommendation);
facultyRecommendationRoute.get('/getAllRecommendations', FacultyRecommendationController.getAllRecommendations);
facultyRecommendationRoute.put('/updateRecommendationStatus/:userId', FacultyRecommendationController.updateRecommendationStatus);
facultyRecommendationRoute.put('/voteComment/:commentId', FacultyRecommendationController.voteComment);
facultyRecommendationRoute.put('/acceptCommentAsSolution/:userId', FacultyRecommendationController.acceptCommentAsSolution);
facultyRecommendationRoute.delete('/deleteRecommendation/:id', FacultyRecommendationController.deleteRecommendation);
facultyRecommendationRoute.delete('/deleteRecommendationComment/:id', FacultyRecommendationController.deleteRecommendationComment);
facultyRecommendationRoute.put('/updateCommentToRecommendation', FacultyRecommendationController.updateCommentToRecommendation);
facultyRecommendationRoute.put('/updateRecommendationRequest/:id', FacultyRecommendationController.updateRecommendationRequest);

export default facultyRecommendationRoute;