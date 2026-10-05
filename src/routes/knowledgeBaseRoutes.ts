import { Router } from 'express';
import { knowledgeBaseController } from '../controllers/knowledgeBaseController';

const router = Router();

router.get('/brands', knowledgeBaseController.getBrands.bind(knowledgeBaseController));
router.get('/', knowledgeBaseController.getAll.bind(knowledgeBaseController));
router.get('/:id', knowledgeBaseController.getById.bind(knowledgeBaseController));
router.post('/', knowledgeBaseController.create.bind(knowledgeBaseController));
router.put('/:id', knowledgeBaseController.update.bind(knowledgeBaseController));
router.delete('/:id', knowledgeBaseController.delete.bind(knowledgeBaseController));

export default router;
