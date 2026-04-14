import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: {
    login: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLogin = (onLoginMock = jest.fn()) => {
    return render(
      <BrowserRouter>
        <Login onLogin={onLoginMock} />
      </BrowserRouter>
    );
  };

  it('should submit form with email and password', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockResolvedValue({ user: { id: 1, name: 'Test' }, token: 'token' });

    renderLogin();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should navigate to dashboard after successful login', async () => {
    const mockOnLogin = jest.fn();
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockResolvedValue({ user: { id: 1 }, token: 'token' });

    render(
      <BrowserRouter>
        <Login onLogin={mockOnLogin} />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should show error message when login fails', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    renderLogin();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText(/Invalid credentials/i);
      expect(errorElement).not.toBeNull();
    });
  });

  it('should disable submit button while loading', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderLogin();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton.getAttribute('disabled')).toBe('');
    expect(submitButton.textContent).toMatch(/Signing in/i);
  });
});
