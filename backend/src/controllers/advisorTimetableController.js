import AdvisorTimetableModel from '../models/advisorTimetable.js';
import BatchAdvisor from "../models/FacultyAdvisorModel.js";
import { Op } from 'sequelize';


const addAdvisorTimetable = async (req, res) => {
    try {
        const { userId, timetables } = req.body;
        console.log('Request body:', { userId, timetables });

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

        const advisorId = advisor.id;
        console.log('Found advisorId:', advisorId);

        // Prepare timetable data for bulk creation
        const timetableData = timetables.map(entry => ({
            advisorId: advisorId,
            day: entry.day.trim(),
            course: entry.course.trim(),
            startTime: entry.startTime,
            endTime: entry.endTime,
        }));

        console.log('Creating advisor timetables with data:', timetableData);

        // Bulk create timetables
        const newTimetables = await AdvisorTimetableModel.bulkCreate(timetableData, {
            validate: true,
            returning: true
        });

        return res.status(201).json({
            success: true,
            message: `${newTimetables.length} timetable(s) created successfully`,
            data: newTimetables
        });

    } catch (error) {
        console.error('Error in addAdvisorTimetable:', error);
        return res.status(500).json({ 
            success: false, 
            error: "Internal Server Error",
            details: error.message 
        });
    }
};

const updateAdvisorTimetable = async (req, res) => {
    try {
        const { userId, timetables } = req.body;
        console.log('Update request:', { userId, timetables });

        // Find the advisor
        const advisor = await BatchAdvisor.findOne({
            where: { userId: userId }
        });

        if (!advisor) {
            return res.status(404).json({
                success: false,
                error: "Advisor not found"
            });
        }

        const updatedTimetables = [];
        const errors = [];

        // Process each timetable update
        for (const entry of timetables) {
            try {
                if (!entry.id) {
                    errors.push({ error: "Timetable ID is required for updates", entry });
                    continue;
                }

                const timetable = await AdvisorTimetableModel.findByPk(entry.id);
                
                if (!timetable) {
                    errors.push({ error: `Timetable with ID ${entry.id} not found`, entry });
                    continue;
                }

                // Check if the advisor owns this timetable entry
                if (timetable.advisorId !== advisor.id) {
                    errors.push({ error: `You don't have permission to update timetable ${entry.id}`, entry });
                    continue;
                }

                // Prepare update data
                const updateData = {};
                if (entry.day) updateData.day = entry.day.trim();
                if (entry.course) updateData.course = entry.course.trim();
                if (entry.startTime) updateData.startTime = entry.startTime;
                if (entry.endTime) updateData.endTime = entry.endTime;

                await timetable.update(updateData);
                updatedTimetables.push(timetable);
            } catch (err) {
                errors.push({ error: err.message, entry });
            }
        }

        return res.status(200).json({
            success: true,
            message: `${updatedTimetables.length} timetable(s) updated successfully`,
            data: updatedTimetables,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Error in updateAdvisorTimetable:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
};

const deleteAdvisorTimetable = async (req, res) => {
    try {
        const { id ,userId} = req.params;

        // Find the advisor
        const advisor = await BatchAdvisor.findOne({ where: { userId } });
        if (!advisor) {
            return res.status(404).json({ success: false, error: "Advisor not found" });
        }

        // Delete only if it belongs to this advisor
        const deletedCount = await AdvisorTimetableModel.destroy({
            where: { id, advisorId: advisor.id }
        });

        if (deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: "Timetable not found or not owned by this advisor"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Timetable deleted successfully",
            deletedId: Number(id)
        });

    } catch (error) {
        console.error('Error in deleteAdvisorTimetable:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
};

const getAdvisorTimetable = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Get advisor timetable for userId:', userId);

        // Find the advisor
        const advisor = await BatchAdvisor.findOne({ 
            where: { userId } 
        });

        if (!advisor) {
            return res.status(404).json({
                success: false,
                error: "Advisor not found"
            });
        }

        // Get all timetables for this advisor
        const timetables = await AdvisorTimetableModel.findAll({
            where: {
                advisorId: advisor.id
            },
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            success: true,
            data: timetables
        });

    } catch (error) {
        console.error('Error in getAdvisorTimetable:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
};

export default { addAdvisorTimetable,updateAdvisorTimetable,deleteAdvisorTimetable,getAdvisorTimetable};