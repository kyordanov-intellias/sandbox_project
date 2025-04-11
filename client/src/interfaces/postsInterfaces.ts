interface AuthorInfo {
  firstName: string;
  lastName: string;
  profileImage: string;
  userRole: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorInfo: AuthorInfo;
  content: string;
  imageUrl?: string;
  likesCount: number;
  repostsCount: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  isLikedByUser?: boolean;
  isMarkedByAdmin?: boolean;
  isRepostedByUser?: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  authorInfo: AuthorInfo;
  content: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  authorId: string;
  authorInfo: {
    firstName: string;
    lastName: string;
    profileImage: string;
    userRole: string;
  };
}
