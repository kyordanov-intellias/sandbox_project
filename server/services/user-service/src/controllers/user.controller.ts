import { Context } from "koa";

export const getHealth = async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "User service is running",
  };
};

export const getUserById = async (ctx: Context) => {
  ctx.body = { message: "Get user by id endpoint (stub)" };
};

export const updateUserById = async (ctx: Context) => {
  ctx.body = { message: "Update user by id endpoint (stub)" };
};

export const deleteUserById = async (ctx: Context) => {
  ctx.body = { message: "Delete user by id endpoint (stub)" };
};

