import express from "express";
import degreeGuidelinesController from "../controllers/degreeGuidlineController.js";

const degreeGuidelinesRouter = express.Router();

degreeGuidelinesRouter.post("/createGuideline", degreeGuidelinesController.createGuideline);
degreeGuidelinesRouter.get("/getAllGuidelines", degreeGuidelinesController.getAllGuidelines);
degreeGuidelinesRouter.put("/updateGuideline/:id", degreeGuidelinesController.updateGuideline);
degreeGuidelinesRouter.delete("/deleteGuideline/:id", degreeGuidelinesController.deleteGuideline);

export default degreeGuidelinesRouter;