import { apiService } from './api';
import { IChatResponse } from '../types';

export interface IAskQuestionData {
  question: string;
  userId?: number;
  userName?: string;
}

class ChatService {
  async askQuestion(data: IAskQuestionData): Promise<string> {
    const response = await apiService.post<IChatResponse>('/chat/ask', data);

    if (response.success && response.data) {
      return response.data.answer;
    }

    throw new Error(response.error || 'Erro ao obter resposta');
  }

  async getHistory(limit: number = 50): Promise<Array<{
    id: number;
    question: string;
    answer: string;
    timestamp: string;
  }>> {
    const response = await apiService.get<{ success: boolean; data?: any[] }>(`/chat/history?limit=${limit}`);

    if (response.success && response.data) {
      return response.data;
    }

    return [];
  }
}

export const chatService = new ChatService();