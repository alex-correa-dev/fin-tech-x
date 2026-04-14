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

jest.mock('../../components/Input/Input', () => {
  return function MockInput({
    value,
    onChange,
    placeholder,
    disabled,
    type,
    id,
    name,
    required,
  }: any) {
    return (
      <input
        data-testid={`input-${name}`}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
    );
  };
});

jest.mock('../../components/Icon/Icon', () => {
  return function MockIcon() {
    return <span data-testid="mock-icon">Icon</span>;
  };
});

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

  const fillValidForm = () => {
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
  };

  it('should render back button', () => {
    renderLogin();
    const backButton = screen.getByTestId('mock-icon');
    expect(backButton).toBeDefined();
  });

  it('should navigate to home when back button is clicked', () => {
    renderLogin();
    const backButton = screen.getByTestId('mock-icon');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should submit form with email and password', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockResolvedValue({ user: { id: 1, name: 'Test' }, token: 'token' });

    renderLogin();
    fillValidForm();

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should sanitize email before submission', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockResolvedValue({ user: { id: 1 }, token: 'token' });

    renderLogin();

    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: '  USER@Example.com  ' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  it('should show error when email is invalid', async () => {
    renderLogin();

    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText(/Por favor, insira um e-mail válido/i);
      expect(errorElement).not.toBeNull();
    });
  });

  it('should show error when password is too short', async () => {
    renderLogin();

    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText(/A senha deve ter entre 6 e 100 caracteres/i);
      expect(errorElement).not.toBeNull();
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

    fillValidForm();
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should show error message when login fails', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockRejectedValue(new Error('Credenciais inválidas'));

    renderLogin();

    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText(/Credenciais inválidas/i);
      expect(errorElement).not.toBeNull();
    });
  });

  it('should disable submit button while loading', async () => {
    const mockLogin = authService.login as jest.Mock;
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderLogin();
    fillValidForm();

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    expect(submitButton.getAttribute('disabled')).toBe('');
    expect(submitButton.textContent).toMatch(/Entrando/i);
  });
});
