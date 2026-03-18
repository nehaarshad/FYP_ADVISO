import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    sapid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("student", "advisor","admin","coordinator"),
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default User;