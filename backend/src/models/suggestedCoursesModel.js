import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SuggestedCourses = sequelize.define("SuggestedCourses", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionalRecommendationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reason:{
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: true,
}
); 

export default SuggestedCourses;