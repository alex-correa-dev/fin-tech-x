import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from './ChatInterface';
import { chatService } from '../../services/chat';

jest.mock('../../services/chat', () => ({
  chatService: {
    askQuestion: jest.fn(),
    getHistory: jest.fn()
  }
}));

jest.mock('../Message/Message', () => {
  return function MockMessage({ message, isUser, userName }: { message: string; isUser: boolean; userName?: string }) {
    const sender = isUser ? (userName || 'User') : 'FinTechX AI';
    return (
      <div data-testid={`message-${isUser ? 'user' : 'assistant'}`}>
        {sender}: {message}
      </div>
    );
  };
});

const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe('ChatInterface', () => {
  const mockAskQuestion = chatService.askQuestion as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    mockScrollIntoView.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render initial welcome message', () => {
    render(<ChatInterface />);
    
    const welcomeMessage = screen.getByText(/Olá! Sou o assistente inteligente da FinTechX/i);
    expect(welcomeMessage).not.toBeNull();
  });

  it('should update input value when typing', () => {
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test question' } });
    
    expect(textarea.value).toBe('Test question');
  });

  it('should send message when send button is clicked', async () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    const sendButton = screen.getByRole('button', { name: /Enviar →/i });
    
    fireEvent.change(textarea, { target: { value: 'What are your hours?' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(mockAskQuestion).toHaveBeenCalledWith({
        question: 'What are your hours?',
        userId: 1,
        userName: 'Test User'
      });
    });
  });

  it('should send message when Enter key is pressed', async () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    
    fireEvent.change(textarea, { target: { value: 'What are your hours?' } });
    fireEvent.keyPress(textarea, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    await waitFor(() => {
      expect(mockAskQuestion).toHaveBeenCalled();
    });
  });

  it('should not send message when Enter+Shift is pressed', async () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    
    fireEvent.change(textarea, { target: { value: 'What are your hours?' } });
    fireEvent.keyPress(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
    
    expect(mockAskQuestion).not.toHaveBeenCalled();
  });

  it('should not send empty messages', async () => {
    render(<ChatInterface />);
    
    const sendButton = screen.getByRole('button', { name: /Enviar →/i });
    fireEvent.click(sendButton);
    
    expect(mockAskQuestion).not.toHaveBeenCalled();
  });

  it('should display user message after sending', async () => {
    mockAskQuestion.mockResolvedValue('AI response');
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    const sendButton = screen.getByRole('button', { name: /Enviar →/i });
    
    fireEvent.change(textarea, { target: { value: 'Hello AI' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      const userMessage = screen.getByTestId('message-user');
      expect(userMessage).not.toBeNull();
      expect(userMessage.textContent).toContain('Hello AI');
    });
  });

  it('should display assistant response after sending', async () => {
    mockAskQuestion.mockResolvedValue('AI response text');
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    const sendButton = screen.getByRole('button', { name: /Enviar →/i });
    
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      const assistantMessages = screen.getAllByTestId('message-assistant');
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      expect(lastAssistantMessage).not.toBeNull();
      expect(lastAssistantMessage.textContent).toContain('AI response text');
    });
  });

  it('should display error message when API call fails', async () => {
    mockAskQuestion.mockRejectedValue(new Error('Network error'));
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    const sendButton = screen.getByRole('button', { name: /Enviar →/i });
    
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      const assistantMessages = screen.getAllByTestId('message-assistant');
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      expect(lastAssistantMessage).not.toBeNull();
      expect(lastAssistantMessage.textContent).toContain('Network error');
    });
  });

  it('should disable input and send button while loading', async () => {
    mockAskQuestion.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i) as HTMLTextAreaElement;
    const sendButton = screen.getByRole('button', { name: /Enviar →/i }) as HTMLButtonElement;
    
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    expect(textarea.disabled).toBe(true);
    expect(sendButton.disabled).toBe(true);
    expect(sendButton.textContent).toBe('...');
  });

  it('should show typing indicator while loading', async () => {
    mockAskQuestion.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    const sendButton = screen.getByRole('button', { name: /Enviar →/i });
    
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    const typingIndicator = screen.getByText(/IA está pensando/i);
    expect(typingIndicator).not.toBeNull();
  });

  it('should populate input when suggestion chip is clicked', () => {
    render(<ChatInterface />);
    
    const suggestionButton = screen.getByText(/📅 Quais são os horários de atendimento/i);
    fireEvent.click(suggestionButton);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('📅 Quais são os horários de atendimento?');
  });

  it('should display all suggestion chips', () => {
    render(<ChatInterface />);
    
    expect(screen.getByText(/📅 Quais são os horários de atendimento/i)).not.toBeNull();
    expect(screen.getByText(/📍 Onde estão localizados os escritórios/i)).not.toBeNull();
    expect(screen.getByText(/👥 Quem fundou a FinTechX/i)).not.toBeNull();
    expect(screen.getByText(/🔒 Como vocês protegem meus dados/i)).not.toBeNull();
    expect(screen.getByText(/⚠️ Recebi e-mail suspeito, o que fazer/i)).not.toBeNull();
    expect(screen.getByText(/📚 Como aprender sobre investimentos/i)).not.toBeNull();
    expect(screen.getByText(/🎁 Como receber promoções e descontos/i)).not.toBeNull();
  });

  it('should handle user without name in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    expect(textarea).not.toBeNull();
  });

  it('should handle empty localStorage user', () => {
    localStorage.removeItem('user');
    
    render(<ChatInterface />);
    
    const textarea = screen.getByPlaceholderText(/Digite sua pergunta/i);
    expect(textarea).not.toBeNull();
  });
});