export class AskQuestionDTO {
  public readonly question: string;
  public readonly userId: number;
  public readonly userName?: string;

  constructor(data: { question: string; userId: number; userName?: string }) {
    this.question = data.question;
    this.userId = data.userId;
    this.userName = data.userName;
  }

  validate(): void {
    if (!this.question || this.question.trim().length === 0) {
      throw new Error('Pergunta é obrigatória');
    }

    if (!this.userId) {
      throw new Error('Usuário não identificado');
    }
  }
}

export class ChatResponseDTO {
  public readonly answer: string;
  public readonly timestamp: string;
  public readonly model: string;

  constructor(answer: string, timestamp: string, model: string) {
    this.answer = answer;
    this.timestamp = timestamp;
    this.model = model;
  }
}
