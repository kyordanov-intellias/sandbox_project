import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.routes";
import { AppDataSource } from "./db/data-source";
import { rabbitMQService } from './services/rabbitmq.service';
import { userHandlerService } from './services/user-handler.service';

// Load environment variables
dotenv.config();

async function startServer() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Initialize RabbitMQ and start consuming messages
    await rabbitMQService.startConsuming(async (userData) => {
      await userHandlerService.handleUserCreated(userData);
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

    const PORT = process.env.USER_SERVICE_PORT || 4002;
    app.listen(PORT, () => {
      console.log(`✅ User service running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM signal. Closing connections...');
  await rabbitMQService.closeConnection();
  process.exit(0);
});

startServer();