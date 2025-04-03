import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import proxy from "koa-proxies";
import { configFile } from "../config/config";

const app = new Koa();
const router = new Router();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  proxy("/auth", {
    target: "http://auth-service:4001",
    changeOrigin: true,
    logs: true,
  })
);

app.use(
  proxy("/users", {
    target: "http://user-service:4002",
    changeOrigin: true,
    logs: true,
  })
);

app.use(
  proxy("/posts", {
    target: "http://posts-service:4003",
    changeOrigin: true,
    logs: true,
  })
);

app.use(router.routes());
app.use(router.allowedMethods());

router.get("/health", async (ctx) => {
  ctx.body = {
    status: "ok",
    message: "Gateway service is running",
  };
});

const PORT = configFile.port;
app.listen(PORT, () => {
  console.log(`✅ Gateway service is running on port ${PORT}`);
});
