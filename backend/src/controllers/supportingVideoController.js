import SupportingVideo from "../models/supportingVideoModel.js";
import { Op } from "sequelize";
import  s3Service from '../services/s3Services.js';
const { getKeyFromUrl, deleteFileFromS3 } = s3Service;

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

        console.log(req.body,req.file)
        const videoUrl = req.file.location 
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
        if (req.file && req.file.key) {
            await deleteFileFromS3(req.file.key).catch(err => console.error(err));
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
            order: [["createdAt", "DESC"]],
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
          console.log("updating video: ",req.body)
        const { title, description,videoFile } = req.body || req.body.data;

      
        const video = await SupportingVideo.findByPk(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        console.log("updating video file: ",video)

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
        try {
            const key = getKeyFromUrl(video.videoUrl);
            await deleteFileFromS3(key);
        } catch (err) {
            console.error("Error deleting video from S3:", err);
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