import { Context } from "koa";
import { profileRepository } from "../repositories/profile.repository";
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
    const query = ctx.query.query ? String(ctx.query.query) : "";
  
    if (!query.trim()) {
      ctx.status = 400;
      ctx.body = { message: "Query parameter is required" };
      return;
    }
  
    const safeLimit = Number(ctx.query.limit) > 0 ? Number(ctx.query.limit) : 10;
    const safeOffset = Number(ctx.query.offset) >= 0 ? Number(ctx.query.offset) : 0;
  
    const users = await profileRepository.searchUsers(query, safeLimit, safeOffset);
    ctx.body = users;
  }

  async updateUserById(ctx: Context) {
    ctx.body = { message: "Update user by id endpoint (stub)" };
  }

  async deleteUserById(ctx: Context) {
    ctx.body = { message: "Delete user by id endpoint (stub)" };
  }
}

export const userController = new UserController();
