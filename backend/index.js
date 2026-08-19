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
import path from "path";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use("/src/uploads", express.static(path.join(__dirname, "src/uploads"), {
    maxAge: '1y', // Tells browsers to cache the image for 1 year.
   lastModified: true, //Adds a Last-Modified header for cache validation.
    cacheControl: true, //Enables Cache-Control headers.
}));


//app routes
app.use(router);
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