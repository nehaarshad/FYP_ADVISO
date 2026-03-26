import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Message = sequelize.define("Messages", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fileAttachment: {
        type: DataTypes.STRING,//store its url in the database and file in the server
        allowNull: true,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isSent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default Message;