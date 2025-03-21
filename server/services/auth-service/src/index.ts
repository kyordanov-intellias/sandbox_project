import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { AppDataSource } from "./db/data-source";
import { authRouter } from "./routes/auth.routes";
import { configAuthFile } from "../config/config";
import { rabbitMQService } from "./services/rabbitmq.service";
import koaCookie from "koa-cookie";

async function startServer() {
  try {
    await AppDataSource.initialize().then(() =>
      console.log("✅ Auth Database connected")
    );

    await rabbitMQService.initialize().then(() => {
      console.log("✅ Auth service RabbitMQ connected");
    });

    const app = new Koa();

    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    app.use(bodyParser());
    app.use(koaCookie());
    app.use(authRouter.routes());
    app.use(authRouter.allowedMethods());

    const PORT = configAuthFile.port || 4001;
    app.listen(PORT, () => {
      console.log(`✅ Auth service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM signal. Closing connections...");
  await rabbitMQService.closeConnection();
  process.exit(0);
});

startServer();
