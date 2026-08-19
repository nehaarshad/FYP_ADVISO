import BatchModel from "../models/batchModel.js";
import BatchAssignment from "../models/batchAssignmentModel.js";
import AdvisorNotes from "../models/AdvisorNotes.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import { Op } from 'sequelize';

const createNewNotes = async (req, res) => {
    try {
        const { advisorId, title, noteContent } = req.body;
        console.log({ advisorId, title, noteContent });

        const advisor = await BatchAdvisor.findByPk(advisorId);
        if (!advisor) {
            return res.status(404).json({ error: "Unauthorized Access" });
        }

        const batchAssignment = await BatchAssignment.findOne({
            where: { advisorId }
        });

        if (!batchAssignment) {
            return res.status(404).json({ error: "Batch assignment not found" });
        }

        const batchId = batchAssignment.batchId; 
        console.log({ advisorId, title, noteContent, batchId });

        const newNote = await AdvisorNotes.create({ 
            advisorId, 
            title, 
            noteContent, 
            batchId 
        });

        return res.status(201).json({ 
            success: true, 
            message: "Note created successfully", 
            data: newNote 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateNotes = async (req, res) => {
    try {
        const { id, title, noteContent, advisorId } = req.body;
        console.log({ id, advisorId, title, noteContent });

        const notes = await AdvisorNotes.findByPk(id);
        if (!notes) {
            return res.status(404).json({ error: "Notes not found" });
        }

        const batchAssignment = await BatchAssignment.findOne({
            where: { advisorId }
        });

        if (!batchAssignment) {
            return res.status(404).json({ error: "Batch assignment not found" });
        }

        const batchId = batchAssignment.batchId;
        console.log({ advisorId, title, noteContent, batchId });

        await AdvisorNotes.update(
            { advisorId, title, noteContent, batchId },
            { where: { id: id } }
        );

        return res.json({ 
            success: true, 
            message: "Updated successfully" 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const DeleteNotes = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params);

        const note = await AdvisorNotes.findByPk(id);
        if (!note) {
            return res.json({ message: "Note not found in database", success: false });
        }

        await AdvisorNotes.destroy({ 
            where: { id: id } 
        });

        return res.json({ message: "Deleted successfully", success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", success: false });
    }
};

const getNotes = async (req, res) => {
    try {
        const { advisorId, batchId } = req.body;
        console.log("getting notes:", advisorId, batchId);

        const notes = await AdvisorNotes.findAll({
            where: {
                [Op.or]: [
                    { advisorId },
                    { batchId }
                ]
            }
        });

        if (!notes || notes.length === 0) {
            return res.status(404).json({ 
                message: "No Notes Found", 
                success: false 
            });
        }

        console.log(JSON.stringify(notes));
        return res.status(200).json({ 
            data: notes, 
            success: true 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error', 
            success: false 
        });
    }
};

export default { createNewNotes, updateNotes, DeleteNotes, getNotes };