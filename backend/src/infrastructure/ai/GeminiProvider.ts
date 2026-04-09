import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { IAIProvider } from '../../application/ports/IAIProvider';

interface GeminiConfig {
  apiKey: string;
  modelName: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export class GeminiProvider implements IAIProvider {
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;
  private modelName: string;

  constructor(config: GeminiConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.modelName = config.modelName;
    this.model = this.client.getGenerativeModel({
      model: config.modelName,
      generationConfig: {
        temperature: config.temperature || 0.7,
        maxOutputTokens: config.maxOutputTokens || 500,
      }
    });
  }

  async ask(question: string, context?: string): Promise<string> {
    try {
      const prompt = context 
        ? `${context}\n\nPergunta do usuário: ${question}`
        : question;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Erro ao processar pergunta na IA');
    }
  }

  getModelName(): string {
    return this.modelName;
  }

  getVersion(): string {
    return '1.5';
  }
}