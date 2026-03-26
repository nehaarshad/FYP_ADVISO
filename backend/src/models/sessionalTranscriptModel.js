import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SessionalTranscript = sequelize.define("SessionalTranscript", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    semesterEarnedCreditHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    semesterGPA: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    degreeTranscriptId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    enrolledCoursesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default SessionalTranscript;