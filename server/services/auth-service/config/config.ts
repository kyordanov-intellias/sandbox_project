import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

export const configFile = {
  port: process.env.AUTH_SERVICE_PORT || 4001,
  database: {
    host: process.env.AUTH_SERVICE_DB_HOST || "postgres",
    port: parseInt(process.env.AUTH_SERVICE_DB_PORT || "5432"),
    username: process.env.AUTH_SERVICE_DB_USER || "postgres",
    password: process.env.AUTH_SERVICE_DB_PASSWORD || "postgres",
    database: process.env.AUTH_SERVICE_DB_NAME || "auth_db",
  },
  jwt: {
    secret: process.env.AUTH_SERVICE_JWT_SECRET || "your-auth-secret-key",
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  },
  redis: {
    host: process.env.REDIS_HOST || "redis",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
};
