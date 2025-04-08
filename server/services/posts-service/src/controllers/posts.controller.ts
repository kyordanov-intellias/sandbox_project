import { Context, ParameterizedContext } from "koa";
import { postRepository } from "../repositories/posts.repository";
import { likeRepository } from "../repositories/like.repository";
import { Post } from "../models/Post.entity";

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

export interface PostContext extends ParameterizedContext {
  request: Context["request"] & { body: CreatePostRequest };
}

class PostsController {
  async createPost(ctx: PostContext) {
    const { content, imageUrl, authorInfo } = ctx.request.body;
    const userId = ctx.state.user.userId;

    if (!content || !authorInfo) {
      ctx.status = 400;
      ctx.body = { error: "Missing required fields" };
      return;
    }

    try {
      const post = await postRepository.create({
        content,
        imageUrl,
        authorId: userId,
        authorInfo,
      });

      ctx.status = 201;
      ctx.body = post;
    } catch (error) {
      console.error("Error creating post:", error);
      ctx.status = 500;
      ctx.body = {
        error: "Error creating post",
        details: (error as Error).message,
      };
    }
  }

  async getPost(ctx: Context) {
    const { postId } = ctx.params;
    try {
      const post = await postRepository.findById(postId);
      if (!post) {
        ctx.status = 404;
        ctx.body = { error: "Post not found" };
        return;
      }
      ctx.body = post;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: "Error fetching post",
        details: (error as Error).message,
      };
    }
  }

  async getAllPosts(ctx: Context) {
    try {
      const { userId } = ctx.query;
      const posts = await postRepository.getAllPosts();

      if (userId) {
        const likes = await likeRepository.findByUserId(userId as string);
        const likedPostIds = likes.map((like) => like.postId);

        ctx.body = posts.map((post) => ({
          ...post,
          isLikedByUser: likedPostIds.includes(post.id),
          isMarkedVByAdmin: post.isMarkedByAdmin,
        }));
      } else {
        ctx.body = posts.map((post) => ({
          ...post,
          isMarkedVByAdmin: post.isMarkedByAdmin,
        }));
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Error fetching posts" };
    }
  }

  async likePost(ctx: Context) {
    const { id } = ctx.params;
    const userId = ctx.query.userId;
  
    if (typeof userId !== "string" || !userId.trim()) {
      ctx.status = 400;
      ctx.body = { error: "Valid userId is required" };
      return;
    }
  
    try {
      const existingLike = await likeRepository.findByPostAndUser(id, userId);
  
      if (existingLike) {
        ctx.status = 400;
        ctx.body = { error: "Post already liked by user" };
        return;
      }
  
      await likeRepository.create(id, userId);
      const post = await postRepository.incrementLikes(id);
  
      if (!post) {
        ctx.status = 404;
        ctx.body = { error: "Post not found" };
        return;
      }
  
      const postWithLikes = await postRepository.findById(id);
      ctx.body = {
        ...postWithLikes,
        isLikedByUser: true,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: "Error liking post",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
  

  async dislikePost(ctx: Context) {
    const { id } = ctx.params;
    const userId = ctx.query.userId;
  
    if (typeof userId !== "string" || !userId.trim()) {
      ctx.status = 400;
      ctx.body = { error: "Valid userId is required" };
      return;
    }
  
    try {
      const existingLike = await likeRepository.findByPostAndUser(id, userId);
  
      if (!existingLike) {
        ctx.status = 400;
        ctx.body = { error: "Post not liked by user" };
        return;
      }
  
      await likeRepository.delete(id, userId);
      const post = await postRepository.decrementLikes(id);
  
      if (!post) {
        ctx.status = 404;
        ctx.body = { error: "Post not found" };
        return;
      }
  
      const postWithLikes = await postRepository.findById(id);
      ctx.body = {
        ...postWithLikes,
        isLikedByUser: false,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: "Error unliking post",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async toggleMarkByAdmin(ctx: Context) {
    try {
      const postId = ctx.params.postId;
      const post = await postRepository.findById(postId);

      if (!post) {
        ctx.status = 404;
        ctx.body = { error: "Post not found" };
        return;
      }

      post.isMarkedByAdmin = !post.isMarkedByAdmin;
      const updatedPost = await postRepository.save(post);

      ctx.body = updatedPost;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Failed to toggle marked status" };
    }
  }

  async updatePost(ctx: Context) {
    const { postId } = ctx.params;
    const updates = ctx.request.body as Partial<Post>;;

    try {
      const updatedPost = await postRepository.update(postId, updates);

      if (!updatedPost) {
        ctx.status = 404;
        ctx.body = { message: `Post with id ${postId} not found.` };
        return;
      }

      ctx.body = updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      ctx.status = 500;
      ctx.body = { message: "Failed to update post" };
    }
  }

  async deletePost(ctx: Context) {
    const { postId } = ctx.params;

    try {
      const success = await postRepository.delete(postId);

      if (!success) {
        ctx.status = 404;
        ctx.body = { message: `Post with id ${postId} not found` };
        return;
      }

      ctx.status = 200;
      ctx.body = {
        message: `Post with id ${postId} has been deleted`,
      };
    } catch (error) {
      console.error("Error deleting post:", error);
      ctx.status = 500;
      ctx.body = {
        message: "An error occurred while deleting the post",
      };
    }
  }
}

export const postsController = new PostsController();
