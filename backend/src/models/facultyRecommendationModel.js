import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const FacultyRecommendation = sequelize.define("FacultyRecommendation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issueDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Open", "In Progress", "Resolved", "Closed"),
        allowNull: false,
        defaultValue: "Open",
    },
    postingAdvisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isUrgent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

export default FacultyRecommendation;