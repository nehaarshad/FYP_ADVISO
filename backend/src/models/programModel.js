import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const ProgramModel = sequelize.define("ProgramModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    programName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    timestamps: true,
});

export default ProgramModel;