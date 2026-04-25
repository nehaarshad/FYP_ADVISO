import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SemesterRoadmapModel = sequelize.define("SemesterRoadmapModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    roadmapId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    semesterNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalCreditHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    timestamps: true,
});

export default SemesterRoadmapModel;