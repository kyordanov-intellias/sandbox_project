import { Context } from "koa";
import { profileRepository } from "../repositories/profile.repository";
import redisClient from "../../config/redis";

export const getHealth = async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "User service is running",
  };
};

export class UserController {
  async getUserById(ctx: Context) {
    const { id } = ctx.params;
    const user = await profileRepository.findByAuthId(id);
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }

    ctx.body = user;
  }

  async searchUsers(ctx: Context) {
    const query = ctx.query.query ? String(ctx.query.query).trim() : "";
  
    if (!query) {
      ctx.status = 400;
      ctx.body = { message: "Query parameter is required" };
      return;
    }
  
    const parseNumber = (value: any): number | null => {
      const parsed = Number(value);
      return isNaN(parsed) ? null : parsed;
    };
  
    const rawLimit = parseNumber(ctx.query.limit);
    const rawOffset = parseNumber(ctx.query.offset);
  
    const safeLimit = rawLimit && rawLimit > 0 && rawLimit <= 50 ? rawLimit : 10;
    const safeOffset = rawOffset && rawOffset >= 0 ? rawOffset : 0;
  
    const cacheKey = `search:${query}:${safeLimit}:${safeOffset}`;
  
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        ctx.body = JSON.parse(cached);
        return;
      }
      const users = await profileRepository.searchUsers(
        query,
        safeLimit,
        safeOffset
      );
  
      await redisClient.set(cacheKey, JSON.stringify(users), "EX", 60); // 60s cache
      ctx.body = users;
    } catch (error) {
      console.error("Error in searchUsers:", error);
      ctx.status = 500;
      ctx.body = { message: "Internal server error" };
    }
  }
  

  async updateUserById(ctx: Context) {
    //TODO update users by id
    ctx.body = { message: "Update user by id endpoint (stub)" };
  }

  async deleteUserById(ctx: Context) {
    //TODO delete user by id
    ctx.body = { message: "Delete user by id endpoint (stub)" };
  }
}

export const userController = new UserController();
