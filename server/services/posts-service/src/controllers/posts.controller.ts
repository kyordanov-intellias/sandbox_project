import { Context, ParameterizedContext } from "koa";
import { postRepository } from "../repositories/posts.repository";

interface CreatePostRequest {
    content: string;
    imageUrl?: string;
    authorId: string;
}

interface CreateCommentRequest {
    content: string;
    authorId: string;
}

interface PostContext extends ParameterizedContext {
    request: Context["request"] & { body: CreatePostRequest };
}

class PostsController {
    async createPost(ctx: PostContext) {
        const { content, imageUrl, authorId } = ctx.request.body;

        const requiredFields = ["content", "authorId"];
        if (!content || !authorId) {
            ctx.status = 400;
            ctx.body = { error: "Missing required fields" };
            return;
        }

        try {
            const post = await postRepository.create({
                content,
                imageUrl,
                authorId,
            });

            ctx.status = 201;
            ctx.body = post;
        } catch (error) {
            console.error('Error creating post:', error);
            ctx.status = 500;
            ctx.body = { error: "Error creating post", details: (error as Error).message };
        }
    }

    async getPost(ctx: Context) {
        const { id } = ctx.params;
        try {
            const post = await postRepository.findById(id);
            if (!post) {
                ctx.status = 404;
                ctx.body = { error: "Post not found" };
                return;
            }
            ctx.body = post;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: "Error fetching post" };
        }
    }

    async getAllPosts(ctx: Context) {
        try {
            const posts = await postRepository.getAllPosts();
            ctx.body = posts;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: "Error fetching posts" };
        }
    }

    async likePost(ctx: Context) {
        const { id } = ctx.params;
        try {
            const post = await postRepository.incrementLikes(id);
            if (!post) {
                ctx.status = 404;
                ctx.body = { error: "Post not found" };
                return;
            }
            ctx.body = post;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: "Error liking post", details: (error as Error).message };
        }
    }
}

export const postsController = new PostsController();