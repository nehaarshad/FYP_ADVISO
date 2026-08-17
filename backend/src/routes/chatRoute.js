import express from "express";
import path from "path";
import fs from "fs";
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

            const fileUrl = `${process.env.BASE_URL}/src/uploads/${req.file.filename}`; 

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            file: {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                mimeType: req.file.mimetype,
                size: req.file.size,
                url: fileUrl
            }
        });
    }
);

chatRouter.delete("/chat/delete/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(dirname, "..", "src/uploads", filename);
   if (!fs.existsSync(filePath)) {
    return res.status(404).json({
        success: false,
        message: "File not found"
    });
}

    fs.unlinkSync(filePath);
    res.status(200).json({
        success: true,
        message: "File deleted successfully"
    });
});

export default chatRouter;