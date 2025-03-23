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
    const user = await profileRepository.findByAuthId(id, {
      relations: ['skills', 'contacts']
    });

    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }

    ctx.body = user;
  };

  async updateUserById(ctx: Context) {
    ctx.body = { message: "Update user by id endpoint (stub)" };
  }

  async deleteUserById(ctx: Context) {
    ctx.body = { message: "Delete user by id endpoint (stub)" };
  }
}

export const userController = new UserController();
