import { IAIProvider } from '../ports/IAIProvider';

export class GeminiService {
  constructor(private aiProvider: IAIProvider) {}

  async askQuestion(question: string, context?: string): Promise<string> {
    return this.aiProvider.ask(question, context);
  }

  getModelInfo(): { name: string; version: string } {
    return {
      name: this.aiProvider.getModelName(),
      version: this.aiProvider.getVersion()
    };
  }
}