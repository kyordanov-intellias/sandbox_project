import { Server, Socket } from 'socket.io';
import { chatRepository } from '../repositories/chat.repository';
import { MessageData, TypingData } from '../types/socket.types';
import { User } from '../types/user.types';

export const setupSocketHandlers = (io: Server) => {
    const roomUsers: Map<number, Map<string, string>> = new Map();

    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);
        
        socket.on('join_room', async (roomId: number, username?: string) => {
            try {
                if (typeof roomId !== 'number') {
                    socket.emit('error', { message: 'Invalid room ID' });
                    return;
                }

                socket.join(`room:${roomId}`);
                console.log(`User ${socket.id} joined room ${roomId}`);

                if (username) {
                    if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Map());
                    roomUsers.get(roomId)!.set(socket.id, username);
                }
                
                socket.to(`room:${roomId}`).emit('user_joined', {
                    userId: socket.id,
                    username: username || 'Unknown',
                    roomId
                });
            } catch (error) {
                socket.emit('error', {
                    message: 'Failed to join room',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });

        socket.on('leave_room', (roomId: number) => {
            try {
                if (typeof roomId !== 'number') {
                    socket.emit('error', { message: 'Invalid room ID' });
                    return;
                }

                socket.leave(`room:${roomId}`);
                console.log(`User ${socket.id} left room ${roomId}`);

                let username = 'Unknown';
                if (roomUsers.has(roomId)) {
                    const userMap = roomUsers.get(roomId)!;
                    username = userMap.get(socket.id) || 'Unknown';
                    userMap.delete(socket.id);
                }
                
                socket.to(`room:${roomId}`).emit('user_left', {
                    userId: socket.id,
                    username,
                    roomId
                });
            } catch (error) {
                socket.emit('error', {
                    message: 'Failed to leave room',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });

        socket.on('send_message', async (data: MessageData & { senderInfo: User }) => {
            try {
                if (!data.content || typeof data.content !== 'string') {
                    socket.emit('error', { message: 'Invalid message content' });
                    return;
                }

                if (!data.roomId || typeof data.roomId !== 'number') {
                    socket.emit('error', { message: 'Invalid room ID' });
                    return;
                }

                if (!data.senderId || typeof data.senderId !== 'string') {
                    socket.emit('error', { message: 'Invalid sender ID' });
                    return;
                }

                if (!data.senderInfo || typeof data.senderInfo !== 'object') {
                    socket.emit('error', { message: 'Invalid sender info' });
                    return;
                }

                if (data.content.length > 1000) {
                    socket.emit('error', { message: 'Message too long' });
                    return;
                }

                const message = await chatRepository.createMessage({
                    content: data.content,
                    senderId: data.senderId,
                    roomId: data.roomId,
                    senderInfo: data.senderInfo
                });

                io.to(`room:${data.roomId}`).emit('message_received', {
                    id: message.id,
                    content: message.content,
                    senderId: message.senderId,
                    roomId: message.roomId,
                    senderInfo: message.senderInfo,
                    createdAt: message.createdAt
                });
            } catch (error) {
                socket.emit('error', {
                    message: 'Failed to send message',
                    details: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}; 