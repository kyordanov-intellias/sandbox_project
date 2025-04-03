import Router from "koa-router";
import { userController } from "../controllers/user.controller";
import { Context } from "koa";

const router = new Router({
  prefix: "/users",
});

router.get("/health", (ctx: Context) => {
  ctx.body = {
    status: "ok",
    message: "User service is running",
  };
});
router.get("/search", userController.searchUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

export { router as userRouter };
