import { IAIProvider } from '../../application/ports/IAIProvider';
import { GeminiProvider } from './GeminiProvider';

export interface AIProviderConfig {
  type: 'gemini';
  apiKey: string;
  modelName: string;
}

export class AIProviderFactory {
  static create(config: AIProviderConfig): IAIProvider {
    switch (config.type) {
      case 'gemini':
        return new GeminiProvider({
          apiKey: config.apiKey,
          modelName: config.modelName,
          temperature: 0.7,
          maxOutputTokens: 500,
        });
      default:
        throw new Error(`Provider ${config.type} not supported`);
    }
  }
}
