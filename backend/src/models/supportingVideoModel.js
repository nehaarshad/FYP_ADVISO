import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SupportingVideo = sequelize.define("SupportingVideo", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,        
        unique: true,
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default SupportingVideo;