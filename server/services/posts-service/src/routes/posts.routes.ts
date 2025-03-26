import Router from "koa-router";
import { Context } from "koa";

const router = new Router({
  prefix: "/posts",
});

router.get("/health", async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "Posts service is running",
  };
});

router.get("/", (ctx: Context) => {
  ctx.body = {
    message:'All posts in one place'
  };
});

export { router as postsRouter };
