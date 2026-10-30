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

// Configure multer to upload to S3
const storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        // Save videos in the public-videos folder
        cb(null, "public-videos/" + Date.now() + "-" + file.originalname);
    }
});


const chatFileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        // Images
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        // Videos
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-matroska",
        "video/webm",
        "video/ogg",
        "video/3gpp",
        "video/3gpp2",
        "video/x-ms-wmv",
        "video/x-flv",
        // PDF
        "application/pdf",
        // Word
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // Excel
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // Text
        "text/plain",
        // PowerPoint
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new Error("File type not supported"));
};

const uploadChatFile = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
        files: 1
    },
    fileFilter: chatFileFilter
});

const uploadVideo = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB for videos
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            return cb(null, true);
        }
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (videoExtensions.includes(ext)) {
            return cb(null, true);
        }
        cb(new Error("Only video files are allowed (MP4, WebM, MOV, AVI, MKV, etc.)"));
    }
});

export { uploadChatFile, uploadVideo };