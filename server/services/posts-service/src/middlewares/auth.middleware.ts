import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import { configPostsFile } from "../../config/config";

export async function validateToken(ctx: Context, next: Next) {
  const token = ctx.cookies.get("authToken");

  if (!token) {
    ctx.status = 401;
    ctx.body = { 
      error: "Authentication required",
      message: "Please log in to continue",
      code: "NO_TOKEN"
    };
    return;
  }

  try {
    const decoded = jwt.verify(token, configPostsFile.jwt.secret) as {
      userId: string;
      email: string;
    };
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { 
      error: "Invalid session",
      message: "Your session has expired. Please log in again",
      code: "INVALID_TOKEN"
    };
  }
} 