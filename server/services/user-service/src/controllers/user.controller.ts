import { Context } from "koa";

export const getHealth = async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "User service is running",
  };
};

export const createUserProfile = async (ctx: Context) => {
  ctx.body = { message: "Create user profile endpoint (stub)" };
};
