import express from "express";
import supportingVideoController from "../controllers/supportingVideoController.js";
import { uploadVideo } from "../middleWares/chatFileAttachments.js";

const supportingVideoRouter = express.Router();

supportingVideoRouter.post("/createVideo", uploadVideo.single('videoFile'), supportingVideoController.createVideo);
supportingVideoRouter.get("/getAllVideos", supportingVideoController.getAllVideos);
supportingVideoRouter.put("/updateVideo/:id", uploadVideo.single('videoFile'), supportingVideoController.updateVideo);
supportingVideoRouter.delete("/deleteVideo/:id", supportingVideoController.deleteVideo);

export default supportingVideoRouter;