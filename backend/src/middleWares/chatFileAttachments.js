import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Storage for Chat Attachments (images, docs, etc.)
const chatStorage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + uuidv4();
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, "chat-attachments/" + file.fieldname + "-" + uniqueName + ext);
    }
});

// Storage for Supporting Videos 
const videoStorage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + uuidv4();
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, "public-videos/" + file.fieldname + "-" + uniqueName + ext);
    }
});

// File Filters
const chatFileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo",
        "video/x-matroska", "video/webm", "video/ogg", "video/3gpp",
        "video/3gpp2", "video/x-ms-wmv", "video/x-flv",
        "application/pdf", "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", 
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain", "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error("File type not supported"));
};

const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        return cb(null, true);
    }
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (videoExtensions.includes(ext)) {
        return cb(null, true);
    }
    cb(new Error("Only video files are allowed (MP4, WebM, MOV, AVI, MKV, etc.)"));
};

// Multer Instances
const uploadChatFile = multer({
    storage: chatStorage,
    limits: { fileSize: 20 * 1024 * 1024, files: 1 }, // 20 MB
    fileFilter: chatFileFilter
});

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 500 * 1024 * 1024, files: 1 }, // 500 MB
    fileFilter: videoFilter
});

export { uploadChatFile, uploadVideo };