import { Op } from 'sequelize';
import Chat from '../models/ChatsModel.js';
import Message from '../models/messagesModel.js';
import User from '../models/userModel.js';
import Student from '../models/studentModel.js';
import BatchAdvisor from '../models/FacultyAdvisorModel.js';
import BatchAssignment from '../models/BatchAssignmentModel.js';

const chatService = (io) => {
  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user socket for notifications
    socket.on('registerUser', (userId) => {
      const key = userId.toString();

      if (!userSockets.has(key)) {
        userSockets.set(key, new Set());
      }

      userSockets.get(key).add(socket.id);
      socket.data.userId = Number(userId);

      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Get all chats based on user role
    socket.on('getAdvisorChats', async (userId) => {
      try {
        const user = await User.findByPk(userId, {
          include: [
            { model: Student,  },
            { model: BatchAdvisor,  }
          ]
        });

        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        let chats = [];

  const advisorDetails = await BatchAdvisor.findOne({
    where: { userId: userId }
  });

  if (!advisorDetails) {
    socket.emit('error', { message: 'Advisor details not found' });
    return;
  }

  const currentAssignments = await BatchAssignment.findAll({
    where: {
      advisorId: advisorDetails.id,
      isCurrentlyAdvised: true  // Only active batches
    }
  });

  if (!currentAssignments || currentAssignments.length === 0) {
    socket.emit('chatsList', []);
    console.log(`No active batches for advisor ${userId}`);
    return;
  }

  const batchIds = currentAssignments.map(assignment => assignment.batchId);
  
  // Get ALL students in these active batches
  const students = await Student.findAll({
    where: {
      batchId: {
        [Op.in]: batchIds
      }
    },
    include: [
      {
        model: User,
        attributes: ['id', 'role']
      }
    ]
  });

  if (students.length === 0) {
    socket.emit('chatsList', []);
    console.log(`No students in active batches for advisor ${userId}`);
    return;
  }

  const studentIds = students.map(s => s.userId);
  const allChats = await Chat.findAll({
    where: {
      batchId: {
        [Op.in]: batchIds
      },
      [Op.or]: [
        {
          senderId: userId,
          receiverId: {
            [Op.in]: studentIds
          }
        },
        {
          senderId: {
            [Op.in]: studentIds
          },
          receiverId: userId
        }
      ]
    },
    include: [
      {
        model: User,
        as: 'sender',
        include: [
          {
            model: Student,
            attributes: ['studentName', 'registrationNumber', 'batchId']
          }
        ]
      },
      {
        model: User,
        as: 'receiver',
        include: [
          {
            model: Student,
            attributes: ['studentName', 'registrationNumber', 'batchId']
          }
        ]
      }
    ],
    order: [['updatedAt', 'DESC']]
  });

  const advisorChats = [];

  // Process each student in the active batches
  for (const student of students) {
    // Find chat with this student (could be from previous advisors)
    const chat = allChats.find(c => 
      (Number(c.senderId) === student.userId && Number(c.receiverId) === userId) ||
      (Number(c.senderId) === userId && Number(c.receiverId) === student.userId)
    );

    let latestMessage = null;
    let unreadCount = 0;

    if (chat) {
      // Get latest message
      latestMessage = await Message.findOne({
        where: { chatId: chat.id },
        order: [['createdAt', 'DESC']]
      });

      // Count unread messages for advisor
      unreadCount = await Message.count({
        where: {
          chatId: chat.id,
          receiverId: userId,  // Messages sent to advisor
          isRead: false
        }
      });

      socket.join(`chat_${chat.id}`);
    }
    advisorChats.push({
      id: student.userId,
      name: student.studentName || `Student ${student.id}`,
      chatId: chat?.id || null,  // null if no conversation yet
      studentId: student.id,
      registrationNumber: student.registrationNumber,
      batchId: student.batchId,
      semester: student.currentSemester,
      isCurrentStudent: true,  // All students in active batches are current
      lastMessageAt: chat?.lastMessageAt || null,
      lastMessageText: latestMessage?.text || 'No messages yet',
      lastMessageSender: latestMessage?.senderId === userId ? 'You' : 'Student',
      unreadCount,
      canSendMessages: true,
      isReadOnly: false
    });
  }

  // Sort by latest message (students with recent activity first)
  advisorChats.sort((a, b) => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0;
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
  });

  chats = advisorChats;
  console.log(`Advisor ${userId} has ${JSON.stringify(chats.length)} student conversations`);


console.log(`User ${userId} has ${JSON.stringify(chats.length)} chats: ${JSON.stringify(chats)}`);
        socket.emit('chatsList', chats);
        console.log(`Sent ${JSON.stringify(chats.length)} chats to user ${userId}`);

      } catch (error) {
        console.error('Error fetching user chats:', error);
        socket.emit('error', { message: 'Error fetching chats' });
      }
    });
        socket.on('getStudentChats', async (userId) => {
      try {
        const user = await User.findByPk(userId, {
          include: [
            { model: Student, },
            { model: BatchAdvisor,  }
          ]
        });

        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        let chats = {};
  const studentId = Number(socket.data.userId);

  if (!studentId) {
    socket.emit('error', {
      message: 'User is not registered on this socket'
    });
    return;
  }
  const student = await Student.findOne({
    where: {
      userId: studentId
    }
  });

  if (!student) {
    socket.emit('error', {
      message: 'Student details not found'
    });
    return;
  }

  const currentAssignment = await BatchAssignment.findOne({
    where: {
      batchId: student.batchId,
      isCurrentlyAdvised: true
    },
    order: [
      ['updatedAt', 'DESC']
    ]
  });

  let currentAdvisor = null;

  if (currentAssignment) {

    const advisorProfile = await BatchAdvisor.findByPk(
      currentAssignment.advisorId
    );

    if (advisorProfile) {

      currentAdvisor = {
        advisorId: advisorProfile.id,
        userId: Number(advisorProfile.userId),
        advisorName: advisorProfile.advisorName
      };
    }
  }

  const studentChatsFromDb = await Chat.findAll({
    where: {
      [Op.or]: [
        {
          senderId: studentId
        },
        {
          receiverId: studentId
        }
      ]
    },

    include: [
      {
        model: User,
        as: 'sender',
        attributes: [
          'id',
          'role'
        ],

        include: [
          {
            model: BatchAdvisor,
            attributes: [
              'id',
              'advisorName'
            ]
          },

          {
            model: Student,
            attributes: [
              'id',
              'studentName'
            ]
          }
        ]
      },

      {
        model: User,
        as: 'receiver',
        attributes: [
          'id',
          'role'
        ],

        include: [
          {
            model: BatchAdvisor,
            attributes: [
              'id',
              'advisorName'
            ]
          },

          {
            model: Student,
            attributes: [
              'id',
              'studentName'
            ]
          }
        ]
      }
    ],

    order: [
      ['updatedAt', 'ASC']
    ]
  });

  if (studentChatsFromDb.length === 0) {

    chats = {};

    socket.emit('studentChatRoom', {
      student: {
        userId: studentId,
        studentId: student.id,
        studentName: student.studentName
      },

      currentAdvisor,

      canSendMessages: currentAdvisor !== null,

      messages: []
    });

    console.log(
      `Student ${studentId} has no existing chats`
    );
  
    socket.emit('studentChatList', chats);
    return;
  }

  const chatIds = studentChatsFromDb.map(
    chat => chat.id
  );
  for (const chat of studentChatsFromDb) {
    socket.join(`chat_${chat.id}`);
  }

  const allMessages = await Message.findAll({

    where: {
      chatId: {
        [Op.in]: chatIds
      }
    },

    include: [
      {
        model: User,
        as: 'sender',

        attributes: [
          'id',
          'role'
        ],

        include: [

          // Student sender
          {
            model: Student,

            attributes: [
              'id',
              'studentName'
            ]
          },

          // Advisor sender
          {
            model: BatchAdvisor,

            attributes: [
              'id',
              'advisorName'
            ]
          }
        ]
      }
    ],

    order: [
      ['createdAt', 'ASC']
    ]
  });

  console.log(
    `Student ${studentId} has ${allMessages.length} messages across ${chatIds.length} chats \n ${JSON.stringify(allMessages)}`
  );
  const studentMessages = allMessages.map(message => {

    const sender = message.sender;

    let senderName = 'Unknown User';

    let senderRole = sender?.role || null;

    // Student sent this message
    if (sender?.role === 'student') {

      senderName =
        sender.Students?.[0]?.studentName ||
        'Student';
    }

    // Advisor sent this message
    else if (sender?.role === 'advisor') {

      senderName =
        sender.BatchAdvisors?.[0]?.advisorName ||
        'Academic Advisor';
    }

    return {

      id: message.id,
      chatId: message.chatId,

      senderId: Number(message.senderId),

      receiverId: Number(message.receiverId),

      senderName,

      senderRole,

      text: message.text || null,

      fileAttachment:
        message.fileAttachment || null,

      createdAt: message.createdAt,

      isRead: message.isRead
    };
  });

  studentMessages.sort((a, b) => {

    return (
      new Date(a.createdAt) -
      new Date(b.createdAt)
    );
  });

  const studentChatRoom = {

    student: {
      userId: studentId,

      studentId: student.id,

      studentName:
        student.studentName || 'Student'
    },

    currentAdvisor,

    canSendMessages:
      currentAdvisor !== null,

    totalMessages:
      studentMessages.length,

    messages:
      studentMessages
  };

  chats = studentChatRoom;

  console.log(
    `Student ${studentId} chat room:`,
    JSON.stringify(studentChatRoom, null, 2)
  );


console.log(`User ${userId} has ${JSON.stringify(Object.keys(chats).length)} chats: ${JSON.stringify(chats)}`);
        socket.emit('studentChatList', chats);
      
      } catch (error) {
        console.error('Error fetching user chats:', error);
        socket.emit('error', { message: 'Error fetching chats' });
      }
    });


    // Get messages for a specific chat
socket.on('getChatMessages', async (data) => {
  try {
    const { studentId } = data;
    const advisorId = Number(socket.data.userId);
 console.log(`event triggered: ${studentId} bid ${advisorId}`)
    if (!advisorId) {
      socket.emit('error', {
        message: 'User is not registered on this socket'
      });
      return;
    }

    if (!studentId) {
      socket.emit('error', {
        message: 'studentId is required'
      });
      return;
    }

    //  Verify advisor is assigned to this student's batch
    const student = await Student.findByPk(studentId
    );

    if (!student) {
      socket.emit('error', {
        message: 'Student not found'
      });
      return;
    }

    const advisor = await BatchAdvisor.findOne({
      where: { userId: advisorId }
    });

    if (!advisor) {
      socket.emit('error', {
        message: 'Advisor not found'
      });
      return;
    }

    //  Check if advisor is assigned to this student's batch
    const assignment = await BatchAssignment.findOne({
      where: {
        advisorId: advisor.id,
        batchId: student.batchId,
        isCurrentlyAdvised: true
      }
    });

    if (!assignment) {
      socket.emit('error', {
        code: 'STUDENT_NOT_IN_BATCH',
        message: 'You are not currently assigned to this student\'s batch'
      });
      return;
    }

    console.log("Ids: ",student.userId,advisorId)
    //  Find ALL chats where this student is a participant
    const allChats = await Chat.findAll({
      where: {
        batchId: student.batchId,
        [Op.or]: [
          { senderId: student.userId },
          { receiverId: student.userId }
        ]
      },
      order: [['updatedAt', 'ASC']]
    });

    if (!allChats || allChats.length === 0) {
      socket.emit('chatMessages', {
        chatId: null,
        messages: [],
        total: 0,
        chatInfo: {
          studentId: studentId,
          advisorId: advisorId,
          isStudent: false,
          hasChats: false
        }
      });
      return;
    }

    const chatIds = allChats.map(chat => chat.id);

    // Get ALL messages from ALL chats where student is participant
    const allMessages = await Message.findAll({
      where: {
        chatId: {
          [Op.in]: chatIds
        }
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'role'],
          include: [
            {
              model: Student,
              attributes: ['studentName']
            },
            {
              model: BatchAdvisor,
              attributes: ['advisorName']
            }
          ]
        }
      ],
      order: [['createdAt', 'ASC']]  // All messages in chronological order
    });

    //  Join all chat rooms
    for (const chat of allChats) {
      socket.join(`chat_${chat.id}`);
    }

    //  Mark messages as read for advisor
    await Message.update(
      { isRead: true },
      {
        where: {
          chatId: {
            [Op.in]: chatIds
          },
          receiverId: advisorId,
          isRead: false
        }
      }
    );

    socket.emit('chatMessages', {
      chatId: allChats[0]?.id || null,  
      messages: allMessages, 
      total: allMessages.length,
      chatInfo: {
        studentId: studentId,
        advisorId: advisorId,
        isStudent: false,
        chatIds: chatIds,  
        hasChats: true
      }
    });

 
  } catch (error) {
    console.error('Error fetching student all messages:', error);
    socket.emit('error', {
      message: 'Error fetching messages'
    });
  }
});

    // Send a new message
socket.on('sendMessage', async (data) => {
  try {
    const {
      receiverId,
      text,
      fileAttachment
    } = data;

    const senderId = Number(socket.data.userId);

    if (!senderId) {
      socket.emit('error', {
        message: 'User is not registered on this socket'
      });
      return;
    }

    if (!receiverId) {
      socket.emit('error', {
        message: 'receiverId is required'
      });
      return;
    }

    const numericReceiverId = Number(receiverId);

    if (!numericReceiverId) {
      socket.emit('error', {
        message: 'Invalid receiverId'
      });
      return;
    }

    const sender = await User.findByPk(senderId);

    if (!sender) {
      socket.emit('error', {
        message: 'Sender not found'
      });
      return;
    }

    // ==========================================
    // STUDENT PERSPECTIVE
    // ==========================================
    if (sender.role === 'student') {

      // Get student details
      const student = await Student.findOne({
        where: {
          userId: senderId
        }
      });

      if (!student) {
        socket.emit('error', {
          message: 'Student details not found'
        });
        return;
      }

      //  Get current advisor for the student
      const currentAssignment = await BatchAssignment.findOne({
        where: {
          batchId: student.batchId,
          isCurrentlyAdvised: true
        },
        order: [['updatedAt', 'DESC']]
      });

      if (!currentAssignment) {
        socket.emit('error', {
          message: 'No current advisor is assigned to your batch'
        });
        return;
      }

      const currentAdvisor = await BatchAdvisor.findByPk(
        currentAssignment.advisorId
      );

      if (!currentAdvisor) {
        socket.emit('error', {
          message: 'Current advisor profile not found'
        });
        return;
      }

      const currentAdvisorUserId = Number(currentAdvisor.userId);


      //  FIND OR CREATE CHAT (no chatId from frontend)
      let chat = await Chat.findOne({
        where: {
          batchId: student.batchId,
          [Op.or]: [
            { senderId: senderId, receiverId: currentAdvisorUserId },
            { senderId: currentAdvisorUserId, receiverId: senderId }
          ]
        }
      });

      if (chat) {
        console.log(` Using existing chat ${chat.id} between student ${senderId} and advisor ${currentAdvisorUserId}`);
      } else {
        chat = await Chat.create({
          senderId,
          receiverId: currentAdvisorUserId,
          batchId: student.batchId,
          lastMessageAt: null,
          lastMessageText: null
        });
        console.log(`Created new chat ${chat.id}: student ${senderId} → advisor ${currentAdvisorUserId}`);
      }

      // Create message (student → advisor)
      const hasText = typeof text === 'string' && text.trim().length > 0;
      const hasAttachment = fileAttachment !== null && fileAttachment !== undefined;

      if (!hasText && !hasAttachment) {
        socket.emit('error', {
          message: 'Message text or file attachment is required'
        });
        // If we just created a new chat with no message, delete it
        if (chat && !chat.lastMessageAt) {
          await chat.destroy();
        }
        return;
      }

      let message = await Message.create({
        chatId: chat.id,
        senderId,
        receiverId: currentAdvisorUserId,
        text: hasText ? text.trim() : null,
        fileAttachment: hasAttachment ? fileAttachment : null,
        isRead: false
      });

      await chat.update({
        lastMessageAt: message.createdAt,
        lastMessageText: message.text || 'File attachment...'
      });
        message =  await Message.findOne({
      where: {
        id:message.id
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'role'],
          include: [
            {
              model: Student,
              attributes: ['studentName']
            },
            {
              model: BatchAdvisor,
              attributes: ['advisorName']
            }
          ]
        }
      ],
      order: [['createdAt', 'ASC']]  // All messages in chronological order
    });

      socket.join(`chat_${chat.id}`);

      // Emit to chat room
      io.to(`chat_${chat.id}`).emit('newMessage', {
        chatId: chat.id,
        message
      });

      // Notify advisor
      const advisorSockets = userSockets.get(currentAdvisorUserId.toString());
      if (advisorSockets) {
        for (const advisorSocketId of advisorSockets) {
          io.to(advisorSocketId).emit('chatNotification', {
            chatId: chat.id,
            message
          });
        }
      }

      socket.emit('messageSent', {
        chatId: chat.id,
        message
      });

      console.log(
        `Student ${senderId} → Advisor ${currentAdvisorUserId}: Message ${message.id} sent in chat ${chat.id}`
      );

      return;
    }

    // ==========================================
    // ADVISOR PERSPECTIVE
    // ==========================================
    if (sender.role === 'advisor') {

      // Get advisor details
      const advisor = await BatchAdvisor.findOne({
        where: {
          userId: senderId
        }
      });

      if (!advisor) {
        socket.emit('error', {
          message: 'Advisor details not found'
        });
        return;
      }

      // Get receiver (student)
      const receiver = await User.findByPk(numericReceiverId);

      if (!receiver) {
        socket.emit('error', {
          message: 'Receiver not found'
        });
        return;
      }

      if (receiver.role !== 'student') {
        socket.emit('error', {
          message: 'Advisors can only message a student'
        });
        return;
      }

      // Get student details
      const student = await Student.findOne({
        where: {
          userId: numericReceiverId
        }
      });

      if (!student) {
        socket.emit('error', {
          message: 'Student details not found'
        });
        return;
      }

      // Check if this advisor is currently assigned to this student's batch
      const assignment = await BatchAssignment.findOne({
        where: {
          advisorId: advisor.id,
          batchId: student.batchId,
          isCurrentlyAdvised: true
        }
      });

      if (!assignment) {
        socket.emit('error', {
          code: 'STUDENT_NOT_IN_BATCH',
          message: 'You are not currently assigned to this student\'s batch'
        });
        return;
      }

      const studentUserId = Number(student.userId);

      // FIND OR CREATE CHAT (no chatId from frontend)
      let chat = await Chat.findOne({
        where: {
          batchId: student.batchId,
          [Op.or]: [
            { senderId: senderId, receiverId: studentUserId },
            { senderId: studentUserId, receiverId: senderId }
          ]
        }
      });

      if (chat) {
        console.log(` Using existing chat ${chat.id} between advisor ${senderId} and student ${studentUserId}`);
      } else {
        chat = await Chat.create({
          senderId,
          receiverId: studentUserId,
          batchId: student.batchId,
          lastMessageAt: null,
          lastMessageText: null
        });
        console.log(`Created new chat ${chat.id}: advisor ${senderId} → student ${studentUserId}`);
      }

      // Create message (advisor → student)
      const hasText = typeof text === 'string' && text.trim().length > 0;
      const hasAttachment = fileAttachment !== null && fileAttachment !== undefined;

      if (!hasText && !hasAttachment) {
        socket.emit('error', {
          message: 'Message text or file attachment is required'
        });
        // If we just created a new chat with no message, delete it
        if (chat && !chat.lastMessageAt) {
          await chat.destroy();
        }
        return;
      }

      let message = await Message.create({
        chatId: chat.id,
        senderId,
        receiverId: studentUserId,
        text: hasText ? text.trim() : null,
        fileAttachment: hasAttachment ? fileAttachment : null,
        isRead: false
      });

      await chat.update({
        lastMessageAt: message.createdAt,
        lastMessageText: message.text || 'File attachment...'
      });

      message =  await Message.findOne({
      where: {
        id:message.id
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'role'],
          include: [
            {
              model: Student,
              attributes: ['studentName']
            },
            {
              model: BatchAdvisor,
              attributes: ['advisorName']
            }
          ]
        }
      ],
      order: [['createdAt', 'ASC']]  // All messages in chronological order
    });

      socket.join(`chat_${chat.id}`);

      // Emit to chat room
      io.to(`chat_${chat.id}`).emit('newMessage', {
        chatId: chat.id,
        message
      });

      // Notify student
      const studentSockets = userSockets.get(studentUserId.toString());
      if (studentSockets) {
        for (const studentSocketId of studentSockets) {
          io.to(studentSocketId).emit('chatNotification', {
            chatId: chat.id,
            message
          });
        }
      }

      socket.emit('messageSent', {
        chatId: chat.id,
        message
      });

      console.log(
        ` Advisor ${senderId} → Student ${studentUserId}: Message ${message.id} sent in chat ${chat.id}`
      );

      return;
    }

    socket.emit('error', {
      message: 'Invalid user role'
    });

  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('error', {
      message: 'Error sending message'
    });
  }
});
    // Mark messages as read
    socket.on('markAsRead', async (data) => {
      try {
        const { chatId, userId } = data;

        const chat = await Chat.findOne({
          where: {
            id: chatId,
            [Op.or]: [
              { senderId: userId },
              { receiverId: userId }
            ]
          }
        });

        if (!chat) {
          socket.emit('error', { message: 'You are not authorized to access this chat' });
          return;
        }

        const result = await Message.update(
          { isRead: true },
          {
            where: {
              chatId,
              receiverId: userId,
              isRead: false
            }
          }
        );

        console.log(`${result[0]} messages marked as read in chat ${chatId}`);
        socket.emit('readConfirmed', { chatId, count: result[0] });

      } catch (error) {
        console.error('Error marking messages as read:', error);
        socket.emit('error', { message: 'Error marking messages as read' });
      }
    });

    // Typing indicators
    socket.on('typing', async (data) => {
      try {
        const { chatId, userId, isTyping } = data;

        const chat = await Chat.findOne({
          where: {
            id: chatId,
            [Op.or]: [
              { senderId: userId },
              { receiverId: userId }
            ]
          }
        });

        if (!chat) return;

        socket.to(`chat_${chatId}`).emit('userTyping', {
          userId,
          isTyping
        });

      } catch (error) {
        console.error('Typing error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userId = socket.data.userId;

      if (userId) {
        const key = userId.toString();
        const sockets = userSockets.get(key);

        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSockets.delete(key);
          }
        }
        console.log(`Socket ${socket.id} removed for user ${userId}`);
      }

      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return { userSockets };
};

export default chatService;