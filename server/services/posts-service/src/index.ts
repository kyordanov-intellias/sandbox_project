import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { configPostsFile } from "../config/config";
import { postsRouter } from "./routes/posts.routes";
import { AppDataSource } from "./db/data-source";
import koaCookie from "koa-cookie";

async function startServer() {
  try {
    await AppDataSource.initialize().then(() =>
      console.log("✅ Posts Database connected")
    );

    const app = new Koa();

    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );

    app.use(bodyParser());
    app.use(koaCookie());
    app.use(postsRouter.routes());
    app.use(postsRouter.allowedMethods());

    const PORT = configPostsFile.port || 4003;
    app.listen(PORT, () => {
      console.log(`✅ Posts service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer();
