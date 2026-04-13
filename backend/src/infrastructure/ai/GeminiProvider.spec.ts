import { GeminiProvider } from './GeminiProvider';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Mocked AI response'),
        },
      }),
    }),
  })),
}));

describe('GeminiProvider', () => {
  let geminiProvider: GeminiProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    geminiProvider = new GeminiProvider({
      apiKey: 'test-api-key',
      modelName: 'gemini-1.5-flash',
      temperature: 0.7,
      maxOutputTokens: 500,
    });
  });

  it('should ask question and get response', async () => {
    const question = 'What are your hours?';
    const answer = await geminiProvider.ask(question);

    expect(answer).toBeDefined();
    expect(typeof answer).toBe('string');
    expect(answer).toBe('Mocked AI response');
  });

  it('should ask question with context', async () => {
    const question = 'What are your hours?';
    const context = 'You are a FinTech assistant';

    const answer = await geminiProvider.ask(question, context);

    expect(answer).toBeDefined();
    expect(answer).toBe('Mocked AI response');
  });

  it('should return model name', () => {
    expect(geminiProvider.getModelName()).toBe('gemini-1.5-flash');
  });

  it('should return version', () => {
    expect(geminiProvider.getVersion()).toBe('1.5');
  });

  it('should handle errors gracefully', async () => {
    const mockGenerateContent = jest.fn().mockRejectedValue(new Error('API Error'));
    const mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    });

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    }));

    const errorProvider = new GeminiProvider({
      apiKey: 'test-api-key',
      modelName: 'gemini-1.5-flash',
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    await expect(errorProvider.ask('test')).rejects.toThrow('Erro ao processar pergunta na IA');
  });
});
