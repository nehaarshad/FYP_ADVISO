import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const AdvisorDecision = sequelize.define("AdvisorDecision", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    issueDescription: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    decisionTaken: {
        type: DataTypes.TEXT('long'),
        allowNull: false,     
    },
    advisorId: {
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

export default AdvisorDecision;