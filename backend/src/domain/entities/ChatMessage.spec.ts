import { ChatMessage } from './ChatMessage';

describe('ChatMessage Entity', () => {
  describe('constructor', () => {
    it('should create a valid chat message', () => {
      const message = new ChatMessage(
        1, 
        100, 
        'What are your hours?', 
        'We are open 9-6'
      );
      
      expect(message).toBeInstanceOf(ChatMessage);
      expect(message.id).toBe(1);
      expect(message.userId).toBe(100);
      expect(message.question).toBe('What are your hours?');
      expect(message.answer).toBe('We are open 9-6');
      expect(message.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('validate', () => {
    it('should validate valid message', () => {
      const message = new ChatMessage(1, 100, 'Question?', 'Answer!');
      expect(() => message.validate()).not.toThrow();
    });

    it('should throw error when question is empty', () => {
      const message = new ChatMessage(1, 100, '   ', 'Answer!');
      expect(() => message.validate()).toThrow('Pergunta não pode estar vazia');
    });

    it('should throw error when answer is empty', () => {
      const message = new ChatMessage(1, 100, 'Question?', '   ');
      expect(() => message.validate()).toThrow('Resposta não pode estar vazia');
    });
  });

  describe('toJSON', () => {
    it('should return message without userId', () => {
      const message = new ChatMessage(1, 100, 'Question?', 'Answer!');
      const json = message.toJSON();
      
      expect(json).toEqual({
        id: 1,
        question: 'Question?',
        answer: 'Answer!',
        createdAt: message.createdAt
      });
      expect(json).not.toHaveProperty('userId');
    });
  });
});