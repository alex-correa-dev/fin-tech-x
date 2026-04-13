import { Router, Request, Response, NextFunction } from 'express';
import { ChatController } from '../../../interfaces/controllers/ChatController';
import { ITokenPayload } from '../../../shared/types';

interface AuthenticatedRequest extends Request {
  user: ITokenPayload;
}

export const chatRoutes = (chatController: ChatController): Router => {
  const router = Router();

  router.post('/ask', (req: Request, res: Response, next: NextFunction) => {
    chatController.ask(req as AuthenticatedRequest, res, next);
  });

  router.get('/history', (req: Request, res: Response, next: NextFunction) => {
    chatController.getHistory(req as AuthenticatedRequest, res, next);
  });

  return router;
};
