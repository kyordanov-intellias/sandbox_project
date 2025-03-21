import { Context, Next } from "koa";
import redis from "../../config/redis";

export async function checkBlacklist(ctx: Context, next: Next) {
  const token = ctx.headers.authorization?.split(" ")[1];

  if (token) {
    const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
      ctx.status = 401;
      ctx.body = { message: "Token has been revoked" };
      return;
    }
  }

  await next();
}
