import Redis from "ioredis";
import { configAuthFile } from "./config";

const redis = new Redis({
  host: configAuthFile.redis.host || "redis",
  port: configAuthFile.redis.port || parseInt("6379"),
});

export default redis;
