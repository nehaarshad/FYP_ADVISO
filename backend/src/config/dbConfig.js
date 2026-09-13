import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER || "root", 
    process.env.DB_PASSWORD || "",
    {
        host: process.env.HOST || "127.0.0.1",
        dialect: "mysql",
        port: process.env.DB_PORT || 3306,
        logging: false,  
    }
);

export default sequelize;