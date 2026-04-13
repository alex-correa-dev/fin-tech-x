import { AskQuestionUseCase } from './AskQuestionUseCase';
import { ChatMessage } from '../../entities/ChatMessage';

const mockChatRepository = {
  save: jest.fn(),
  findByUserId: jest.fn(),
  findById: jest.fn(),
  deleteOldMessages: jest.fn(),
  deleteAll: jest.fn(),
};

const mockAIProvider = {
  ask: jest.fn(),
  getModelName: jest.fn(),
  getVersion: jest.fn(),
};

const SYSTEM_PROMPT = 'You are a helpful assistant for FinTechX';

describe('AskQuestionUseCase', () => {
  let askQuestionUseCase: AskQuestionUseCase;

  beforeEach(() => {
    askQuestionUseCase = new AskQuestionUseCase(mockChatRepository, mockAIProvider, SYSTEM_PROMPT);
    jest.clearAllMocks();
  });

  it('should ask a question and get answer successfully', async () => {
    const input = {
      userId: 1,
      question: 'What are your hours?',
      userName: 'John',
    };

    const expectedAnswer = 'We are open Monday to Friday 9am-6pm';

    mockAIProvider.ask.mockResolvedValue(expectedAnswer);
    mockChatRepository.save.mockResolvedValue(
      new ChatMessage(1, input.userId, input.question, expectedAnswer)
    );
    mockAIProvider.getModelName.mockReturnValue('gemini-1.5-flash');

    const result = await askQuestionUseCase.execute(input);

    expect(result).toHaveProperty('answer');
    expect(result.answer).toBe(expectedAnswer);
    expect(result).toHaveProperty('timestamp');
    expect(result.model).toBe('gemini-1.5-flash');
    expect(mockAIProvider.ask).toHaveBeenCalled();
    expect(mockChatRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw error if question is empty', async () => {
    const input = {
      userId: 1,
      question: '   ',
      userName: 'John',
    };

    await expect(askQuestionUseCase.execute(input)).rejects.toThrow(
      'Pergunta não pode estar vazia'
    );
  });

  it('should work without userName', async () => {
    const input = {
      userId: 1,
      question: 'What are your hours?',
    };

    mockAIProvider.ask.mockResolvedValue('Answer without personalization');
    mockChatRepository.save.mockResolvedValue(
      new ChatMessage(1, input.userId, input.question, 'Answer')
    );

    const result = await askQuestionUseCase.execute(input);

    expect(result).toHaveProperty('answer');
    expect(mockAIProvider.ask).toHaveBeenCalled();
  });
});
