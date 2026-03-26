import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SessionModel = sequelize.define("SessionModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    sessionType: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default SessionModel;