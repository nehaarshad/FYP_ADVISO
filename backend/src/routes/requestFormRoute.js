import express from "express";
import requestFormController from "../controllers/requestFormTypeController.js";
const { createRequestFormType, getAllRequestFormTypes, updateRequestFormType } = requestFormController;

const requestFormRoute = express.Router();

requestFormRoute.post("/createRequestForm", createRequestFormType);
requestFormRoute.get("/getAllRequestForm", getAllRequestFormTypes);
requestFormRoute.put("/updateRequestForm/:id", updateRequestFormType);

export default requestFormRoute;
