import Redis from "ioredis";
import { configFile } from "./config";

const redisClient = new Redis({
  host: configFile.redis.host,
  port: configFile.redis.port,
});

redisClient.on("connect", () => {
  console.log(`✅ Redis is connected`);
});

redisClient.on("error", (error) => {
  console.log(`❌ Redis error - `, error);
});

export { redisClient };
