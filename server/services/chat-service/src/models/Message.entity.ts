import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from '../types/user.types';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column()
    senderId!: string;

    @Column({ nullable: true })
    roomId!: number;

    @Column({ type: 'jsonb', nullable: true })
    senderInfo!: User;

    @CreateDateColumn()
    createdAt!: Date;
} 