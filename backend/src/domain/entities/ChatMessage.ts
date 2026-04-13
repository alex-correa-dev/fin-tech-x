import { IChatMessage } from '../../shared/types';

export class ChatMessage implements IChatMessage {
  public readonly id: number;
  public readonly userId: number;
  public readonly question: string;
  public readonly answer: string;
  public readonly createdAt: Date;

  constructor(id: number, userId: number, question: string, answer: string, createdAt?: Date) {
    this.id = id;
    this.userId = userId;
    this.question = question;
    this.answer = answer;
    this.createdAt = createdAt || new Date();
  }

  public validate(): void {
    if (!this.question || this.question.trim().length === 0) {
      throw new Error('Pergunta não pode estar vazia');
    }

    if (!this.answer || this.answer.trim().length === 0) {
      throw new Error('Resposta não pode estar vazia');
    }
  }

  public toJSON(): Omit<IChatMessage, 'userId'> {
    return {
      id: this.id,
      question: this.question,
      answer: this.answer,
      createdAt: this.createdAt,
    };
  }
}
