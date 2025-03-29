import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
  } from "typeorm";
  import { Comment } from "./Comment.entity";
  
  @Entity("posts")
  export class Post {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column("uuid")
    authorId!: string;
  
    @Column("text")
    content!: string;
  
    @Column({ nullable: true })
    imageUrl?: string;
  
    @Column({ name: "likes_count", default: 0 })
    likesCount!: number;
  
    @Column({ name: "reposts_count", default: 0 })
    repostsCount!: number;
  
    @OneToMany(() => Comment, comment => comment.post)
    comments!: Comment[];
  
    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
  }