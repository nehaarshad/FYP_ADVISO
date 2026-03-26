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
    problem: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    solution: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
    },
    recommendedById: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    approvedById: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recommendationCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default FacultyRecommendation;