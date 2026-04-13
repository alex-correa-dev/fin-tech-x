import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from './Message';

describe('Message', () => {
  it('should render user message correctly', () => {
    render(<Message message="Hello, this is a test message" isUser={true} userName="John Doe" />);

    expect(screen.getByText('👤')).not.toBeNull();
    expect(screen.getByText('John Doe')).not.toBeNull();
    expect(screen.getByText('Hello, this is a test message')).not.toBeNull();
  });

  it('should render assistant message correctly', () => {
    render(<Message message="This is an AI response" isUser={false} />);

    expect(screen.getByText('🤖')).not.toBeNull();
    expect(screen.getByText('FinTechX AI')).not.toBeNull();
    expect(screen.getByText('This is an AI response')).not.toBeNull();
  });

  it('should use default user name when userName not provided', () => {
    render(<Message message="Test message" isUser={true} />);

    expect(screen.getByText('Você')).not.toBeNull();
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

  it('should format timestamp correctly for different times', () => {
    const morningDate = new Date('2024-01-15T09:05:00');
    const afternoonDate = new Date('2024-01-15T15:45:00');
    const eveningDate = new Date('2024-01-15T20:30:00');

    const { rerender } = render(<Message message="Test" isUser={true} timestamp={morningDate} />);
    expect(screen.getByText('09:05')).not.toBeNull();

    rerender(<Message message="Test" isUser={true} timestamp={afternoonDate} />);
    expect(screen.getByText('15:45')).not.toBeNull();

    rerender(<Message message="Test" isUser={true} timestamp={eveningDate} />);
    expect(screen.getByText('20:30')).not.toBeNull();
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

    const messageParagraph = screen.getByTestId('message-text');
    expect(messageParagraph).not.toBeNull();
    expect(messageParagraph.textContent).toBe('');
  });

  it('should apply correct CSS classes for user message', () => {
    render(<Message message="Test" isUser={true} />);

    const messageDiv = screen.getByTestId('message-container');
    expect(messageDiv.className).toContain('-user');
    expect(messageDiv.className).not.toContain('-assistant');
  });

  it('should apply correct CSS classes for assistant message', () => {
    render(<Message message="Test" isUser={false} />);

    const messageDiv = screen.getByTestId('message-container');
    expect(messageDiv.className).toContain('-assistant');
    expect(messageDiv.className).not.toContain('-user');
  });

  it('should render avatar emoji correctly for user', () => {
    render(<Message message="Test" isUser={true} />);

    expect(screen.getByText('👤')).not.toBeNull();
  });

  it('should render avatar emoji correctly for assistant', () => {
    render(<Message message="Test" isUser={false} />);

    expect(screen.getByText('🤖')).not.toBeNull();
  });
});
