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
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'scheduled', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    meetingSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

}, {
    timestamps: true,
});

export default BatchMeeting;