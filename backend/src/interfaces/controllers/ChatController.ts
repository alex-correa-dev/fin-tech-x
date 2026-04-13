import { Request, Response, NextFunction } from 'express';
import { AskQuestionUseCase } from '../../domain/usecases/chat/AskQuestionUseCase';
import { GetChatHistoryUseCase } from '../../domain/usecases/chat/GetChatHistoryUseCase';
import { AskQuestionDTO } from '../../application/dtos/ChatDTO';
import { IApiResponse, IChatResponse, ITokenPayload } from '../../shared/types';

interface AuthenticatedRequest extends Request {
  user: ITokenPayload;
}

export class ChatController {
  constructor(
    private askQuestionUseCase: AskQuestionUseCase,
    private getHistoryUseCase: GetChatHistoryUseCase
  ) {}

  async ask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new AskQuestionDTO({
        question: req.body.question,
        userId: req.user.userId,
        userName: req.body.userName || req.user.name,
      });
      dto.validate();

      const result = await this.askQuestionUseCase.execute({
        userId: dto.userId,
        question: dto.question,
        userName: dto.userName,
      });

      const response: IApiResponse<IChatResponse> = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit as string) || 50;

      const history = await this.getHistoryUseCase.execute(userId, limit);

      const response: IApiResponse<typeof history> = {
        success: true,
        data: history,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
