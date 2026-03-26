import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const TranscriptCoursesDetail = sequelize.define("TranscriptCoursesDetail", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    marks: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    earnedCreditHours: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("completed", "withdraw", "inProgress","failed"),
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