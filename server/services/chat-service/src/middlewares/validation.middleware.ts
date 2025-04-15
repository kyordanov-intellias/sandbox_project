import { Context, Next } from 'koa';
import { MessageData } from '../types/socket.types';

export const validateMessage = async (ctx: Context, next: Next) => {
    const messageData = ctx.request.body as MessageData;

    if (!messageData.content || typeof messageData.content !== 'string') {
        ctx.status = 400;
        ctx.body = { error: 'Message content is required and must be a string' };
        return;
    }

    if (!messageData.roomId || typeof messageData.roomId !== 'number') {
        ctx.status = 400;
        ctx.body = { error: 'Room ID is required and must be a number' };
        return;
    }

    if (!messageData.senderId || typeof messageData.senderId !== 'number') {
        ctx.status = 400;
        ctx.body = { error: 'Sender ID is required and must be a number' };
        return;
    }

    if (messageData.content.length > 1000) {
        ctx.status = 400;
        ctx.body = { error: 'Message content cannot exceed 1000 characters' };
        return;
    }

    await next();
};

export const validateRoom = async (ctx: Context, next: Next) => {
    const roomData = ctx.request.body as { name: string };

    if (!roomData.name || typeof roomData.name !== 'string') {
        ctx.status = 400;
        ctx.body = { error: 'Room name is required and must be a string' };
        return;
    }

    if (roomData.name.length < 3 || roomData.name.length > 50) {
        ctx.status = 400;
        ctx.body = { error: 'Room name must be between 3 and 50 characters' };
        return;
    }

    await next();
}; 