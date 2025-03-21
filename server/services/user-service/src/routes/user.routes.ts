import Router from "koa-router";
import { getHealth, getUserById, updateUserById, deleteUserById } from "../controllers/user.controller";

const router = new Router({
  prefix: "/users",
});

router.get("/health", getHealth);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export { router as userRouter };
