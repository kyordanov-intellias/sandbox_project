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

        const roomRepo = AppDataSource.getRepository(require('./models/ChatRoom.entity').ChatRoom);
        const defaultRooms = [
            { name: 'JavaScript' },
            { name: 'VSCode' },
            { name: 'Others' }
        ];
        for (const room of defaultRooms) {
            const exists = await roomRepo.findOne({ where: { name: room.name } });
            if (!exists) {
                await roomRepo.save(room);
                console.log(`Seeded room: ${room.name}`);
            }
        }

        const app = new Koa();
        const httpServer = createServer(app.callback());
        const io = new Server(httpServer, {
            cors: {
                origin: configChatFile.cors.origin,
                methods: configChatFile.cors.methods,
                allowedHeaders: configChatFile.cors.allowedHeaders,
                credentials: configChatFile.cors.credentials
            }
        });

        app.context.io = io;

        app.use(
            cors({
                origin: configChatFile.cors.origin,
                allowMethods: configChatFile.cors.methods,
                allowHeaders: configChatFile.cors.allowedHeaders,
                credentials: configChatFile.cors.credentials
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