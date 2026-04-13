import { GetChatHistoryUseCase } from './GetChatHistoryUseCase';
import { IChatRepository } from '../../repositories/IChatRepository';
import { ChatMessage } from '../../entities/ChatMessage';

describe('GetChatHistoryUseCase', () => {
  let getChatHistoryUseCase: GetChatHistoryUseCase;
  let mockChatRepository: jest.Mocked<IChatRepository>;

  beforeEach(() => {
    mockChatRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      deleteOldMessages: jest.fn(),
      deleteAll: jest.fn(),
    };

    getChatHistoryUseCase = new GetChatHistoryUseCase(mockChatRepository);
  });

  it('should return chat history for a user with default limit', async () => {
    const userId = 1;
    const mockMessages = [
      new ChatMessage(1, userId, 'What are your hours?', 'We are open 9-6', new Date('2024-01-01T10:00:00Z')),
      new ChatMessage(2, userId, 'Where are you located?', 'We are in Sao Paulo', new Date('2024-01-01T11:00:00Z')),
    ];

    mockChatRepository.findByUserId.mockResolvedValue(mockMessages);

    const result = await getChatHistoryUseCase.execute(userId);

    expect(mockChatRepository.findByUserId).toHaveBeenCalledWith(userId, 50);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      question: 'What are your hours?',
      answer: 'We are open 9-6',
      timestamp: new Date('2024-01-01T10:00:00Z'),
    });
    expect(result[1]).toEqual({
      id: 2,
      question: 'Where are you located?',
      answer: 'We are in Sao Paulo',
      timestamp: new Date('2024-01-01T11:00:00Z'),
    });
  });

  it('should return chat history with custom limit', async () => {
    const userId = 1;
    const customLimit = 10;
    const mockMessages = [
      new ChatMessage(1, userId, 'Question 1', 'Answer 1', new Date()),
    ];

    mockChatRepository.findByUserId.mockResolvedValue(mockMessages);

    const result = await getChatHistoryUseCase.execute(userId, customLimit);

    expect(mockChatRepository.findByUserId).toHaveBeenCalledWith(userId, customLimit);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when user has no chat history', async () => {
    const userId = 1;

    mockChatRepository.findByUserId.mockResolvedValue([]);

    const result = await getChatHistoryUseCase.execute(userId);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle repository error gracefully', async () => {
    const userId = 1;

    mockChatRepository.findByUserId.mockRejectedValue(new Error('Database connection failed'));

    await expect(getChatHistoryUseCase.execute(userId)).rejects.toThrow('Database connection failed');
  });

  it('should return messages in correct order (by timestamp)', async () => {
    const userId = 1;
    const earlierDate = new Date('2024-01-01T10:00:00Z');
    const laterDate = new Date('2024-01-01T11:00:00Z');
    
    const mockMessages = [
      new ChatMessage(1, userId, 'First question', 'First answer', earlierDate),
      new ChatMessage(2, userId, 'Second question', 'Second answer', laterDate),
    ];

    mockChatRepository.findByUserId.mockResolvedValue(mockMessages);

    const result = await getChatHistoryUseCase.execute(userId);

    expect(result[0].timestamp).toEqual(earlierDate);
    expect(result[1].timestamp).toEqual(laterDate);
  });

  it('should map all message properties correctly', async () => {
    const userId = 1;
    const timestamp = new Date('2024-01-01T10:00:00Z');
    const mockMessages = [
      new ChatMessage(5, userId, 'Test question', 'Test answer', timestamp),
    ];

    mockChatRepository.findByUserId.mockResolvedValue(mockMessages);

    const result = await getChatHistoryUseCase.execute(userId);

    expect(result[0]).toHaveProperty('id', 5);
    expect(result[0]).toHaveProperty('question', 'Test question');
    expect(result[0]).toHaveProperty('answer', 'Test answer');
    expect(result[0]).toHaveProperty('timestamp', timestamp);
  });
});