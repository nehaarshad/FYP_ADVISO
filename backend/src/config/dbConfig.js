import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME || process.env.DATABASE || "adviso";
// process.env.DB_USER pehle check hoga taake OS USERNAME ('valee') bypass ho sakay
const dbUser = process.env.DB_USER || "root"; 
const dbPassword = process.env.DB_PASSWORD || process.env.PASSWORD || "";
const dbHost = process.env.DB_HOST || process.env.HOST || "127.0.0.1";
const dbPort = Number(process.env.DB_PORT) || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
  port: dbPort,
  logging: false,
});

export default sequelize;