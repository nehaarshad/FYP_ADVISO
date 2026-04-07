import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const RoadmapModel = sequelize.define("RoadmapModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    programId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    versionName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    totalCreditHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roadmapFilePath:{
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {
    timestamps: true,
});

export default RoadmapModel;