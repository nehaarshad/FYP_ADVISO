import DegreeGuidelinesModel from "../models/degreeGuidlinesModel.js";
import ProgramModel from "../models/programModel.js";
import { Op } from "sequelize";

// Create new degree guideline
const createGuideline = async (req, res) => {
    try {
        const { title, description, programIds } = req.body;

        if (programIds && Array.isArray(programIds)) {
            
            //  Verify all programs exist
            const programs = await ProgramModel.findAll({
                where: { id: programIds }
            });
            
            if (programs.length !== programIds.length) {
                return res.status(404).json({
                    success: false,
                    message: "One or more programs not found"
                });
            }
        }

        const guideline = await DegreeGuidelinesModel.bulkCreate(
            programIds.map(programId => ({
            
            title,
            description,
            programId: programId 
        })));

        return res.status(201).json({
            success: true,
            message: "Degree guideline created successfully",
            data: guideline
        });

    } catch (error) {
        console.error("Error creating guideline:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
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

const updateGuideline = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, programIds } = req.body;
        
        console.log(req.body, req.params);

        // Find the existing guideline
        const guideline = await DegreeGuidelinesModel.findByPk(id);

        if (!guideline) {
            return res.status(404).json({
                success: false,
                message: "Degree guideline not found"
            });
        }

        // Get the current program IDs associated with this guideline
        const currentProgramIds = guideline.programId ? [guideline.programId] : [];
        
        // If programIds is provided and is an array
        if (programIds && Array.isArray(programIds)) {
            // Verify all programs exist
            const programs = await ProgramModel.findAll({
                where: { id: programIds }
            });

            if (programs.length !== programIds.length) {
                return res.status(404).json({
                    success: false,
                    message: "One or more programs not found"
                });
            }

            // Find new programs that are not already associated
            const newProgramIds = programIds.filter(id => !currentProgramIds.includes(id));
            
            // Find existing programs that are being removed (if any)
            const removedProgramIds = currentProgramIds.filter(id => !programIds.includes(id));

            // If there are new programs, create new guidelines for each
            if (newProgramIds.length > 0) {
                const newGuidelines = [];
                
                for (const programId of newProgramIds) {
                    // Create a new guideline for each new program
                    const newGuideline = await DegreeGuidelinesModel.create({
                        title: title || guideline.title,
                        description: description || guideline.description,
                        programId: programId,
                    });
                    newGuidelines.push(newGuideline);
                }

                // Update the original guideline with the first program ID from the list
                // or keep it as is if it's being removed
                let updatedGuideline = null;
                
                if (removedProgramIds.length === 0 && currentProgramIds.length > 0) {
                    // Keep the original guideline with the first program
                    const firstProgramId = programIds[0];
                    updatedGuideline = await guideline.update({
                        title: title || guideline.title,
                        description: description || guideline.description,
                        programId: firstProgramId
                    });
                } else if (removedProgramIds.length === 0 && currentProgramIds.length === 0) {
                    // If no current programs, use the first program from the list
                    const firstProgramId = programIds[0];
                    updatedGuideline = await guideline.update({
                        title: title || guideline.title,
                        description: description || guideline.description,
                        programId: firstProgramId
                    });
                } else if (removedProgramIds.length > 0 && programIds.length > 0) {
                    // Update the original guideline with the first program from the remaining list
                    const firstProgramId = programIds[0];
                    updatedGuideline = await guideline.update({
                        title: title || guideline.title,
                        description: description || guideline.description,
                        programId: firstProgramId
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: `Guideline updated and ${newGuidelines.length} new guidelines created for additional programs`,
                    data: {
                        originalGuideline: updatedGuideline || guideline,
                        newGuidelines: newGuidelines,
                        totalGuidelines: [updatedGuideline || guideline, ...newGuidelines].filter(Boolean)
                    }
                });
            }

            // If no new programs, just update the existing guideline
            // Determine which program to keep (first one in the list)
            const firstProgramId = programIds.length > 0 ? programIds[0] : null;
            
            const updatedGuideline = await guideline.update({
                title: title || guideline.title,
                description: description || guideline.description,
                programId: firstProgramId
            });

            return res.status(200).json({
                success: true,
                message: "Degree guideline updated successfully",
                data: updatedGuideline
            });
        }

        // If programIds is not provided or not an array, just update title and description
        const updatedGuideline = await guideline.update({
            title: title || guideline.title,
            description: description || guideline.description,
        });

        return res.status(200).json({
            success: true,
            message: "Degree guideline updated successfully",
            data: updatedGuideline
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