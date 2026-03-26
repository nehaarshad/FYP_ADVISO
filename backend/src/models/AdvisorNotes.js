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
    noteContent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,//shows to later advisors of the batch but not to student
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default AdvisorNotes;