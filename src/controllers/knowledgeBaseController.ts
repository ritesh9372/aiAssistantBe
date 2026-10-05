import { Request, Response, NextFunction } from 'express';
import { knowledgeBaseRepository } from '../repositories/knowledgeBaseRepository';

export class KnowledgeBaseController {
  async getBrands(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brands = await knowledgeBaseRepository.getBrands();
      res.status(200).json({ success: true, data: brands });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { brandId } = req.query;
      const items = await knowledgeBaseRepository.getAll(brandId as string | undefined);
      res.status(200).json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const item = await knowledgeBaseRepository.getById(id);
      if (!item) {
        res.status(404).json({ success: false, message: 'Knowledge item not found' });
        return;
      }
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { brandId, category, title, content } = req.body;
      if (!brandId || !category || !title || !content) {
        res.status(400).json({ success: false, message: 'All fields (brandId, category, title, content) are required.' });
        return;
      }
      const created = await knowledgeBaseRepository.create({ brandId, category, title, content });
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await knowledgeBaseRepository.update(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Knowledge item not found' });
        return;
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const success = await knowledgeBaseRepository.delete(id);
      res.status(200).json({ success, message: success ? 'Policy deleted' : 'Policy not found' });
    } catch (err) {
      next(err);
    }
  }
}

export const knowledgeBaseController = new KnowledgeBaseController();
