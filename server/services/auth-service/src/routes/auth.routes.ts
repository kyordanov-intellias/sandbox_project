import Router from "koa-router";
import { authController } from "../controllers/auth.controller";
import { Context } from "koa";
const router = new Router({
  prefix: "/auth",
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.getUserByToken);
router.post("/logout", authController.logout);

router.get("/health", async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "Auth service is running",
  };
});

export { router as authRouter };
