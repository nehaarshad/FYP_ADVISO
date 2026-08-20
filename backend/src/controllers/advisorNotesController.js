import BatchModel from "../models/batchModel.js";
import BatchAssignment from "../models/batchAssignmentModel.js";
import AdvisorNotes from "../models/AdvisorNotes.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import { Op } from 'sequelize';

const createNewNotes = async (req, res) => {
    try {
        const { userId, title, noteContent } = req.body;
        console.log('Request body:', { userId, title, noteContent });

        // Validate required fields
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                error: "User ID is required" 
            });
        }

        if (!title || !title.trim()) {
            return res.status(400).json({ 
                success: false, 
                error: "Title is required" 
            });
        }

        if (!noteContent || !noteContent.trim()) {
            return res.status(400).json({ 
                success: false, 
                error: "Note content is required" 
            });
        }

        // Find the advisor by userId
        const advisor = await BatchAdvisor.findOne({ 
            where: { userId } 
        });
        
        if (!advisor) {
            return res.status(404).json({ 
                success: false, 
                error: "Advisor not found for this user" 
            });
        }

        // Get the advisorId from the advisor record
        const advisorId = advisor.id;
        console.log('Found advisorId:', advisorId);

        // Find the batch assignment for this advisor
        const batchAssignment = await BatchAssignment.findOne({
            where: { advisorId: advisorId }
        });

        let batchId = null;
        let newNote = {};

        if (batchAssignment) {
            // If advisor has a batch assignment, use that batchId
            batchId = batchAssignment.batchId;
            console.log('Found batchId from assignment:', batchId);
        } else {
            // If no batch assignment, create note without batchId
            console.log('No batch assignment found, creating note without batchId');
        }

        // Create the note
        const noteData = {
            advisorId: advisorId,
            title: title.trim(),
            noteContent: noteContent.trim(),
        };

        // Only add batchId if it exists
        if (batchId) {
            noteData.batchId = batchId;
        }

        console.log('Creating note with data:', noteData);

        newNote = await AdvisorNotes.create(noteData);

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: newNote
        });

    } catch (error) {
        console.error('Error in createNewNotes:', error);
        return res.status(500).json({ 
            success: false, 
            error: "Internal Server Error",
            details: error.message 
        });
    }
};

const updateNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, noteContent, userId } = req.body;
        console.log('Update request:', { id, title, noteContent, userId });

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Note ID is required"
            });
        }

        // Find the note
        const note = await AdvisorNotes.findByPk(id);
        if (!note) {
            return res.status(404).json({
                success: false,
                error: "Note not found"
            });
        }

        if (userId) {
            const advisor = await BatchAdvisor.findOne({
                where: { userId: userId }
            });
        }

        // Update the note
        const updatedData = {};
        if (title) updatedData.title = title.trim();
        if (noteContent) updatedData.noteContent = noteContent.trim();

        await note.update(updatedData);

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note
        });

    } catch (error) {
        console.error('Error in updateNote:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
};

const DeleteNotes = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Delete request for note ID:', id);

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Note ID is required"
            });
        }

        // Find the note
        const note = await AdvisorNotes.findByPk(id);
        if (!note) {
            return res.status(404).json({
                success: false,
                error: "Note not found"
            });
        }

        // Delete the note
        await note.destroy();

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {
        console.error('Error in deleteNote:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
};
const getNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(req.params)
        const advisor = await BatchAdvisor.findOne({where:{userId}})
        let notes =[];
           if(advisor){
             // Get current batch assignments
            const batches = await BatchAssignment.findAll({
                where: { 
                    advisorId:advisor.id, 
                    isCurrentlyAdvised: true 
                }
            });
            
            if (batches && batches.length > 0) {
                const batchIds = batches.map(b => b.batchId);
                notes = await AdvisorNotes.findAll({
                    where: {
                        [Op.or]: [
                            { advisorId:advisor.id,  },
                            { batchId: { [Op.in]: batchIds } }
                        ]
                    }
                });
            } else {
                notes = await AdvisorNotes.findAll({
                    where: { advisorId:advisor.id,  }
                });
            }

        return res.status(200).json({ 
            data: notes, 
            success: true 
        });
           }
           else{
            return res.status(404).json({ 
             message: "No Advisor Found", 
            success: false 
        });
           }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error', 
            success: false 
        });
    }
};

export default { createNewNotes, updateNotes, DeleteNotes, getNotes };