import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const StudentGuardian = sequelize.define("StudentGuardian", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,        
        unique: true,
    },
    contactNumber: {
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

export default StudentGuardian;