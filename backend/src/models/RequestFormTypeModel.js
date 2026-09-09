import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const RequestFormType = sequelize.define("RequestFormType", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    RequestType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    formData: {
        type: DataTypes.JSON,
        allowNull: true,     
    },
    finalDecision: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    approvedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    preReviewedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default RequestFormType;