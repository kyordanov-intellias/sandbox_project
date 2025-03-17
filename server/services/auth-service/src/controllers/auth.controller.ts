import { Context } from "koa";
import { userRepository } from "../repositories/user.repository";
import { configFile } from "../../config/config";
import jwt, { SignOptions } from "jsonwebtoken";
import { redisClient } from "../../config/redis";

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export class AuthController {
  async register(ctx: Context) {
    const { firstName, lastName, email, password } = ctx.request
      .body as RegisterRequest;

    const requiredFields = ["firstName", "lastName", "email", "password"];

    const validationFields = userRepository.validateRequestBody(
      ctx.request.body!,
      requiredFields
    );

    if (validationFields) {
      ctx.status = 400;
      ctx.body = validationFields;
      return;
    }

    try {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        ctx.status = 400;
        ctx.body = { error: "User already exists" };
        return;
      }

      const user = await userRepository.create(
        email,
        password,
        firstName,
        lastName
      );

      const { password: _, ...userWithoutPassword } = user;
      ctx.body = userWithoutPassword;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Error creating user" };
    }
  }

  async login(ctx: Context) {
    const { email, password } = ctx.request.body as LoginRequest;
    const requiredFields = ["email", "password"];

    const validationError = userRepository.validateRequestBody(
      ctx.request.body!,
      requiredFields
    );

    if (validationError) {
      ctx.status = 400;
      ctx.body = validationError;
      return;
    }

    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        ctx.status = 401;
        ctx.body = { error: "No such user with that email" };
        return;
      }

      const isValidPassword = await userRepository.validatePassword(
        user,
        password
      );
      if (!isValidPassword) {
        ctx.status = 401;
        ctx.body = { error: "Invalid password" };
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        configFile.jwt.secret,
        { expiresIn: configFile.jwt.expiresIn } as SignOptions
      );

      await redisClient.set(`auth_token:${user.id}`, token, "EX", 86400);

      ctx.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      ctx.body = { token };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Error during login" };
    }
  }

  async logout(ctx: Context) {
    ctx.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    ctx.body = { message: "Logged out successfully" };
  }

  async getUserByToken(ctx: Context) {
    try {
      const token = ctx.cookies.get("authToken");

      if (!token) {
        ctx.status = 401;
        ctx.body = { error: "Unauthorized - No token provided" };
        return;
      }

      let decoded;
      try {
        decoded = jwt.verify(token, configFile.jwt.secret) as {
          userId: number;
        };
      } catch (error) {
        ctx.status = 401;
        ctx.body = { error: "Unauthorized - Invalid token" };
        return;
      }

      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        ctx.status = 404;
        ctx.body = { error: "User not found" };
        return;
      }

      const { password, ...userWithoutPassword } = user;
      ctx.body = userWithoutPassword;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
    }
  }
}

export const authController = new AuthController();
