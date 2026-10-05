import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { validateGenerateReply, validateAnalyzeMessage } from '../middleware/validation';

const router = Router();

router.post('/generate-reply', validateGenerateReply, aiController.generateReply.bind(aiController));
router.post('/analyze-message', validateAnalyzeMessage, aiController.analyzeMessage.bind(aiController));

export default router;
