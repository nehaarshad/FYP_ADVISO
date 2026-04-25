
import { DataTypes } from 'sequelize';
import sequelize from "../config/dbConfig.js";

const AdvisorFinalRecommendation = sequelize.define('AdvisorFinalRecommendation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    advisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionalRecommendationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    recommendedCourses: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    totalCredits: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});
 
export default AdvisorFinalRecommendation;