import express from 'express';
import advisorNotesController from '../controllers/advisorNotesController.js';

const advisorNotesRoutes = express.Router();

advisorNotesRoutes.post('/createNotes', advisorNotesController.createNewNotes);
advisorNotesRoutes.put('/updateNotes/:id', advisorNotesController.updateNotes);
advisorNotesRoutes.delete('/deleteNotes/:id', advisorNotesController.DeleteNotes);
advisorNotesRoutes.get('/getNotes/:userId', advisorNotesController.getNotes);

export default advisorNotesRoutes;