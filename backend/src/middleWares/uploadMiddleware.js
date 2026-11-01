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
        const uniquename = Date.now() + "-" + uuidv4();
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, "temp-uploads/" + file.fieldname + "-" + uniquename + ext);
    },
});

// 3. File type filter (keep your original logic)
const xlsxFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error('Excel files only! Allowed: XLSX, XLS'));
};

const uploadXlsx = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024, files: 5 }, // adjust limits as needed
    fileFilter: xlsxFilter
});

export { uploadXlsx };