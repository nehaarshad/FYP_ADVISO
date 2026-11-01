import express from "express";
import path from "path";
import s3Service from "../services/s3Services.js"; 
const { deleteFileFromS3 } = s3Service;
import { fileURLToPath } from "url";
import { uploadChatFile } from "../middleWares/chatFileAttachments.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const chatRouter = express.Router();

chatRouter.post(
    "/chat/upload",
    uploadChatFile.single("chatfile"),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

            const fileUrl = req.file.location

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                originalName: req.file.originalname,
                fileName: req.file.key,
                mimeType: req.file.mimetype,
                size: req.file.size,
                url: fileUrl
            }
        });
    }
);

chatRouter.delete("/chat/delete/:filename", async (req, res) => {
    const { filename } = req.params;
    
      await deleteFileFromS3(filename);

    res.status(200).json({
        success: true,
        message: "File deleted successfully"
    });
});

export default chatRouter;