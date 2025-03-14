import { Context } from 'koa';
import { userRepository } from '../repositories/user.repository';
import { configFile } from '../../config/config';
import jwt, { SignOptions } from 'jsonwebtoken';

interface RegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

export class AuthController {
    async register(ctx: Context) {
        const { email, password, firstName, lastName } = ctx.request.body as RegisterRequest;

        try {
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                ctx.status = 400;
                ctx.body = { error: 'User already exists' };
                return;
            }

            const user = await userRepository.create(email, password, firstName, lastName);

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;
            ctx.body = userWithoutPassword;

        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'Error creating user' };
        }
    }

    async login(ctx: Context) {
        const { email, password } = ctx.request.body as LoginRequest;

        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                ctx.status = 401;
                ctx.body = { error: 'Invalid credentials' };
                return;
            }

            const isValidPassword = await userRepository.validatePassword(user, password);
            if (!isValidPassword) {
                ctx.status = 401;
                ctx.body = { error: 'Invalid credentials' };
                return;
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                configFile.jwt.secret,
                { expiresIn: configFile.jwt.expiresIn } as SignOptions
            );

            ctx.body = { token };

        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'Error during login' };
        }
    }

    async test(ctx: Context) {
        ctx.body = { message: 'Auth service is running' };
    }
}

export const authController = new AuthController();