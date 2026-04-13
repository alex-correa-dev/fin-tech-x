import { chatService } from './chat';
import { apiService } from './api';

jest.mock('./api', () => ({
  apiService: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('askQuestion', () => {
    const mockAskData = {
      question: 'What are your hours?',
      userId: 1,
      userName: 'Test User',
    };

    const mockSuccessResponse = {
      success: true,
      data: {
        answer: 'We are open Monday to Friday 9am-6pm',
        timestamp: '2024-01-01T10:00:00Z',
        model: 'gemini-2.0-flash',
      },
    };

    it('should ask question successfully and return answer', async () => {
      (apiService.post as jest.Mock).mockResolvedValue(mockSuccessResponse);

      const result = await chatService.askQuestion(mockAskData);

      expect(apiService.post).toHaveBeenCalledWith('/chat/ask', mockAskData);
      expect(result).toBe('We are open Monday to Friday 9am-6pm');
    });

    it('should throw error when API call fails with error message', async () => {
      const errorResponse = {
        success: false,
        error: 'Failed to get response from AI',
      };
      (apiService.post as jest.Mock).mockResolvedValue(errorResponse);

      await expect(chatService.askQuestion(mockAskData)).rejects.toThrow(
        'Failed to get response from AI'
      );
    });

    it('should throw generic error when response has no error message', async () => {
      (apiService.post as jest.Mock).mockResolvedValue({ success: false });

      await expect(chatService.askQuestion(mockAskData)).rejects.toThrow('Erro ao obter resposta');
    });

    it('should throw error when response data is missing', async () => {
      (apiService.post as jest.Mock).mockResolvedValue({ success: true });

      await expect(chatService.askQuestion(mockAskData)).rejects.toThrow('Erro ao obter resposta');
    });

    it('should work without userId and userName', async () => {
      const askDataWithoutUser = {
        question: 'What are your hours?',
      };
      (apiService.post as jest.Mock).mockResolvedValue(mockSuccessResponse);

      const result = await chatService.askQuestion(askDataWithoutUser);

      expect(apiService.post).toHaveBeenCalledWith('/chat/ask', askDataWithoutUser);
      expect(result).toBe('We are open Monday to Friday 9am-6pm');
    });

    it('should handle empty question', async () => {
      const emptyQuestionData = {
        question: '',
      };
      (apiService.post as jest.Mock).mockResolvedValue(mockSuccessResponse);

      await chatService.askQuestion(emptyQuestionData);

      expect(apiService.post).toHaveBeenCalledWith('/chat/ask', emptyQuestionData);
    });
  });

  describe('getHistory', () => {
    const mockHistoryResponse = {
      success: true,
      data: [
        {
          id: 1,
          question: 'What are your hours?',
          answer: 'We are open 9-6',
          timestamp: '2024-01-01T10:00:00Z',
        },
        {
          id: 2,
          question: 'Where are you located?',
          answer: 'We are in Sao Paulo',
          timestamp: '2024-01-01T11:00:00Z',
        },
      ],
    };

    it('should get chat history successfully with default limit', async () => {
      (apiService.get as jest.Mock).mockResolvedValue(mockHistoryResponse);

      const result = await chatService.getHistory();

      expect(apiService.get).toHaveBeenCalledWith('/chat/history?limit=50');
      expect(result).toEqual(mockHistoryResponse.data);
      expect(result).toHaveLength(2);
    });

    it('should get chat history with custom limit', async () => {
      (apiService.get as jest.Mock).mockResolvedValue(mockHistoryResponse);

      const result = await chatService.getHistory(10);

      expect(apiService.get).toHaveBeenCalledWith('/chat/history?limit=10');
      expect(result).toEqual(mockHistoryResponse.data);
    });

    it('should return empty array when API call fails', async () => {
      (apiService.get as jest.Mock).mockResolvedValue({ success: false });

      const result = await chatService.getHistory();

      expect(result).toEqual([]);
    });

    it('should return empty array when response has no data', async () => {
      (apiService.get as jest.Mock).mockResolvedValue({ success: true });

      const result = await chatService.getHistory();

      expect(result).toEqual([]);
    });

    it('should return empty array when API throws error', async () => {
      (apiService.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await chatService.getHistory();

      expect(result).toEqual([]);
    });

    it('should return empty array when data is null', async () => {
      (apiService.get as jest.Mock).mockResolvedValue({ success: true, data: null });

      const result = await chatService.getHistory();

      expect(result).toEqual([]);
    });

    it('should return empty array when history is empty', async () => {
      (apiService.get as jest.Mock).mockResolvedValue({ success: true, data: [] });

      const result = await chatService.getHistory();

      expect(result).toEqual([]);
    });
  });
});
