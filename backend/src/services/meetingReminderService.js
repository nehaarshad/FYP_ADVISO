import nodemailer from 'nodemailer'
import cron from 'node-cron'
import { Op } from 'sequelize';
import BatchAdvisor from '../models/FacultyAdvisorModel.js';
import BatchMeeting from '../models/BatchMeetingModel.js';

// 1. Configure the Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Define the Cron Job (runs every 5 minutes)
const startReminderJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    const meetings = await BatchMeeting.findAll({
      where: { status: 'scheduled', date: { [Op.not]: null } },
    });

    for (const meeting of meetings) {
      const meetingAt = new Date(`${meeting.date}T${meeting.startTime}`);
      const minutesUntil = (meetingAt - now) / 60000;
      // Check if it's time for the 1-day or 1-hour reminder
      if ( minutesUntil > 1380 && minutesUntil <= 1500) {
        await sendEmails(meeting, 'tomorrow');
       
      }
      if (minutesUntil > 55 && minutesUntil <= 65) {
        await sendEmails(meeting, 'in 1 hour');
    
      }
    }
  });
  console.log('[ReminderJob] Started');
};

// 3. Send the Emails
const sendEmails = async (meeting, when) => {


  try {
    const info = await transporter.sendMail({
      from: `"Adviso" <51009@students.riphah.edu.pk>`,
      to: `nehaars2002@gmail.com`,
      replyTo: 'nehaars2002@gmail.com',   
      subject: `Reminder: Batch Meeting ${when}`,
      text: `Your batch meeting is scheduled for ${meeting.day} at ${meeting.startTime}.`,
    });
    console.log(`[ReminderJob] Email sent to nehaars2002@gmail.com . Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('[ReminderJob] Failed to send:', error);
  }
};

export default  startReminderJob ;