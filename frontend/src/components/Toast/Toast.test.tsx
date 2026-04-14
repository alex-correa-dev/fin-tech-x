import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const defaultProps = {
    message: 'Test message',
    onClose: jest.fn(),
  };

  it('should render with success type by default', () => {
    render(<Toast {...defaultProps} />);

    const toast = screen.getByTestId('mock-toast');
    expect(toast).toBeDefined();
    expect(toast.getAttribute('data-type')).toBe('success');
    expect(screen.getByText('✅')).toBeDefined();
    expect(screen.getByText('Test message')).toBeDefined();
  });

  it('should render with error type', () => {
    render(<Toast {...defaultProps} type="error" />);

    const toast = screen.getByTestId('mock-toast');
    expect(toast.getAttribute('data-type')).toBe('error');
    expect(screen.getByText('❌')).toBeDefined();
  });

  it('should render with info type', () => {
    render(<Toast {...defaultProps} type="info" />);

    const toast = screen.getByTestId('mock-toast');
    expect(toast.getAttribute('data-type')).toBe('info');
    expect(screen.getByText('ℹ️')).toBeDefined();
  });

  it('should call onClose after duration', () => {
    const onClose = jest.fn();
    render(<Toast {...defaultProps} onClose={onClose} duration={3000} />);

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should clear timeout on unmount', () => {
    const onClose = jest.fn();
    const { unmount } = render(<Toast {...defaultProps} onClose={onClose} />);

    act(() => {
      unmount();
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should use custom duration', () => {
    const onClose = jest.fn();
    render(<Toast {...defaultProps} onClose={onClose} duration={5000} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
