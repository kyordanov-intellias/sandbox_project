import { Context, ParameterizedContext } from "koa";
import { commentRepository } from "../repositories/comment.reposiroty";
import { postRepository } from "../repositories/posts.repository";

interface CreateCommentRequest {
  content: string;
  authorId: string;
  postId: string;
  authorInfo: {
    firstName: string;
    lastName: string;
    profileImage: string;
    userRole: string;
  };
}

interface UpdateCommentRequest {
  content: string;
}

interface CommentContext extends ParameterizedContext {
  request: Context["request"] & {
    body: CreateCommentRequest | UpdateCommentRequest;
  };
}

class CommentsController {
  async createComment(ctx: CommentContext) {
    const { content, authorId, postId, authorInfo } = ctx.request.body as CreateCommentRequest;

    if (!content || !authorId || !postId || !authorInfo) {
      ctx.status = 400;
      ctx.body = { error: "Missing required fields" };
      return;
    }

    try {
      const post = await postRepository.findById(postId);
      if (!post) {
        ctx.status = 404;
        ctx.body = { error: "Post not found" };
        return;
      }

      // TODO: check if authorId is a valid user and if the user is a valid user add his profile to the comment

      const comment = await commentRepository.create({
        content,
        authorId,
        postId,
        authorInfo
      });

      const updatedPost = await postRepository.findById(postId);

      ctx.status = 201;
      ctx.body = {
        comment,
        post: updatedPost
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: "Error creating comment",
        details: (error as Error).message,
      };
    }
  }

  async getPostComments(ctx: Context) {
    const { postId } = ctx.params;
    try {
      const comments = await commentRepository.findByPostId(postId);
      ctx.body = comments;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: "Error fetching comments",
        details: (error as Error).message,
      };
    }
  }

  async updateComment(ctx: CommentContext) {
    const { id } = ctx.params;
    const { content } = ctx.request.body as UpdateCommentRequest; //TODO typeguard

    if (!content) {
      ctx.status = 400;
      ctx.body = { error: "Content is required" };
      return;
    }

    try {
      const comment = await commentRepository.update(id, content);
      if (!comment) {
        ctx.status = 404;
        ctx.body = { error: "Comment not found" };
        return;
      }
      ctx.body = comment;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Error updating comment" };
    }
  }

  async deleteComment(ctx: Context) {
    const { id } = ctx.params;
    try {
      const deleted = await commentRepository.delete(id);
      if (!deleted) {
        ctx.status = 404;
        ctx.body = { error: "Comment not found" };
        return;
      }
      ctx.status = 204;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Error deleting comment" };
    }
  }

  async getUserComments(ctx: Context) {
    const { authorId } = ctx.params;
    try {
      const comments = await commentRepository.findByAuthorId(authorId);
      ctx.body = comments;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Error fetching user comments" };
    }
  }
}

export const commentsController = new CommentsController();
