import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const CoursesModel = sequelize.define("CoursesModel", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
    },
    courseCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    courseName: {     //course name vary from sheet to sheet, but code same (applied physics)
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseCredits: {  // course name and code same but credits may change (CN)
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default CoursesModel;