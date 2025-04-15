import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { configChatFile } from '../../config/config';

export const validateToken = async (ctx: Context, next: Next) => {
    try {
        const token = ctx.headers.authorization?.split(' ')[1];
        
        if (!token) {
            ctx.status = 401;
            ctx.body = { error: 'No token provided' };
            return;
        }

        const decoded = jwt.verify(token, configChatFile.jwt.secret);
        ctx.state.user = decoded;
        
        await next();
    } catch (error) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid token' };
    }
}; 