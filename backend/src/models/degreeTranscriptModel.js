import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const DegreeTranscript = sequelize.define("DegreeTranscript", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    totalEarnedCreditHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentCGPA: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default DegreeTranscript;