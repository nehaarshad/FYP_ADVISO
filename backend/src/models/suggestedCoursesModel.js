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
        type: DataTypes.FLOAT,  
        allowNull: false,
        defaultValue: 0,
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
        type: DataTypes.JSON,
        allowNull: true,
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
          }
}, {
    timestamps: true,
});

export default SuggestedCourses;