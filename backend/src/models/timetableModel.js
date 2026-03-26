import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const TimetableModel = sequelize.define("TimetableModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    programId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    courseOfferingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    day:{
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

export default TimetableModel;