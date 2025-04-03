import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique
} from "typeorm";
import { Post } from "./Post.entity";

@Entity("likes")
@Unique(["postId", "userId"])
export class Like {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid")
    userId!: string;

    @Column("uuid", { name: "post_id" })
    postId!: string;

    @ManyToOne(() => Post, post => post.likesCount)
    @JoinColumn({ name: "post_id" })
    post!: Post;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
}