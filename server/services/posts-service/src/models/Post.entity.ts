import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Comment } from "./Comment.entity";
import { Like } from "./Like.entity";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  authorId!: string;

  @Column("jsonb")
  authorInfo!: {
    firstName: string;
    lastName: string;
    profileImage: string;
    userRole: string;
  };

  @Column("text")
  content!: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => Comment, (comment) => comment.post, {
    eager: true,
  })
  @JoinColumn()
  comments!: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];

  @Column({ name: "likes_count", default: 0 })
  likesCount!: number;

  @Column({ name: "reposts_count", default: 0 })
  repostsCount!: number;

  @Column({ name: "is_marked_by_admin", default: false })
  isMarkedByAdmin!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  hasLikedBy(userId: string): boolean {
    return this.likes?.some((like) => like.userId === userId) || false;
  }
}
