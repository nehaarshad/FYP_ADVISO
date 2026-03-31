import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const CourseCategoryModel = sequelize.define("CourseCategoryModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default CourseCategoryModel;