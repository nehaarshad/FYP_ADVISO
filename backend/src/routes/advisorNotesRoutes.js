import express from 'express';
import advisorNotesController from '../controllers/advisorNotesController.js';

const advisorNotesRoutes = express.Router();

advisorNotesRoutes.post('/createNotes', advisorNotesController.createNewNotes);
advisorNotesRoutes.put('/updateNotes', advisorNotesController.updateNotes);
advisorNotesRoutes.delete('/deleteNotes/:id', advisorNotesController.DeleteNotes);
advisorNotesRoutes.get('/getNotes', advisorNotesController.getNotes);

export default advisorNotesRoutes;