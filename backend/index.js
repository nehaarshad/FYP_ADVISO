import express from "express";
import cors from "cors";
import compression from "compression";
import bodyparser from "body-parser";
import  sequelize  from "../backend/src/config/dbConfig.js";
import modelsSyncs from "../backend/src/config/seqModelSync.js";
import  http  from 'http';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

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

app.use(bodyparser.json({ limit: '10mb' }));
app.use(bodyparser.urlencoded({ extended: true, limit: '10mb' }));

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