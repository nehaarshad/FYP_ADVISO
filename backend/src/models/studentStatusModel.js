import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const StudentStatus = sequelize.define("StudentStatus", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    currentStatus: {
        type: DataTypes.ENUM("regular", "irregular","onProbation","suspended", "graduated"),
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default StudentStatus;