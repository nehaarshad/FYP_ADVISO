import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const RequestFormType = sequelize.define("RequestFormType", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    RequestType: {
        type: DataTypes.ENUM("Semester Freezing","Semester Unfreezing", "Course Offering Request","Courses Registeration Request", "Extra Credit Enrollment Request"),
        allowNull: false,
    },
    formData: {
        type: DataTypes.JSON,
        allowNull: false,     
    },
}, {
    timestamps: true,
});

export default RequestFormType;