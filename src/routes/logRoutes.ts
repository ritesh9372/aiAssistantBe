import { Router } from 'express';
import { logController } from '../controllers/logController';

const router = Router();

router.get('/', logController.getAll.bind(logController));
router.post('/', logController.create.bind(logController));

export default router;
