import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const RecommendationCategory = sequelize.define("RecommendationCategory", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,     
    },
}, {
    timestamps: true,
});

export default RecommendationCategory;