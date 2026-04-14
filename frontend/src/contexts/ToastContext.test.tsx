import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';

jest.mock('../components/Toast/Toast', () => {
  return function MockToast({
    message,
    type,
    onClose,
  }: {
    message: string;
    type: string;
    onClose: () => void;
  }) {
    return (
      <div data-testid="mock-toast" data-type={type}>
        <span>{message}</span>
        <button onClick={onClose} data-testid="toast-close">
          Close
        </button>
      </div>
    );
  };
});

const TestComponent = () => {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('Success message')} data-testid="show-success">
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')} data-testid="show-error">
        Show Error
      </button>
      <button onClick={() => showToast('Info message', 'info')} data-testid="show-info">
        Show Info
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = () => {
    return render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
  };

  describe('useToast', () => {
    it('should throw error when used outside ToastProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      expect(() => render(<TestComponent />)).toThrow(
        'useToast must be used within a ToastProvider'
      );
      consoleError.mockRestore();
    });

    it('should work when used inside ToastProvider', () => {
      expect(() => renderWithProvider()).not.toThrow();
    });
  });

  describe('showToast', () => {
    it('should show success toast with default type', () => {
      renderWithProvider();
      fireEvent.click(screen.getByTestId('show-success'));
      expect(screen.getByTestId('mock-toast')).toBeDefined();
      expect(screen.getByText('Success message')).toBeDefined();
    });

    it('should show error toast', () => {
      renderWithProvider();
      fireEvent.click(screen.getByTestId('show-error'));
      expect(screen.getByTestId('mock-toast')).toBeDefined();
      expect(screen.getByText('Error message')).toBeDefined();
    });

    it('should show info toast', () => {
      renderWithProvider();
      fireEvent.click(screen.getByTestId('show-info'));
      expect(screen.getByTestId('mock-toast')).toBeDefined();
      expect(screen.getByText('Info message')).toBeDefined();
    });
  });

  describe('multiple toasts', () => {
    it('should replace previous toast when new one is shown', () => {
      renderWithProvider();

      fireEvent.click(screen.getByTestId('show-success'));
      expect(screen.getByText('Success message')).toBeDefined();

      fireEvent.click(screen.getByTestId('show-error'));
      expect(screen.queryByText('Success message')).toBeNull();
      expect(screen.getByText('Error message')).toBeDefined();
    });
  });
});
