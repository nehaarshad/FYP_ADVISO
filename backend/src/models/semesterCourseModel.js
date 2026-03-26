import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SemesterCourseModel = sequelize.define("SemesterCourseModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    semesterRoadmapId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    courseCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default SemesterCourseModel;