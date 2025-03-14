import Router from 'koa-router';
import { authController } from '../controllers/auth.controller';

const router = new Router({
  prefix: '/auth'
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', authController.test);

export { router as authRouter }; 