import { Post } from "../interfaces/postsInterfaces";
import { User } from "../interfaces/userInterfaces";

export const getAllPosts = async () => {
  const response = await fetch(`http://localhost:4000/posts`, {
    method: "GET",
    credentials: "include",
  });

  return response;
};

export const deletePost = async (postId: string) => {
  const response = await fetch(`http://localhost:4000/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

export const markPost = async (postId: string) => {
  const response = await fetch(`http://localhost:4000/posts/${postId}/mark`, {
    method: "PUT",
    credentials: "include",
  });

  return response;
};

export const commentPost = async (content: string, post: Post, user: User) => {
  const response = await fetch(
    `http://localhost:4000/posts/${post.id}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: content.trim(),
        postId: post.id,
        authorId: user.id,
        authorInfo: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          profileImage: user.profile?.profileImage,
          userRole: user.userRole,
        },
      }),
    }
  );

  return response;
};

export const updatePost = async (postId: string, content: string, imageUrl?: string) => {
  const response = await fetch(`http://localhost:4000/posts/edit/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      content,
      imageUrl: imageUrl || undefined,
    }),
  });

  return response;
};

export const likePost = async (postId: string, userId: string, isLiked: boolean) => {
  const action = isLiked ? "dislike" : "like";
  const response = await fetch(
    `http://localhost:4000/posts/${postId}/${action}?userId=${userId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  return response;
};
