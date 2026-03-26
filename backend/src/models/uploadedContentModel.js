import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const UploadedContentModel = sequelize.define("UploadedContentModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    uploadedType: {
        type: DataTypes.ENUM("timetable", "courseOffering", "roadmap", "results",),
        allowNull: false,
    },
    attachment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default UploadedContentModel;