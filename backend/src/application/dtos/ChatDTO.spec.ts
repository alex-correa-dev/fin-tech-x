import { AskQuestionDTO, ChatResponseDTO } from './ChatDTO';

describe('ChatDTOs', () => {
  describe('AskQuestionDTO', () => {
    it('should create valid AskQuestionDTO', () => {
      const data = {
        question: 'What are your hours?',
        userId: 1,
        userName: 'John'
      };
      
      const dto = new AskQuestionDTO(data);
      
      expect(dto.question).toBe(data.question);
      expect(dto.userId).toBe(data.userId);
      expect(dto.userName).toBe(data.userName);
    });

    it('should validate valid data', () => {
      const dto = new AskQuestionDTO({
        question: 'What are your hours?',
        userId: 1
      });
      
      expect(() => dto.validate()).not.toThrow();
    });

    it('should throw error when question is empty', () => {
      const dto = new AskQuestionDTO({
        question: '   ',
        userId: 1
      });
      
      expect(() => dto.validate()).toThrow('Pergunta é obrigatória');
    });

    it('should throw error when userId is missing', () => {
      const dto = new AskQuestionDTO({
        question: 'What are your hours?',
        userId: 0 as any
      });
      
      expect(() => dto.validate()).toThrow('Usuário não identificado');
    });
  });

  describe('ChatResponseDTO', () => {
    it('should create valid ChatResponseDTO', () => {
      const answer = 'We are open 9-6';
      const timestamp = new Date().toISOString();
      const model = 'gemini-1.5-flash';
      
      const dto = new ChatResponseDTO(answer, timestamp, model);
      
      expect(dto.answer).toBe(answer);
      expect(dto.timestamp).toBe(timestamp);
      expect(dto.model).toBe(model);
    });
  });
});