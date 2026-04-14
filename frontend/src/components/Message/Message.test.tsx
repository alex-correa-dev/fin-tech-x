import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Message from './Message';

jest.mock('../../contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../Icon/Icon', () => {
  return function MockIcon({ name, size, color, onClick }: any) {
    return (
      <span data-testid={`icon-${name}`} onClick={onClick}>
        {name}
      </span>
    );
  };
});

const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('Message', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render user message correctly', () => {
    render(<Message message="Hello, this is a test message" isUser={true} userName="John Doe" />);

    expect(screen.getByText('Hello, this is a test message')).not.toBeNull();
  });

  it('should render assistant message correctly', () => {
    render(<Message message="This is an AI response" isUser={false} />);

    expect(screen.getByText('This is an AI response')).not.toBeNull();
  });

  it('should render write icon for user message', () => {
    render(<Message message="Test message" isUser={true} />);

    expect(screen.getByTestId('icon-write')).not.toBeNull();
  });

  it('should render copy and share icons for assistant message', () => {
    render(<Message message="Test message" isUser={false} />);

    expect(screen.getByTestId('icon-copy')).not.toBeNull();
    expect(screen.getByTestId('icon-share')).not.toBeNull();
  });

  it('should display timestamp when provided', () => {
    const testDate = new Date('2024-01-15T14:30:00');

    render(<Message message="Test message" isUser={true} timestamp={testDate} />);

    expect(screen.getByText('14:30')).not.toBeNull();
  });

  it('should not display timestamp when not provided', () => {
    render(<Message message="Test message" isUser={true} />);

    expect(screen.queryByText(/\d{2}:\d{2}/)).toBeNull();
  });

  it('should call copy when copy button is clicked', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<Message message="Text to copy" isUser={false} />);

    const copyButton = screen.getByTestId('icon-copy');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('Text to copy');
    });
  });

  it('should render long messages without breaking', () => {
    const longMessage = 'A'.repeat(500);

    render(<Message message={longMessage} isUser={true} />);

    expect(screen.getByText(longMessage)).not.toBeNull();
  });

  it('should render messages with special characters', () => {
    const specialMessage = 'Test with special chars: !@#$%^&*()_+{}[]|\\:;"\'<>,.?/~`';

    render(<Message message={specialMessage} isUser={true} />);

    expect(screen.getByText(specialMessage)).not.toBeNull();
  });

  it('should render empty message', () => {
    render(<Message message="" isUser={true} />);

    const messageText = screen.getByTestId('message-text');
    expect(messageText).not.toBeNull();
    expect(messageText.textContent).toBe('');
  });
});
