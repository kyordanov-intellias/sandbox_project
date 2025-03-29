import Router from "@koa/router";
import { postsController } from "../controllers/posts.controller";
import { commentsController } from "../controllers/comments.controller";
import { Context } from "koa";

const router = new Router({ prefix: "/posts" });


router.get("/health", async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "Posts service is running",
  };
});

router.post("/", postsController.createPost);
router.get("/", postsController.getAllPosts);
router.get("/:id", postsController.getPost);
router.post("/:id/like", postsController.likePost);

router.get("/:postId/comments", commentsController.getPostComments);
router.post("/:postId/comments", commentsController.createComment);
router.put("/comments/:id", commentsController.updateComment);
router.delete("/comments/:id", commentsController.deleteComment);
router.get("/user/:authorId/comments", commentsController.getUserComments);

export { router as postsRouter };
