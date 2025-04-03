import { Context, Request } from "koa";
import { postsController } from "../controllers/posts.controller";
import { postRepository } from "../repositories/posts.repository";
import { likeRepository } from "../repositories/like.repository";
import { CreatePostRequest, PostContext } from "../controllers/posts.controller";

jest.mock("../repositories/posts.repository");
jest.mock("../repositories/like.repository");

describe("PostsController", () => {
  let mockCtx: Partial<PostContext>;
  const mockPost = {
    id: "123",
    content: "Test post",
    authorId: "user123",
    authorInfo: {
      firstName: "John",
      lastName: "Doe",
      profileImage: "image.jpg",
      userRole: "user"
    },
    likesCount: 0,
    repostsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: []
  };

  beforeEach(() => {
    mockCtx = {
      request: {
        body: {} as CreatePostRequest
      } as Request & { body: CreatePostRequest },
      params: {},
      query: {},
      status: 200,
      body: {},
      cookies: {
        get: jest.fn().mockReturnValue('mock-token'),
        set: jest.fn(),
        secure: true,
        request: {} as any,
        response: {} as any
      },
      state: {
        user: {
          userId: 'user123',
          email: 'test@example.com'
        }
      }
    };
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("should create a post successfully", async () => {
      const postData: CreatePostRequest = {
        content: "Test post",
        authorId: "user123",
        authorInfo: {
          firstName: "John",
          lastName: "Doe",
          profileImage: "image.jpg",
          userRole: "user"
        }
      };
      mockCtx.request!.body = postData;
      (postRepository.create as jest.Mock).mockResolvedValue(mockPost);

      await postsController.createPost(mockCtx as PostContext);

      expect(mockCtx.status).toBe(201);
      expect(mockCtx.body).toEqual(mockPost);
      expect(postRepository.create).toHaveBeenCalledWith(postData);
    });

    it("should return 400 when required fields are missing", async () => {
      mockCtx.request!.body = {
        content: "Test post"
      } as CreatePostRequest;

      await postsController.createPost(mockCtx as PostContext);

      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body).toEqual({ error: "Missing required fields" });
      expect(postRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("getPost", () => {
    it("should return a post when found", async () => {
      mockCtx.params = { id: "123" };
      (postRepository.findById as jest.Mock).mockResolvedValue(mockPost);

      await postsController.getPost(mockCtx as Context);

      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body).toEqual(mockPost);
      expect(postRepository.findById).toHaveBeenCalledWith("123");
    });

    it("should return 404 when post is not found", async () => {
      mockCtx.params = { id: "123" };
      (postRepository.findById as jest.Mock).mockResolvedValue(null);

      await postsController.getPost(mockCtx as Context);

      expect(mockCtx.status).toBe(404);
      expect(mockCtx.body).toEqual({ error: "Post not found" });
    });
  });

  describe("likePost", () => {
    it("should like a post successfully", async () => {
      mockCtx.params = { id: "123" };
      mockCtx.query = { userId: "user123" };
      (likeRepository.findByPostAndUser as jest.Mock).mockResolvedValue(null);
      (likeRepository.create as jest.Mock).mockResolvedValue({});
      (postRepository.incrementLikes as jest.Mock).mockResolvedValue(mockPost);
      (postRepository.findById as jest.Mock).mockResolvedValue(mockPost);

      await postsController.likePost(mockCtx as Context);

      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body).toEqual({
        ...mockPost,
        isLikedByUser: true
      });
      expect(likeRepository.create).toHaveBeenCalledWith("123", "user123");
    });

    it("should return 400 when post is already liked", async () => {
      mockCtx.params = { id: "123" };
      mockCtx.query = { userId: "user123" };
      (likeRepository.findByPostAndUser as jest.Mock).mockResolvedValue({});

      await postsController.likePost(mockCtx as Context);

      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body).toEqual({ error: "Post already liked by user" });
      expect(likeRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("dislikePost", () => {
    it("should dislike a post successfully", async () => {
      mockCtx.params = { id: "123" };
      mockCtx.query = { userId: "user123" };
      (likeRepository.findByPostAndUser as jest.Mock).mockResolvedValue({});
      (likeRepository.delete as jest.Mock).mockResolvedValue({});
      (postRepository.decrementLikes as jest.Mock).mockResolvedValue(mockPost);
      (postRepository.findById as jest.Mock).mockResolvedValue(mockPost);

      await postsController.dislikePost(mockCtx as Context);

      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body).toEqual({
        ...mockPost,
        isLikedByUser: false
      });
      expect(likeRepository.delete).toHaveBeenCalledWith("123", "user123");
    });

    it("should return 400 when post is not liked", async () => {
      mockCtx.params = { id: "123" };
      mockCtx.query = { userId: "user123" };
      (likeRepository.findByPostAndUser as jest.Mock).mockResolvedValue(null);

      await postsController.dislikePost(mockCtx as Context);

      expect(mockCtx.status).toBe(400);
      expect(mockCtx.body).toEqual({ error: "Post not liked by user" });
      expect(likeRepository.delete).not.toHaveBeenCalled();
    });
  });
}); 