import BatchTimetableModel from '../models/batchTimetable.js';
import Student from '../models/studentModel.js';
import { Op } from 'sequelize';

const addBatchTimetable = async (req, res) => {
  try {
    const { userId, timetables } = req.body;
    console.log('Request body:', { userId, timetables });

    const numericUserId = Number(userId);

    if (!numericUserId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    if (!Array.isArray(timetables) || timetables.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Timetables array is required and must not be empty',
      });
    }

    const student = await Student.findOne({ where: { userId: numericUserId } });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found for this user',
      });
    }

    const timetableData = timetables.map((entry) => ({
      batchId: student.batchId,
      userId: numericUserId,        // 👈 column renamed
      day: entry.day.trim(),
      course: entry.course.trim(),
      startTime: entry.startTime,
      endTime: entry.endTime,
    }));

    const newTimetables = await BatchTimetableModel.bulkCreate(timetableData, {
      validate: true,
      returning: true,
    });

    return res.status(201).json({
      success: true,
      message: `${newTimetables.length} timetable(s) created successfully`,
    });
  } catch (error) {
    console.error('Error in addBatchTimetable:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};

const updateBatchTimetable = async (req, res) => {
  try {
    const { userId, timetables } = req.body;
    const numericUserId = Number(userId);

    if (!numericUserId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const student = await Student.findOne({ where: { userId: numericUserId } });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const updatedTimetables = [];
    const errors = [];

    for (const entry of timetables) {
      try {
        if (!entry.id) {
          errors.push({ error: 'Timetable ID is required for updates', entry });
          continue;
        }

        const timetable = await BatchTimetableModel.findByPk(entry.id);
        if (!timetable) {
          errors.push({ error: `Timetable with ID ${entry.id} not found`, entry });
          continue;
        }

        // 🔑 Compare userId (both are User.id now)
        if (Number(timetable.userId) !== numericUserId) {
          errors.push({
            error: `You don't have permission to update timetable ${entry.id}`,
            entry,
          });
          continue;
        }

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
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error in updateBatchTimetable:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};

const deleteBatchTimetable = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const numericUserId = Number(userId);

    if (!numericUserId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const student = await Student.findOne({ where: { userId: numericUserId } });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const deletedCount = await BatchTimetableModel.destroy({
      where: { id, userId: numericUserId },   // 👈 renamed
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Timetable not found or not owned by this student',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Timetable deleted successfully',
      deletedId: Number(id),
    });
  } catch (error) {
    console.error('Error in deleteBatchTimetable:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};

const getBatchTimetable = async (req, res) => {
  try {
    const { userId } = req.params;
    const numericUserId = Number(userId);

    const student = await Student.findOne({ where: { userId: numericUserId } });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const timetables = await BatchTimetableModel.findAll({
      where: { batchId: student.batchId },
      include: [
        {
          model: Student,
          attributes: ['id', 'studentName', 'userId'],   
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: timetables,
    });
  } catch (error) {
    console.error('Error in getBatchTimetable:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};

export default {
  addBatchTimetable,
  updateBatchTimetable,
  deleteBatchTimetable,
  getBatchTimetable,
};