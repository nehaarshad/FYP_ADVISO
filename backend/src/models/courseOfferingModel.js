import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const CourseOfferingModel = sequelize.define("CourseOfferingModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    courseCategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    programId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default CourseOfferingModel;