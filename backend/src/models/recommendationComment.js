import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const RecommendationComment = sequelize.define("RecommendationComment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    commentingAdvisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recommendationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
    },
    suggestedSolution: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    voteCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isAccepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

export default RecommendationComment;