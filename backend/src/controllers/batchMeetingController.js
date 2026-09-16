import AdvisorTimetableModel from '../models/advisorTimetable.js';
import BatchTimetableModel from '../models/batchTimetable.js';
import BatchAdvisor from '../models/FacultyAdvisorModel.js';
import BatchAssignment from '../models/batchAssignmentModel.js';
import BatchMeeting from '../models/BatchMeetingModel.js';
import { findFreeSlots } from '../utils/meetingFinder.js';


const getMeetingSuggestions = async (req, res) => {
  try {

    const { userId } = req.params;
    const id= parseInt(userId)
    console.log("user id in getting meeting suggestions: ", id, typeof id)
    const advisor = await BatchAdvisor.findOne({ where: { userId:id } });

    if (!advisor) {
      return res.status(404).json({ success: false, error: 'Advisor not found' });
    }

    const assignment = await BatchAssignment.findOne({
      where: { advisorId: advisor.id, isCurrentlyAdvised: true },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'No active batch assignment for this advisor',
      });
    }

    const [advisorTimetables, batchTimetables] = await Promise.all([
      AdvisorTimetableModel.findAll({ where: { advisorId: advisor.id } }),
      BatchTimetableModel.findAll({ where: { batchId: assignment.batchId } }),
    ]);

    const suggestions = findFreeSlots(advisorTimetables, batchTimetables);

    console.log("suggested batch meeting schedule: ", JSON.stringify(suggestions))
    return res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('getMeetingSuggestions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};


const createMeeting = async (req, res) => {
  try {
    const { userId, day, startTime, endTime } = req.body;

    const advisor = await BatchAdvisor.findOne({ where: { userId } });
    if (!advisor) {
      return res.status(404).json({ success: false, error: 'Advisor not found' });
    }

    const assignment = await BatchAssignment.findOne({
      where: { advisorId: advisor.id, isCurrentlyAdvised: true },
    });
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'No active batch assignment',
      });
    }

    // Re-verify the suggested slot is actually free right now  (in case timetable change)
    const [advisorTimetables, batchTimetables] = await Promise.all([
      AdvisorTimetableModel.findAll({ where: { advisorId: advisor.id } }),
      BatchTimetableModel.findAll({ where: { batchId: assignment.batchId } }),
    ]);
    const stillFree = findFreeSlots(advisorTimetables, batchTimetables).some(
      (s) =>
        s.day === day &&
        s.startTime === startTime &&
        s.endTime === endTime
    );
    if (!stillFree) {
      return res.status(409).json({
        success: false,
        error: 'The selected slot is no longer free',
      });
    }

    const meeting = await BatchMeeting.create({
      advisorId: advisor.id,
      batchId: assignment.batchId,
      day,
      startTime,
      endTime,
      status: 'pending',
      date: null,
    });

    return res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    console.error('createMeeting error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, date, status, meetingSummary } = req.body;

    const advisor = await BatchAdvisor.findOne({ where: { userId } });
    if (!advisor) {
      return res.status(404).json({ success: false, error: 'Advisor not found' });
    }

    const meeting = await BatchMeeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found' });
    }

    if (meeting.advisorId !== advisor.id) {
      return res.status(403).json({
        success: false,
        error: 'You cannot modify meetings you did not create',
      });
    }

    //  reject attempts to change system-generated fields
    const forbidden = ['day', 'startTime', 'endTime', 'batchId', 'advisorId'];
    const attempted = forbidden.filter((f) => f in req.body);
    if (attempted.length) {
      return res.status(400).json({
        success: false,
        error: `Cannot modify system-generated fields: ${attempted.join(', ')}`,
      });
    }

    const validStatuses = ['pending', 'scheduled', 'cancelled', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const updates = {};
    if (date !== undefined) updates.date = date;
    if (status !== undefined) updates.status = status;
    if (meetingSummary !== undefined) updates.meetingSummary = meetingSummary;

    //  if a date is set and status wasn't touched, move to 'scheduled'
    if (date && status === undefined && meeting.status === 'pending') {
      updates.status = 'scheduled';
    }

    await meeting.update(updates);

    return res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    console.error('updateMeeting error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};


const getMeetingsForAdvisor = async (req, res) => {
  try {
    const { userId } = req.params;

    const advisor = await BatchAdvisor.findOne({ where: { userId } });
    if (!advisor) {
      return res.status(404).json({ success: false, error: 'Advisor not found' });
    }

    const meetings = await BatchMeeting.findAll({
      where: { advisorId: advisor.id },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    console.error('getMeetingsForAdvisor error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
};

export default {getMeetingSuggestions,createMeeting,updateMeeting,getMeetingsForAdvisor};