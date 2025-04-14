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
router.get("/:postId", postsController.getPost);
router.patch("/edit/:postId", postsController.updatePost);
router.delete("/:postId", validateToken, postsController.deletePost);

router.put("/:postId/mark", validateToken, postsController.toggleMarkByAdmin);

router.post("/:id/like", validateToken, postsController.likePost);
router.get("/liked/:userId", postsController.getLikedPostsByUser);
router.post("/:id/dislike", validateToken, postsController.dislikePost);

router.post("/:id/repost", validateToken, postsController.repostPost);
router.post("/:id/unrepost", validateToken, postsController.unrepostPost);
router.get("/reposted/:userId", postsController.getRepostedPostsByUser);

router.get("/:postId/comments", commentsController.getPostComments);
router.post(
  "/:postId/comments",
  validateToken,
  commentsController.createComment
);
router.put("/comments/:id", validateToken, commentsController.updateComment);
router.delete("/comments/:id", validateToken, commentsController.deleteComment);

export { router as postsRouter };
