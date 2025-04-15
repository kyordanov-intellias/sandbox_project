import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { configChatFile } from '../../config/config';

export const validateToken = async (ctx: Context, next: Next) => {
    try {
        const token = ctx.cookies.get('authToken');
        
        if (!token) {
            ctx.status = 401;
            ctx.body = { error: 'No token provided' };
            return;
        }

        const decoded = jwt.verify(token, configChatFile.jwt.secret);
        console.log('Decoded token:', decoded);
        ctx.state.user = decoded;
        
        await next();
    } catch (error) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid token' };
    }
}; 