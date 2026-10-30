import express from "express";
import cors from "cors";
import compression from "compression";
import { fileURLToPath } from "url";
import bodyparser from "body-parser";
import  sequelize  from "../backend/src/config/dbConfig.js";
import modelsSyncs from "../backend/src/config/seqModelSync.js";
import  http  from 'http';
import dotenv from "dotenv";
import router from "./src/routes/indexRoutes.js";
import chatService from "./src/services/chatService.js";
import { Server as SocketServer } from 'socket.io'; 
import startReminderJob from './src/services/meetingReminderService.js'
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE",],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
  ],
  credentials: false,
  optionsSuccessStatus: 200 
}));

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
    next();
});


//app routes
app.use(router);
startReminderJob();
// Initialize chat service with Socket.IO
const { userSockets } = chatService(io);

// Make io and userSockets available globally 
app.set('io', io);
app.set('userSockets', userSockets);


sequelize.authenticate()
  .then(() => {
    console.log("Database is Connected SUCCESSFULLY");
  })
  .catch((err) => {
    console.error("Failed to authenticate database:", err);
  });

modelsSyncs.modelsSync()
  .then(() => {
    const port = process.env.PORT || 5500;
    server.listen(port, '0.0.0.0', () => { 
      console.log(`Server Running on Port ${port}`);
      
    });
  })
  .catch((err) => {
    console.log("Failed to synchronize models:", err);
    process.exit(1);
  });