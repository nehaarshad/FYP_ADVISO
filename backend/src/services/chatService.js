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
     socket.on('getUserChats', async (userId) => {
       try {
         const user = await User.findByPk(userId, {
           include: [
             { model: Student, as: 'students' },
             { model: BatchAdvisor, as: 'batchAdvisors' }
           ]
         });
         
         if (!user) {
           socket.emit('error', { message: 'User not found' });
           return;
         }

         let chats = [];
         
         if (user.role === 'advisor') {
           const advisorChats = await Chat.findAll({
  where: {
    [Op.or]: [
      { senderId: userId },
      { receiverId: userId }
    ]
  },

  include: [
    {
      model: User,
      as: "sender",
      include: [
        {
          model: Student,
          as: "students",
          attributes: ["studentName"]
        },
        {
          model: BatchAdvisor,
          as: "batchAdvisors",
          attributes: ["advisorName"]
        }
      ]
    },

    {
      model: User,
      as: "receiver",
      include: [
        {
          model: Student,
          as: "students",
          attributes: ["studentName"]
        },
        {
          model: BatchAdvisor,
          as: "batchAdvisors",
          attributes: ["advisorName"]
        }
      ]
    }
  ],

  order: [["updatedAt", "DESC"]]
});

const studentMap = new Map();

advisorChats.forEach((chat) => {

  const studentUser =
    Number(chat.senderId) === Number(userId)
      ? chat.receiver
      : chat.sender;

  if (!studentUser || studentUser.role !== "student") {
    return;
  }

  const studentId = studentUser.id;

  // Get student's actual name
  const studentName =
    studentUser.students?.[0]?.studentName ||
    `Student ${studentId}`;

  if (!studentMap.has(studentId)) {

    studentMap.set(studentId, {
      // Other user's ID
      id: studentId,

      // ⭐ THIS is the name to display
      name: studentName,

      chatId: chat.id,

      // Keep these if your frontend needs them
      sender: chat.sender,
      receiver: chat.receiver,

      lastMessageAt: chat.lastMessageAt,

      lastMessageText:
        chat.lastMessageText || "No messages yet",

      unreadCount: 0
    });
  }

  socket.join(`chat_${chat.id}`);
});

           // Calculate unread messages for each student
           for (const [studentId, studentData] of studentMap) {
             const unreadCount = await Message.count({
               where: {
                 chatId: studentData.chatId,  // Specific chat
                 receiverId: userId,          // Messages sent to advisor
                 isRead: false                // Unread messages only
               }
             });
             studentData.unreadCount = unreadCount;
           }
           chats = Array.from(studentMap.values());
           
           // Sort by latest message
           chats.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
           
         } 
         else {
           // STUDENT
                const studentDetails = await Student.findOne({
             where: { userId: userId }
           });

           if (!studentDetails) {
             socket.emit('error', { message: 'Student details not found' });
             return;
           }
           const batchAssigned = await BatchAssignment.findOne({
             where: { batchId: studentDetails.batchId, isCurrentlyAdvised: true }
           });

           // Find advisor for this student's batch
           const advisor = await BatchAdvisor.findOne({
             where: { id: batchAssigned ? batchAssigned.advisorId : null }
           });

           if (!advisor) {
             socket.emit('error', { message: 'No advisor assigned to your batch' });
             return;
           }

           // Check if chat exists between student and advisor
           let studentChat = await Chat.findOne({
             where: {
               batchId: studentDetails.batchId,
               [Op.or]: [
                 { senderId: userId, receiverId: advisor.userId },
                 { senderId: advisor.userId, receiverId: userId }
               ]
             }
           });

           // If no chat exists, create one
           if (!studentChat) {
             studentChat = await Chat.create({
               senderId: userId,
               receiverId: advisor.userId,
               batchId: studentDetails.batchId,
               lastMessageAt: null,
               lastMessageText: null
             });
           }

           // Get advisor details
           const advisorUser = await User.findByPk(advisor.userId, {
             include: [{ model: BatchAdvisor, as: 'batchAdvisors' }]
           });

           // Get latest messages for preview
           const latestMessage = await Message.findOne({
             where: { chatId: studentChat.id },
             order: [['createdAt', 'DESC']]
           });

           // Get unread count
           const unreadCount = await Message.count({
             where: {
               chatId: studentChat.id,
               receiverId: userId,
               isRead: false
             }
           });

           // Create single chat entry for student (only one chat with advisor)
           chats = [{
             id: advisor.userId,
             name: advisorUser.batchAdvisor ? advisorUser.batchAdvisor.advisorName : 'Your Advisor',
             chatId: studentChat.id,
             lastMessageAt: studentChat.lastMessageAt,
             lastMessageText: latestMessage
                      ? latestMessage.text || 'File attachment...'
                      : 'No messages yet',
             lastMessageSender: latestMessage?.senderId === userId ? 'You' : 'Advisor',
             unreadCount: unreadCount
           }];

           // Join the chat room so student receives real-time messages
           socket.join(`chat_${studentChat.id}`);
         }

         socket.emit('chatsList', chats);
         console.log(`Sent ${chats.length} chats to user ${userId}`);
         
       } catch (error) {
         console.error('Error fetching user chats:', error);
         socket.emit('error', { message: 'Error fetching chats' });
       }
     });

     // Get messages for a specific chat
     socket.on('getChatMessages', async (data) => {
       try {
         const { chatId, userId } = data;
         
         // Verify user is part of this chat
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
           socket.emit('error', { message: 'You are not authorized to view this chat' });
           return;
         }

         const messages = await Message.findAndCountAll({
           where: { chatId },
           include: [
             {
               model: User,
               as: 'sender',
               attributes: ['id', 'role'],
               include: [
                 { 
                   model: Student, 
                   as: 'students',
                   attributes: ['studentName']
                 },
                 { 
                   model: BatchAdvisor, 
                   as: 'batchAdvisors',
                   attributes: ['advisorName']
                 }
               ]
             }
           ],
           order: [['createdAt', 'ASC']]
         });

         console.log(
  `Fetched ${messages.count} messages:`,
  JSON.stringify(messages.rows)
);
         // Mark messages as read when student views them
         await Message.update(
           { isRead: true },
           {
             where: {
               chatId,
               receiverId: userId,
               isRead: false
             }
           }
         );

         socket.emit('chatMessages', {
           chatId: chatId,
           messages: messages.rows,
           total: messages.count,
           chatInfo: {
             isAdvisor: chat.senderId === userId ? 'advisor' : 'student'
           }
         });

       } catch (error) {
         console.error('Error fetching chat messages:', error);
         socket.emit('error', { message: 'Error fetching messages' });
       }
     });

     // Send a new message
     socket.on('sendMessage', async (data) => {
       try {
         const { chatId, senderId, text, receiverId, fileAttachment } = data;
         
         // Validate sender is the one sending the message
         if (
            socket.data.userId &&
            Number(socket.data.userId) !== Number(senderId)
          ) {
            socket.emit('error', {
              message: 'Unauthorized sender'
            });
            return;
          }

         // Verify chat exists
         const chat = await Chat.findByPk(chatId);
         if (!chat) {
           socket.emit('error', { message: 'Chat not found' });
           return;
         }

         // Verify sender is part of this chat
         if (
          Number(chat.senderId) !== Number(senderId) &&
          Number(chat.receiverId) !== Number(senderId)
        ) {
          socket.emit('error', {
            message: 'You are not authorized to send messages in this chat'
          });
          return;
        }

        // verify receiver
        const expectedReceiverId =
          Number(chat.senderId) === Number(senderId)
            ? chat.receiverId
            : chat.senderId;

        if (Number(expectedReceiverId) !== Number(receiverId)) {
          socket.emit('error', {
            message: 'Invalid receiver for this chat'
          });
          return;
        }
         socket.join(`chat_${chatId}`);

         const cleanText = typeof text === 'string' ? text.trim() : '';
            const hasFile =
              typeof fileAttachment === 'string' &&
              fileAttachment.trim().length > 0;

            if (!cleanText && !hasFile) {
              socket.emit('error', {
                message: 'Message must contain text or a file'
              });
              return;
            }
         // Create message
         const newMessage = await Message.create({
           chatId,
           senderId,
           receiverId,
           text: cleanText || null,
           fileAttachment: hasFile ? fileAttachment.trim() : null,
           isRead: false,
           isSent: true
         });

         // Update chat's last message
         await Chat.update(
           { 
             lastMessageAt: new Date(),
             lastMessageText: cleanText || 'File attachment...'
           },
           { where: { id: chatId } }
         );

         // Get full message details with sender info
         const fullMessage = await Message.findByPk(newMessage.id, {
           include: [
             {
               model: User,
               as: 'sender',
               attributes: ['id', 'role'],
               include: [
                 { 
                   model: Student, 
                   as: 'students',
                   attributes: ['studentName']
                 },
                 { 
                   model: BatchAdvisor, 
                   as: 'batchAdvisors',
                   attributes: ['advisorName']
                 }
               ]
             }
           ]
         });


         // Emit to all participants in the chat
         io.to(`chat_${chatId}`).emit('receiveMessage', fullMessage);

         // Send notification to receiver if online
         const receiverSockets = userSockets.get(receiverId.toString());

          if (receiverSockets) {
            for (const receiverSocketId of receiverSockets) {
              io.to(receiverSocketId).emit('newMessageNotification', {
                chatId,
                senderId,
                senderName: fullMessage.sender.role === 'student'
                  ? fullMessage.sender.student?.studentName || 'Student'
                  : fullMessage.sender.batchAdvisor?.advisorName || 'Advisor',
                message: cleanText || 'File attachment...',
                fileAttachment: fullMessage.fileAttachment || null,
                timestamp: new Date()
              });
            }
          }

         console.log(`Message sent in chat ${chatId} by user ${senderId}`);
       } catch (error) {
         console.error('Error sending message:', error);
         socket.emit('error', { message: 'Error sending message' });
       }
     });

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
            socket.emit('error', {
              message: 'You are not authorized to access this chat'
            });
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

            if (!chat) {
              return;
            }

            socket.join(`chat_${chatId}`);

            socket.to(`chat_${chatId}`).emit('userTyping', {
              userId,
              isTyping
            });

          } catch (error) {
            console.error('Typing error:', error);
          }
        });

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