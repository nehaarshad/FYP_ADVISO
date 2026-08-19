import DegreeGuidelinesModel from "../models/degreeGuidlinesModel.js";
import ProgramModel from "../models/programModel.js";
import { Op } from "sequelize";

// Create new degree guideline
const createGuideline = async (req, res) => {
    try {
        const { title, description, programId } = req.body;

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({success: false,message: "Title and description are required" });
        }

        // Check if program exists (if programId is provided)
        if (programId) {
            const program = await ProgramModel.findByPk(programId);
            if (!program) {
                return res.status(404).json({ success: false, message: "Program not found" });
            }
        }

        const guideline = await DegreeGuidelinesModel.create({
            title,
            description,
            programId: programId || null
        });

        return res.status(201).json({success: true,message: "Degree guideline created successfully",data: guideline });

    } catch (error) {
        console.error("Error creating guideline:", error);
        return res.status(500).json({ success: false,message: "Internal server error", error: error.message});
    }
};

// Get all degree guidelines
const getAllGuidelines = async (req, res) => {
    try {
        const { programId, search } = req.query;

        const whereClause = {};
        
        if (programId) {
            whereClause.programId = programId;
        }

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const guidelines = await DegreeGuidelinesModel.findAll({
            where: whereClause,
            include: [
                {
                    model: ProgramModel,
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({ success: true,data: guidelines });

    } catch (error) {
        console.error("Error fetching guidelines:", error);
        return res.status(500).json({success: false,message: "Internal server error",error: error.message });
    }
};


// Update degree guideline
const updateGuideline = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, programId } = req.body;

        const guideline = await DegreeGuidelinesModel.findByPk(id);

        if (!guideline) {
            return res.status(404).json({
                success: false,
                message: "Degree guideline not found"
            });
        }

        if (programId) {
            const program = await ProgramModel.findByPk(programId);
            if (!program) {
                return res.status(404).json({
                    success: false,
                    message: "Program not found"
                });
            }
        }

        await guideline.update({
            title: title || guideline.title,
            description: description || guideline.description,
            programId: programId !== undefined ? programId : guideline.programId
        });

        return res.status(200).json({
            success: true,
            message: "Degree guideline updated successfully",
            data: guideline
        });

    } catch (error) {
        console.error("Error updating guideline:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete degree guideline
const deleteGuideline = async (req, res) => {
    try {
        const { id } = req.params;

        const guideline = await DegreeGuidelinesModel.findByPk(id);

        if (!guideline) {
            return res.status(404).json({
                success: false,
                message: "Degree guideline not found"
            });
        }

        await guideline.destroy();

        return res.status(200).json({
            success: true,
            message: "Degree guideline deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting guideline:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export default {
    createGuideline,
    getAllGuidelines,
    updateGuideline,
    deleteGuideline,
};