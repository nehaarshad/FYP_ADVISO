import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(dirname, "..", "uploads");

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
            fs.chmodSync(dest, 0o755);
        }

        cb(null, dest);
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + uuidv4();
        const ext = path.extname(file.originalname).toLowerCase();

        const fileName =
            file.fieldname + "-" + uniqueName + ext;

        cb(null, fileName);
    }
});

const chatFileFilter = (req, file, cb) => {

    const allowedMimeTypes = [
        // Images
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",

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

export { uploadChatFile };