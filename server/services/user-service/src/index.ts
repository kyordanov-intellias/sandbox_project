import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import "reflect-metadata";
import { userRouter } from "./routes/user.routes";
import { AppDataSource } from "./db/data-source";
import { rabbitMQService } from "./services/rabbitmq.service";
import { configUserFile } from "../config/config";
import { userHandlerService, UserCreatedEvent } from "./services/user-handler.service";

async function startServer() {
  try {
    await AppDataSource.initialize().then(() =>
      console.log("✅ Users Database connected")
    );

    await rabbitMQService.startConsuming(async (userData: UserCreatedEvent) => {
      try {
        await userHandlerService.handleUserCreated(userData);
      } catch (error) {
        console.error('Error processing user creation:', error);
        throw error; // This will trigger message requeue
      }
    });

    const app = new Koa();

    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );

    app.use(bodyParser());
    app.use(userRouter.routes());
    app.use(userRouter.allowedMethods());

    const PORT = configUserFile.port || 4002;
    app.listen(PORT, () => {
      console.log(`✅ User service running on port ${PORT}`);
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
