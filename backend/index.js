import express from "express";
import cors from "cors";
import compression from "compression";
import { fileURLToPath } from "url";
import bodyparser from "body-parser";
import  sequelize  from "../backend/src/config/dbConfig.js";
import modelsSyncs from "../backend/src/config/seqModelSync.js";
import  http  from 'http';
import dotenv from "dotenv";
import roadmapRoute from "./src/routes/roadmapRoute.js";
import courseDetailRoute from "./src/routes/courseDetailRouter.js";
import registerUserRoute from "./src/routes/registerUserRoute.js";
import path from "path";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use("/src/uploads", express.static(path.join(__dirname, "src/uploads"), {
    maxAge: '1y', // Tells browsers to cache the image for 1 year.
    etag: true, //Enables ETag headers, which help browsers validate cached content.
    lastModified: true, //Adds a Last-Modified header for cache validation.
    cacheControl: true, //Enables Cache-Control headers.
    setHeaders: (res, path) => {
        if (path.endsWith('.webp') || path.endsWith('.jpg') || path.endsWith('.png')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
        }
    }
}));

app.use('/auth', roadmapRoute);
app.use('/auth', courseDetailRoute);
app.use('/auth', registerUserRoute);


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