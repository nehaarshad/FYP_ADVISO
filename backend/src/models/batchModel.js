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
    batchName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    batchYear: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    totalStudent: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    timestamps: true,
});

export default BatchModel;