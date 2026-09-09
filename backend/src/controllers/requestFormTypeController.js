import RequestFormType from "../models/RequestFormTypeModel.js";
import Student from "../models/studentModel.js";
import Coordinator from "../models/coordinatorModel.js";
import BatchAdvisor from "../models/FacultyAdvisorModel.js";

//create a new request form type
const createRequestFormType = async (req, res) => {
    try {
        const { RequestType, formData, finalDecision, studentId, approvedById, preReviewedById, status } = req.body;
        console.log("Request Body:", req.body); // Log the request body for debugging
        const newRequestFormType = await RequestFormType.create({
            RequestType,
            formData,
            finalDecision,
            studentId,
            approvedById,
            preReviewedById,
            status,
        });
        res.status(201).json({success: true, data: newRequestFormType});
    }
    catch (error) {
        console.error("Error creating request form type:", error);
        res.status(500).json({ success: false, error: "An error occurred while creating the request form type." });
    }
};

//get all request form types
const getAllRequestFormTypes = async (req, res) => {
    try {
        const requestFormTypes = await RequestFormType.findAll({
            include: [
                { model: Student },
                { model: Coordinator },
                { model: BatchAdvisor }
            ]
        });
        res.status(200).json(requestFormTypes);
    }
    catch (error) {
        console.error("Error fetching request form types:", error);
        res.status(500).json({ error: "An error occurred while fetching the request form types." });
    }
};

const updateRequestFormType = async (req, res) => {
    try {
        const { id } = req.params;
        const { RequestType, formData, finalDecision, studentId, approvedById, preReviewedById, status } = req.body;
        console.log("Request Body for Update:", req.body); // Log the request body for debugging
        const requestFormType = await RequestFormType.findByPk(id);
        if (!requestFormType) {
            return res.status(404).json({ error: "Request form type not found." });
        }
        await requestFormType.update({
            RequestType,
            formData,
            finalDecision,
            studentId,
            approvedById,
            preReviewedById,
            status
        });
        res.status(200).json(requestFormType);
    }
    catch (error) {
        console.error("Error updating request form type:", error);
        res.status(500).json({ error: "An error occurred while updating the request form type." });
    }
};

export default {createRequestFormType,getAllRequestFormTypes,updateRequestFormType};