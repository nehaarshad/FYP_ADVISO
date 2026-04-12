
import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SuggestedCourses = sequelize.define("SuggestedCourses", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sessionalRecommendationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'),
        defaultValue: 'MEDIUM',
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isOffered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    offeredProgram: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    timeSlot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default SuggestedCourses;