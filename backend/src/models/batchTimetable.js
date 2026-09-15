import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const BatchTimetableModel = sequelize.define("BatchTimetableModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    batchId: {   // overall all batch students timetable rather it is regular or irregular
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,  //  cr add batch regular timetable and can edit or delete it
        allowNull: false,          // irregular student add/update/delete his/her timetable appended with regular student timetable but can't modify them except created by their own.
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

export default BatchTimetableModel;