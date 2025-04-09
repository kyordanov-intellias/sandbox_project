import Redis from "ioredis";
import { configUserFile } from "./config";

const redisClient = new Redis({
  host: configUserFile.redis.host,
  port: configUserFile.redis.port,
});

export default redisClient;
