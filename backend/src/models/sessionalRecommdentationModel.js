import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SessionalRecommendation = sequelize.define('SessionalRecommendation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    recommendationText: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default SessionalRecommendation;