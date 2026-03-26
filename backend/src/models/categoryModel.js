import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const CategoryModel = sequelize.define("CategoryModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default CategoryModel;