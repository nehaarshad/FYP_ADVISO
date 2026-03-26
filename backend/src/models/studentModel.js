import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Student = sequelize.define("Student", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    studentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,        
        unique: true,
    },
    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cnic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    currentSemester: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default Student;