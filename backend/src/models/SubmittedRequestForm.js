import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SubmittedRequestForm = sequelize.define("SubmittedRequestForm", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    finalDecision: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    approvedById: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    preReviewedById: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    RequestFormTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default SubmittedRequestForm;