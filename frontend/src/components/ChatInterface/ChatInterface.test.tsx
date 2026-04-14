import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from './ChatInterface';
import { chatService } from '../../services/chat';
import * as sanitize from '../../utils/sanitize';

jest.mock('../../services/chat', () => ({
  chatService: {
    askQuestion: jest.fn(),
    getHistory: jest.fn(),
  },
}));

jest.mock('../../utils/sanitize', () => ({
  sanitizeInput: jest.fn((input) => input),
  sanitizeResponse: jest.fn((response) => response),
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
  const mockSanitizeInput = sanitize.sanitizeInput as jest.Mock;
  const mockSanitizeResponse = sanitize.sanitizeResponse as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    mockScrollIntoView.mockClear();
    mockSanitizeInput.mockImplementation((input) => input);
    mockSanitizeResponse.mockImplementation((response) => response);
  });

  afterEach(() => {
    localStorage.clear();
  });

  const fillInput = (value: string) => {
    const input = screen.getByPlaceholderText('Enviar uma mensagem.');
    fireEvent.change(input, { target: { value } });
    return input;
  };

  const clickSendButton = () => {
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);
  };

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
    const input = fillInput('Test question') as HTMLTextAreaElement;
    expect(input.value).toBe('Test question');
  });

  it('should send message when send button is clicked', async () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    render(<ChatInterface />);

    fillInput('What are your hours?');
    clickSendButton();

    await waitFor(() => {
      expect(mockAskQuestion).toHaveBeenCalledWith({
        question: 'What are your hours?',
        userId: 1,
        userName: 'Test User',
      });
    });
  });

  it('should call sanitizeInput before sending', async () => {
    mockAskQuestion.mockResolvedValue('AI response');
    render(<ChatInterface />);

    fillInput('  Hello  ');
    clickSendButton();

    await waitFor(() => {
      expect(mockSanitizeInput).toHaveBeenCalledWith('  Hello  ');
    });
  });

  it('should send message when Enter key is pressed', async () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    render(<ChatInterface />);

    const input = fillInput('What are your hours?');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(mockAskQuestion).toHaveBeenCalled();
    });
  });

  it('should not send message when Enter+Shift is pressed', () => {
    mockAskQuestion.mockResolvedValue('This is a test response');
    render(<ChatInterface />);

    const input = fillInput('What are your hours?');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', shiftKey: true });

    expect(mockAskQuestion).not.toHaveBeenCalled();
  });

  it('should not send empty messages', () => {
    render(<ChatInterface />);
    clickSendButton();
    expect(mockAskQuestion).not.toHaveBeenCalled();
  });

  it('should display user message after sending', async () => {
    mockAskQuestion.mockResolvedValue('AI response');
    render(<ChatInterface />);

    fillInput('Hello AI');
    clickSendButton();

    await waitFor(() => {
      expect(screen.getByTestId('message-user')).not.toBeNull();
    });
  });

  it('should call sanitizeResponse on API response', async () => {
    const rawResponse = 'Raw AI response';
    mockAskQuestion.mockResolvedValue(rawResponse);
    render(<ChatInterface />);

    fillInput('Hello');
    clickSendButton();

    await waitFor(() => {
      expect(mockSanitizeResponse).toHaveBeenCalledWith(rawResponse);
    });
  });

  it('should display assistant response after sending', async () => {
    mockAskQuestion.mockResolvedValue('AI response text');
    render(<ChatInterface />);

    fillInput('Hello');
    clickSendButton();

    await waitFor(() => {
      const assistantMessages = screen.getAllByTestId('message-assistant');
      expect(assistantMessages.length).toBeGreaterThan(0);
    });
  });

  it('should show retry button when API call fails', async () => {
    mockAskQuestion.mockRejectedValue(new Error('Network error'));
    render(<ChatInterface />);

    fillInput('Hello');
    clickSendButton();

    await waitFor(() => {
      expect(screen.getByText('Gerar Resposta Novamente')).not.toBeNull();
    });
  });

  it('should disable input while loading', async () => {
    mockAskQuestion.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<ChatInterface />);

    fillInput('Hello');
    clickSendButton();

    const input = screen.getByPlaceholderText('Enviar uma mensagem.') as HTMLTextAreaElement;
    expect(input.disabled).toBe(true);
  });

  it('should show typing indicator while loading', async () => {
    mockAskQuestion.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<ChatInterface />);

    fillInput('Hello');
    clickSendButton();

    expect(screen.getByText(/IA está pensando/i)).not.toBeNull();
  });

  it('should populate input when suggestion chip is clicked', () => {
    render(<ChatInterface />);
    const suggestionButton = screen.getByText(/Quais são os horários de atendimento/i);
    fireEvent.click(suggestionButton);

    const textarea = screen.getByPlaceholderText('Enviar uma mensagem.') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Quais são os horários de atendimento?');
  });

  it('should display all suggestion chips', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/Quais são os horários de atendimento/i)).not.toBeNull();
    expect(screen.getByText(/Onde estão localizados os escritórios/i)).not.toBeNull();
    expect(screen.getByText(/Quem fundou a FinTechX/i)).not.toBeNull();
    expect(screen.getByText(/Como vocês protegem meus dados/i)).not.toBeNull();
    expect(screen.getByText(/Recebi e-mail suspeito, o que fazer/i)).not.toBeNull();
    expect(screen.getByText(/Como aprender sobre investimentos/i)).not.toBeNull();
    expect(screen.getByText(/Como receber promoções/i)).not.toBeNull();
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
