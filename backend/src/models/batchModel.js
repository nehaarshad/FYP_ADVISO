import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const BatchModel = sequelize.define("BatchModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    programId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roadmapId: {   // which roadmap assigninged to this batch (spring2023 program se)
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    batchName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    batchYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalStudent: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

}, {
    timestamps: true,
});

export default BatchModel;