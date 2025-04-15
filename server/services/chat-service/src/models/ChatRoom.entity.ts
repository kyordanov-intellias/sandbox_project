import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Message } from './Message.entity';

@Entity('chat_rooms')
export class ChatRoom {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @OneToMany(() => Message, message => message.roomId)
    messages!: Message[];

    @CreateDateColumn()
    createdAt!: Date;
} 