import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import 'reflect-metadata';

const app = new Koa();
const router = new Router();

router.get('/users/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    service: 'user-service',
    timestamp: new Date().toISOString()
  };
});

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173' 
}));
app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.USER_SERVICE_PORT || 4002;
app.listen(PORT, () => {
  console.log(`✅ User service running on port ${PORT}`);
});
