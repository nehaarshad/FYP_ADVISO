import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const MeetingReminder = sequelize.define("MeetingReminder", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    meetingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "Completed", ),
        allowNull: false,
        defaultValue: "pending",
    },

}, {
    timestamps: true,
});

export default MeetingReminder;