import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { AppDataSource } from './db/data-source';
import { authRouter } from './routes/auth.routes';
import { configFile } from '../config/config';

const app = new Koa();

app.use(cors());
app.use(bodyParser());

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

AppDataSource.initialize()
  .then(() => {
    const PORT = configFile.port;
    app.listen(PORT, () => {
      console.log(`✅ Database connected`);
      console.log(`✅ Auth service is running on port ${PORT}`);

    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  }); 