import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { configFile } from '../config/config';

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());


router.get('/health', async (ctx) => {
    ctx.body = { status: 'ok' };
});

router.all('/auth/(.*)', async (ctx) => {
    ctx.body = { message: 'Auth service route' };
});


const PORT = configFile.port;
app.listen(PORT, () => {
    console.log(`✅ Gateway service is running on port ${PORT}`);
});