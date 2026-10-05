import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';

const router = Router();

router.get('/stats', dashboardController.getStats.bind(dashboardController));

export default router;
