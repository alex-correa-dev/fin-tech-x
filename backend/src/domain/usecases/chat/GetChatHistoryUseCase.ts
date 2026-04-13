import { IChatRepository } from '../../repositories/IChatRepository';

export interface ChatHistoryItem {
  id: number;
  question: string;
  answer: string;
  timestamp: Date;
}

export class GetChatHistoryUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(userId: number, limit: number = 50): Promise<ChatHistoryItem[]> {
    const messages = await this.chatRepository.findByUserId(userId, limit);

    return messages.map((msg) => ({
      id: msg.id,
      question: msg.question,
      answer: msg.answer,
      timestamp: msg.createdAt,
    }));
  }
}
