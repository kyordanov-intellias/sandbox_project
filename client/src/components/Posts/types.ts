export interface User {
  id: string;
  name: string;
  avatar: string;
  role: "administrator" | "participant" | "mentor";
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  image?: string;
  author: User;
  likes: number;
  comments: Comment[];
  reposts: number;
  createdAt: string;
}
