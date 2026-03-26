import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const EnrolledCoursesModel = sequelize.define("EnrolledCoursesModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    courseCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionId: {
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

export default EnrolledCoursesModel;