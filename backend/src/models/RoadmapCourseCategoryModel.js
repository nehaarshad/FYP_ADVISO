import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const RoadmapCourseCategoryModel = sequelize.define("RoadmapCourseCategoryModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roadmapId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    requiredCredits:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
});

export default RoadmapCourseCategoryModel;