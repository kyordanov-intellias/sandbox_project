import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from "typeorm";
  import { Post } from "./Post.entity";
  
  @Entity("comments")
  export class Comment {
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
  
    @Column("uuid", { name: "post_id" })
    postId!: string;
  
    @ManyToOne(() => Post, post => post.comments)
    @JoinColumn({ name: "post_id" })
    post!: Post;
  
    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
  }