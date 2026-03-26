import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const CoursePreReqModel = sequelize.define("CoursePreReqModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    courseid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    preReqCourseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default CoursePreReqModel;