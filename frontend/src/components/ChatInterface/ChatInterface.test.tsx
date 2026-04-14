import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from './ChatInterface';
import { chatService } from '../../services/chat';

jest.mock('../../services/chat', () => ({
  chatService: {
    askQuestion: jest.fn(),
    getHistory: jest.fn(),
  },
}));

jest.mock('../Message/Message', () => {
  return function MockMessage({ message, isUser, userName }: any) {
    return (
      <div data-testid={`message-${isUser ? 'user' : 'assistant'}`}>
        {isUser ? userName || 'User' : 'FinTechX AI'}: {message}
      </div>
    );
  };
});

jest.mock('../Icon/Icon', () => {
  return function MockIcon({ name }: any) {
    return <span data-testid={`icon-${name}`}>{name}</span>;
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
    expect(screen.getByText(/Olá! Como posso ajudar você hoje/i)).not.toBeNull();
  });

  it('should render header title', () => {
    render(<ChatInterface />);
    expect(screen.getByText('BrainBox')).not.toBeNull();
  });

  it('should update input value when typing', () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Enviar uma mensagem.') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test question' } });
    expect(input.value).toBe('Test question');
  });

  it('should send message when send button is clicked', async () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    const sendButton = screen.getByTestId('icon-send');

    fireEvent.change(input, { target: { value: 'What are your hours?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockAskQuestion).toHaveBeenCalledWith({
        question: 'What are your hours?',
        userId: 1,
        userName: 'Test User',
      });
    });
  });

  it('should send message when Enter key is pressed', async () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    fireEvent.change(input, { target: { value: 'What are your hours?' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(mockAskQuestion).toHaveBeenCalled();
    });
  });

  it('should not send message when Enter+Shift is pressed', () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    fireEvent.change(input, { target: { value: 'What are your hours?' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', shiftKey: true });

    expect(mockAskQuestion).not.toHaveBeenCalled();
  });

  it('should not send empty messages', () => {
    render(<ChatInterface />);
    const sendButton = screen.getByTestId('icon-send');
    fireEvent.click(sendButton);
    expect(mockAskQuestion).not.toHaveBeenCalled();
  });

  it('should display user message after sending', async () => {
    mockAskQuestion.mockResolvedValue('AI response');
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    const sendButton = screen.getByTestId('icon-send');

    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByTestId('message-user')).not.toBeNull();
    });
  });

  it('should display assistant response after sending', async () => {
    mockAskQuestion.mockResolvedValue('AI response text');
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    const sendButton = screen.getByTestId('icon-send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const assistantMessages = screen.getAllByTestId('message-assistant');
      expect(assistantMessages.length).toBeGreaterThan(0);
    });
  });

  it('should show retry button when API call fails', async () => {
    mockAskQuestion.mockRejectedValue(new Error('Network error'));
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    const sendButton = screen.getByTestId('icon-send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Gerar Resposta Novamente')).not.toBeNull();
    });
  });

  it('should disable input and send button while loading', async () => {
    mockAskQuestion.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.') as HTMLInputElement;
    const sendButton = screen.getByTestId('send-button');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(input.disabled).toBe(true);
  });

  it('should show typing indicator while loading', async () => {
    mockAskQuestion.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    const sendButton = screen.getByTestId('icon-send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(screen.getByText(/IA está pensando/i)).not.toBeNull();
  });

  it('should populate input when suggestion chip is clicked', () => {
    render(<ChatInterface />);
    const suggestionButton = screen.getByText(/Quais são os horários de atendimento/i);
    fireEvent.click(suggestionButton);

    const input = screen.getByPlaceholderText('Enviar uma mensagem.') as HTMLInputElement;
    expect(input.value).toBe('Quais são os horários de atendimento?');
  });

  it('should display all suggestion chips', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/Quais são os horários de atendimento/i)).not.toBeNull();
    expect(screen.getByText(/Onde estão localizados os escritórios/i)).not.toBeNull();
    expect(screen.getByText(/Quem fundou a FinTechX/i)).not.toBeNull();
  });

  it('should handle user without name in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    expect(input).not.toBeNull();
  });

  it('should handle empty localStorage user', () => {
    localStorage.removeItem('user');
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    expect(input).not.toBeNull();
  });
});
