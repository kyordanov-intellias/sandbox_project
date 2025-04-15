import { User } from "./user.types";

export interface SocketEvents {
    'join_room': (roomId: number) => void;
    'leave_room': (roomId: number) => void;
    'send_message': (data: MessageData) => void;
    'typing': (data: TypingData) => void;
    
    'message_received': (message: MessageResponse) => void;
    'user_joined': (data: UserRoomData) => void;
    'user_left': (data: UserRoomData) => void;
    'typing_status': (data: TypingStatusData) => void;
    'error': (error: SocketError) => void;
}

export interface MessageData {
    content: string;
    roomId: number;
    senderId: string;
    senderInfo: User;
}

export interface MessageResponse {
    id: string;
    content: string;
    senderId: string;
    roomId: number;
    createdAt: Date;
    senderInfo?: User;
}

export interface UserRoomData {
    userId: string;
    roomId: number;
}

export interface TypingData {
    roomId: number;
    userId: string;
    isTyping: boolean;
}

export interface TypingStatusData {
    userId: string;
    isTyping: boolean;
}

export interface SocketError {
    message: string;
    code?: string;
    details?: any;
} 