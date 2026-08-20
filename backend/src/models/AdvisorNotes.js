import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const AdvisorNotes = sequelize.define("AdvisorNotes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    advisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    noteContent: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    batchId: {
        type: DataTypes.INTEGER,//shows to later advisors of the batch but not to student
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default AdvisorNotes;