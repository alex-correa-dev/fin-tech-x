import { ChatMessage } from '../../entities/ChatMessage';
import { IChatRepository } from '../../repositories/IChatRepository';
import { IAIProvider } from '../../../application/ports/IAIProvider';
import { IChatResponse } from '../../../shared/types';

export interface AskQuestionInput {
  userId: number;
  question: string;
  userName?: string;
}

export class AskQuestionUseCase {
  private readonly SYSTEM_PROMPT: string;

  constructor(
    private chatRepository: IChatRepository,
    private aiProvider: IAIProvider,
    systemPrompt: string
  ) {
    this.SYSTEM_PROMPT = systemPrompt;
  }

  async execute(input: AskQuestionInput): Promise<IChatResponse> {
    const { userId, question, userName } = input;

    if (!question || question.trim().length === 0) {
      throw new Error('Pergunta não pode estar vazia');
    }

    const personalizedPrompt = userName
      ? `${this.SYSTEM_PROMPT}\n\nO cliente se chama ${userName}. Personalize a resposta usando o nome dele e seja amigável.`
      : this.SYSTEM_PROMPT;

    const answer = await this.aiProvider.ask(question, personalizedPrompt);

    const message = new ChatMessage(0, userId, question, answer);
    message.validate();

    await this.chatRepository.save(message);

    return {
      answer,
      timestamp: new Date().toISOString(),
      model: this.aiProvider.getModelName(),
    };
  }
}
