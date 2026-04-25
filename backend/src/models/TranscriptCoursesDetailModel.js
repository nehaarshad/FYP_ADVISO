import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const TranscriptCoursesDetail = sequelize.define("TranscriptCoursesDetail", {
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
        allowNull: false,
    },
    courseCategory:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    points: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    marks: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    earnedCreditHours: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalCreditHours: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sessionalTranscriptId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default TranscriptCoursesDetail;