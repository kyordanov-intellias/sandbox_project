import Router from "@koa/router";
import { postsController } from "../controllers/posts.controller";
import { commentsController } from "../controllers/comments.controller";
import { Context } from "koa";
import { validateToken } from "../middlewares/auth.middleware";

const router = new Router({ prefix: "/posts" });

router.get("/health", async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "Posts service is running",
  };
});

router.post("/", validateToken, postsController.createPost);
router.get("/", postsController.getAllPosts);
router.get("/:id", postsController.getPost);
router.post("/:id/like", validateToken, postsController.likePost);
router.post("/:id/dislike", validateToken,postsController.dislikePost);
//TODO make repost fn -> like the likes
router.get("/:postId/comments", commentsController.getPostComments);
router.post("/:postId/comments", validateToken, commentsController.createComment);
router.put("/comments/:id",validateToken, commentsController.updateComment);
router.delete("/comments/:id", validateToken, commentsController.deleteComment);

export { router as postsRouter };
