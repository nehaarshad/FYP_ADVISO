import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const SessionModel = sequelize.define("SessionModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    sessionType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sessionYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default SessionModel;