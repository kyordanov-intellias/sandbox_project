import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import "reflect-metadata";
import { userRouter } from "./routes/user.routes";
import { AppDataSource } from "./db/data-source";
import { configFile } from "../config/config";

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

AppDataSource.initialize()
  .then(() => {
    const PORT = configFile.port || 4002;
    app.listen(PORT, () => {
      console.log(`✅ User service connected to DB`);
      console.log(`✅ User service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error connecting to database:", error);
  });
