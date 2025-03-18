import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import "reflect-metadata";
import { userRouter } from "./routes/user.routes";

const app = new Koa();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

const PORT = process.env.USER_SERVICE_PORT || 4002;
app.listen(PORT, () => {
  console.log(`✅ User service running on port ${PORT}`);
});
