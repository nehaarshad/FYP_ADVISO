import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const TimetableModel = sequelize.define("TimetableModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    courseOfferingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    day:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    venue:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    instructor:{
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