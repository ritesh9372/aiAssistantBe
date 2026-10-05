import { Router } from 'express';
import { conversationController } from '../controllers/conversationController';

const router = Router();

router.get('/', conversationController.getAll.bind(conversationController));
router.get('/:id', conversationController.getById.bind(conversationController));
router.post('/:id/reply', conversationController.reply.bind(conversationController));

export default router;
