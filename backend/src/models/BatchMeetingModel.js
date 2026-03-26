import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const BatchMeeting = sequelize.define("BatchMeeting", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    advisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("Scheduled", "Completed", "Cancelled"),
        allowNull: false,
        defaultValue: "Scheduled",
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    meetingSummary: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    timestamps: true,
});

export default BatchMeeting;