import User from "../models/userModel.js";
import StudentStatus from "../models/studentStatusModel.js";
import TranscriptCoursesDetail from "../models/TranscriptCoursesDetailModel.js"
import SessionalTranscript from "../models/sessionalTranscriptModel.js"
import DegreeTranscript from "../models/degreeTranscriptModel.js"
import CategoryModel from "../models/categoryModel.js"
import CourseCategoryModel from "../models/courseCategoryModel.js"
import CoursesModel from "../models/coursesModel.js"
import Student from "../models/studentModel.js";


const recommendCourses = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findOne({ where: { id: studentId } });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        const degreeTranscript = await DegreeTranscript.findOne({ where: { studentId: student.id } });

        if (!degreeTranscript) {
            return res.status(404).json({ success: false, message: "Degree transcript not found for the student" });
        }
    }
    catch (error) {
        console.error("Error recommending courses:", error);
        res.status(500).json({ error: "Internal server error", success: false });
    }
};



export default {
    recommendCourses
};