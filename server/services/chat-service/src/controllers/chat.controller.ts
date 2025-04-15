import { Context } from "koa";
import { chatRepository } from "../repositories/chat.repository";
import { ChatRoom } from "../models/ChatRoom.entity";
import { Message } from "../models/Message.entity";

class ChatController {
    async createRoom(ctx: Context) {
        try {
            const roomData = ctx.request.body as Partial<ChatRoom>;
            const room = await chatRepository.createRoom(roomData);
            ctx.body = room;
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                error: "Error creating chat room",
                details: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }

    async getAllRooms(ctx: Context) {
        try {
            const rooms = await chatRepository.getAllRooms();
            ctx.body = rooms;
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                error: "Error fetching chat rooms",
                details: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }

    async getRoom(ctx: Context) {
        try {
            const { id } = ctx.params;
            const room = await chatRepository.getRoomById(parseInt(id));
            
            if (!room) {
                ctx.status = 404;
                ctx.body = { error: "Chat room not found" };
                return;
            }
            
            ctx.body = room;
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                error: "Error fetching chat room",
                details: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }

    async getRoomMessages(ctx: Context) {
        try {
            const { roomId } = ctx.params;
            const messages = await chatRepository.getRoomMessages(parseInt(roomId));
            ctx.body = messages;
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                error: "Error fetching messages",
                details: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }

    async updateMessage(ctx: Context) {
        try {
            const { messageId } = ctx.params;
            const { content } = ctx.request.body as { content: string };
            const userId = ctx.state.user?.userId;

            if (!userId) {
                ctx.status = 401;
                ctx.body = { error: "Unauthorized: User not authenticated" };
                return;
            }

            const message = await chatRepository.getMessageById(messageId);
            if (!message) {
                ctx.status = 404;
                ctx.body = { error: "Message not found" };
                return;
            }

            if (message.senderId !== userId) {
                ctx.status = 403;
                ctx.body = { error: "You can only edit your own messages" };
                return;
            }

            const updatedMessage = await chatRepository.updateMessage(messageId, content);
            ctx.body = updatedMessage;

            const io = ctx.app.context.io;
            if (io && message.roomId) {
                io.to(`room:${message.roomId}`).emit('message_edited', {
                    messageId,
                    content: updatedMessage.content
                });
            }
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                error: "Error updating message",
                details: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }

    async deleteMessage(ctx: Context) {
        try {
            const { messageId } = ctx.params;
            const userId = ctx.state.user?.userId;

            if (!userId) {
                ctx.status = 401;
                ctx.body = { error: "Unauthorized: User not authenticated" };
                return;
            }

            const message = await chatRepository.getMessageById(messageId);
            if (!message) {
                ctx.status = 404;
                ctx.body = { error: "Message not found" };
                return;
            }

            if (message.senderId !== userId) {
                ctx.status = 403;
                ctx.body = { error: "You can only delete your own messages" };
                return;
            }

            await chatRepository.deleteMessage(messageId);

            const io = ctx.app.context.io;
            if (io && message.roomId) {
                io.to(`room:${message.roomId}`).emit('message_deleted', { messageId });
            }

            ctx.status = 204;
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                error: "Error deleting message",
                details: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
}

export const chatController = new ChatController(); 