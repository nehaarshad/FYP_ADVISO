import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const BatchAssignment = sequelize.define("BatchAssignment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    advisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isCurrentlyAdvised: {
        type: DataTypes.BOOLEAN,//shows to later advisors of the batch but not to student
        allowNull: false,
        defaultValue: true,
    },
}, {
    timestamps: true,
});

export default BatchAssignment;