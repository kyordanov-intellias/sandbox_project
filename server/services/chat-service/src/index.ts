import "reflect-metadata";
import Koa from "koa";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { AppDataSource } from "./db/data-source";
import router from "./routes/chat.routes";
import { setupSocketHandlers } from "./controllers/socket.controller";
import { configChatFile } from "../config/config";

async function startServer() {
    try {
        await AppDataSource.initialize().then(() =>
            console.log("✅ Chat Database connected")
        );

        const app = new Koa();
        const httpServer = createServer(app.callback());
        const io = new Server(httpServer, {
            cors: {
                origin: configChatFile.cors.origin,
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        app.use(
            cors({
                origin: configChatFile.cors.origin,
                credentials: true
            })
        );
        app.use(bodyParser());
        app.use(router.routes());
        app.use(router.allowedMethods());

        setupSocketHandlers(io);

        const PORT = configChatFile.port || 4004;
        httpServer.listen(PORT, () => {
            console.log(`✅ Chat service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
}

process.on("SIGTERM", async () => {
    console.log("🛑 Received SIGTERM signal. Closing connections...");
    await AppDataSource.destroy();
    process.exit(0);
});

startServer(); 