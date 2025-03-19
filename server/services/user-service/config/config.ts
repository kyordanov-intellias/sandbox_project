import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../../.env") });

export const configFile = {
  port: process.env.USER_SERVICE_PORT || 4002,
  database: {
    host: process.env.USER_SERVICE_DB_HOST || "postgres_user",
    port: parseInt(process.env.USER_SERVICE_DB_PORT || "5432"),
    username: process.env.USER_SERVICE_DB_USER || "postgres",
    password: process.env.USER_SERVICE_DB_PASSWORD || "postgres",
    database: process.env.USER_SERVICE_DB_NAME || "user_db",
  },
};
