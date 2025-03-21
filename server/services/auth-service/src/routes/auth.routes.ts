import Router from "koa-router";
import { authController } from "../controllers/auth.controller";
import { Context } from "koa";
import { checkBlacklist } from "../middlewares/checkBlacklist";

const router = new Router({
  prefix: "/auth",
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.getUserByToken);
router.post("/logout", checkBlacklist, authController.logout);
router.get("/health", async (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "Auth service is running",
  };
});
//make namespaces
router.get("/:email", authController.getUserByEmail);
router.delete("/:email", authController.deleteUserByEmail);

export { router as authRouter };
