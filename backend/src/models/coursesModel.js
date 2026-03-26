import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const CoursesModel = sequelize.define("CoursesModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    courseCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseDescription: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    courseCredits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default CoursesModel;