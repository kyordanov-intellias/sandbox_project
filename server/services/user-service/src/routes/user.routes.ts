import Router from "koa-router";
import { Context } from "koa";

const router = new Router({
  prefix: "/users",
});

router.get("/health", async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "User service is running",
  };
});

export { router as userRouter };
