import { AppDataSource } from "../db/data-source";
import { ChatRoom } from "../models/ChatRoom.entity";
import { Message } from "../models/Message.entity";
import { User } from "../types/user.types";

class ChatRepository {
    private roomRepository = AppDataSource.getRepository(ChatRoom);
    private messageRepository = AppDataSource.getRepository(Message);

    async createRoom(roomData: Partial<ChatRoom>): Promise<ChatRoom> {
        const room = this.roomRepository.create(roomData);
        return await this.roomRepository.save(room);
    }

    async getAllRooms(): Promise<ChatRoom[]> {
        return await this.roomRepository.find();
    }

    async getRoomById(id: number): Promise<ChatRoom | null> {
        return await this.roomRepository.findOne({
            where: { id }
        });
    }

    async createMessage(messageData: Partial<Message> & { senderInfo: User }): Promise<Message> {
        const message = this.messageRepository.create(messageData);
        return await this.messageRepository.save(message);
    }

    async getRoomMessages(roomId: number): Promise<Message[]> {
        return await this.messageRepository.find({
            where: { roomId },
            order: { createdAt: 'ASC' }
        });
    }

    async getMessageById(messageId: string): Promise<Message | null> {
        return await this.messageRepository.findOne({
            where: { id: messageId }
        });
    }

    async updateMessage(messageId: string, content: string): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: { id: messageId }
        });

        if (!message) {
            throw new Error('Message not found');
        }

        message.content = content;
        return await this.messageRepository.save(message);
    }

    async deleteMessage(messageId: string): Promise<void> {
        const message = await this.messageRepository.findOne({
            where: { id: messageId }
        });

        if (!message) {
            throw new Error('Message not found');
        }

        await this.messageRepository.remove(message);
    }
}

export const chatRepository = new ChatRepository(); 