import SupportingVideo from "../models/supportingVideoModel.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Create new supporting video with file upload
const createVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Video file is required"
            });
        }

        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const videoUrl = `${process.env.BASE_URL}/src/uploads/${req.file.filename}`; 

        const video = await SupportingVideo.create({
            title,
            description: description || "",
            videoUrl
        });

        return res.status(201).json({
            success: true,
            message: "Video created successfully",
            data: video
        });

    } catch (error) {
        console.error("Error creating video:", error);
        // Delete uploaded file if error occurs
        if (req.file) {
            const filePath = path.join(dirname, "..", "uploads", req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all videos
const getAllVideos = async (req, res) => {
    try {
        

        const videos = await SupportingVideo.findAll({
            order: [[sortBy, order]],
        });

        return res.status(200).json({
            success: true,
            count: videos.length,
            data: videos
        });

    } catch (error) {
        console.error("Error fetching videos:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update video
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const video = await SupportingVideo.findByPk(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        // If new video file is uploaded, delete old one
        if (req.file) {
            // Delete old video file
            const oldVideoPath = path.join(dirname, "..", "uploads", 
                path.basename(video.videoUrl));
            if (fs.existsSync(oldVideoPath)) {
                fs.unlinkSync(oldVideoPath);
            }
            
            // Update video URL
            video.videoUrl = `${process.env.BASE_URL}/src/uploads/${req.file.filename}`; ;
        }

        await video.update({
            title: title || video.title,
            description: description !== undefined ? description : video.description,
            videoUrl:video.videoUrl
        });

        return res.status(200).json({
            success: true,
            message: "Video updated successfully",
            data: video
        });

    } catch (error) {
        console.error("Error updating video:", error);
        // Delete uploaded file if error occurs
        if (req.file) {
            const filePath = path.join(dirname, "..", "uploads", req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete video
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await SupportingVideo.findByPk(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        // Delete video file from storage
        const videoPath = path.join(dirname, "..", "uploads",
            path.basename(video.videoUrl));
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }

        await video.destroy();

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting video:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export default {
    createVideo,
    getAllVideos,
    updateVideo,
    deleteVideo,
};