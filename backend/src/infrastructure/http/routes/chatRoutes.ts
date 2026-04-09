import { Router, Request, Response, NextFunction } from 'express';
import { ChatController } from '../../../interfaces/controllers/ChatController';

export const chatRoutes = (chatController: ChatController): Router => {
  const router = Router();

  router.post('/ask', (req: Request, res: Response, next: NextFunction) => {
    chatController.ask(req as any, res, next);
  });

  router.get('/history', (req: Request, res: Response, next: NextFunction) => {
    chatController.getHistory(req as any, res, next);
  });

  return router;
};