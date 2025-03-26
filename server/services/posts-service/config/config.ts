import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../../.env") });

export const configPostsFile = {
  port: process.env.POSTS_SERVICE_PORT || 4003,
  database: {
    host: process.env.POSTS_SERVICE_DB_HOST || "postgres_posts",
    port: parseInt(process.env.POSTS_SERVICE_DB_PORT || "5432"),
    username: process.env.POSTS_SERVICE_DB_USER || "postgres",
    password: process.env.POSTS_SERVICE_DB_PASSWORD || "postgres",
    database: process.env.POSTS_SERVICE_DB_NAME || "posts_db",
  }
};
