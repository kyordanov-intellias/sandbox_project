import Router from '@koa/router';
import { chatController } from '../controllers/chat.controller';
import { healthController } from '../controllers/health.controller';
import { validateToken } from '../middlewares/auth-chat.middleware';
import { validateRoom } from '../middlewares/validation.middleware';

const router = new Router({ prefix: '/chat' });

router.get('/health', healthController.checkHealth);

router.post('/rooms', validateToken, validateRoom, chatController.createRoom);
router.get('/rooms', chatController.getAllRooms);
router.get('/rooms/:id', chatController.getRoom);
router.get('/rooms/:roomId/messages', chatController.getRoomMessages);

router.patch('/messages/:messageId', validateToken, chatController.updateMessage);
router.delete('/messages/:messageId', validateToken, chatController.deleteMessage);

export default router; 