import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { Post } from "./Post.entity";

@Entity("reposts")
@Unique(["postId", "userId"])
export class Repost {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @Column("uuid", { name: "post_id" })
  postId!: string;

  @ManyToOne(() => Post, (post) => post.repostsCount, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "post_id" })
  post!: Post;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
