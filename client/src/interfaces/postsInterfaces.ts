export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  repostsCount: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}
