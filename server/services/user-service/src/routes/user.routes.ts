import Router from "koa-router";
import { getHealth, createUserProfile } from "../controllers/user.controller";

const router = new Router({
  prefix: "/users",
});

router.get("/health", getHealth);
router.post("/", createUserProfile);

export { router as userRouter };
