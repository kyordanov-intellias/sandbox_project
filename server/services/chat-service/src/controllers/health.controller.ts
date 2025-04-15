import { Context } from "koa";
import { AppDataSource } from "../db/data-source";

class HealthController {
    async checkHealth(ctx: Context) {
        try {
            const isDatabaseConnected = AppDataSource.isInitialized;
            
            ctx.body = {
                status: "ok",
                message: "Chat service is running",
                timestamp: new Date().toISOString(),
                services: {
                    database: isDatabaseConnected ? "connected" : "disconnected",
                    websocket: "active"
                }
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                status: "error",
                message: "Service health check failed",
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
}

export const healthController = new HealthController(); 