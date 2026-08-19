import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const DegreeGuidlinesModel = sequelize.define("DegreeGuidlinesModel", {
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
        type: DataTypes.TEXT('long'),
        allowNull: false,  
    },
    programId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default DegreeGuidlinesModel;