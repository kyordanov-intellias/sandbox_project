import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../../.env") });

export const configChatFile = {
  port: process.env.CHAT_SERVICE_PORT || 4004,
  database: {
    host: process.env.CHAT_SERVICE_DB_HOST || "postgres_chat",
    port: parseInt(process.env.CHAT_SERVICE_DB_PORT || "5432"),
    username: process.env.CHAT_SERVICE_DB_USER || "postgres",
    password: process.env.CHAT_SERVICE_DB_PASSWORD || "postgres",
    database: process.env.CHAT_SERVICE_DB_NAME || "chat_db",
  },
  jwt: {
    secret: process.env.AUTH_SERVICE_JWT_SECRET || "your-auth-secret-key",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173"
  }
};