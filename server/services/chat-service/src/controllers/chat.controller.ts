import { Context } from "koa";
import { chatRepository } from "../repositories/chat.repository";
import { ChatRoom } from "../models/ChatRoom.entity";

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
}

export const chatController = new ChatController(); 