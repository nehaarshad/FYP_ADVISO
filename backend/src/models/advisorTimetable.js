import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const AdvisorTimetableModel = sequelize.define("AdvisorTimetableModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    advisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    day:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    course:{
        type: DataTypes.STRING,
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
}, {
    timestamps: true,
});

export default AdvisorTimetableModel;