import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: {
    register: jest.fn(),
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

jest.mock('../../components/ThemeToggle/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button data-testid="theme-toggle">Toggle Theme</button>;
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderRegister = (onRegisterMock = jest.fn()) => {
    return render(
      <BrowserRouter>
        <Register onRegister={onRegisterMock} />
      </BrowserRouter>
    );
  };

  const fillValidForm = () => {
    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const confirmInput = screen.getByTestId('input-confirmPassword');

    fireEvent.change(nameInput, { target: { value: 'Usuário Teste' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
  };

  it('should render back button', () => {
    renderRegister();
    const backButton = screen.getByTestId('mock-icon');
    expect(backButton).toBeDefined();
  });

  it('should navigate to login when back button is clicked', () => {
    renderRegister();
    const backButton = screen.getByTestId('mock-icon');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should render theme toggle button', () => {
    renderRegister();
    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toBeDefined();
  });

  it('should submit form with name, email and password', async () => {
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockResolvedValue({ user: { id: 1 }, token: 'token' });

    renderRegister();
    fillValidForm();

    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Usuário Teste',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should sanitize name before submission', async () => {
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockResolvedValue({ user: { id: 1 }, token: 'token' });

    renderRegister();

    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const confirmInput = screen.getByTestId('input-confirmPassword');
    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });

    fireEvent.change(nameInput, { target: { value: '  <b>Usuário</b> Teste  ' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Usuário Teste',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should sanitize email before submission', async () => {
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockResolvedValue({ user: { id: 1 }, token: 'token' });

    renderRegister();

    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const passwordInput = screen.getByTestId('input-password');
    const confirmInput = screen.getByTestId('input-confirmPassword');
    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });

    fireEvent.change(nameInput, { target: { value: 'Usuário Teste' } });
    fireEvent.change(emailInput, { target: { value: '  USER@Example.com  ' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Usuário Teste',
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  it('should show error when passwords do not match', async () => {
    renderRegister();

    const nameInput = screen.getByTestId('input-name');
    fireEvent.change(nameInput, { target: { value: 'Usuário Teste' } });

    const emailInput = screen.getByTestId('input-email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByTestId('input-password');
    const confirmInput = screen.getByTestId('input-confirmPassword');
    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText(/As senhas não coincidem/i);
      expect(errorElement).not.toBeNull();
    });
  });

  it('should show error when password is too short', async () => {
    renderRegister();

    const nameInput = screen.getByTestId('input-name');
    fireEvent.change(nameInput, { target: { value: 'Usuário Teste' } });

    const emailInput = screen.getByTestId('input-email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByTestId('input-password');
    const confirmInput = screen.getByTestId('input-confirmPassword');
    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText(/A senha deve ter entre 6 e 100 caracteres/i);
      expect(errorElement).not.toBeNull();
    });
  });

  it('should navigate to dashboard after successful registration', async () => {
    const mockOnRegister = jest.fn();
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockResolvedValue({ user: { id: 1 }, token: 'token' });

    render(
      <BrowserRouter>
        <Register onRegister={mockOnRegister} />
      </BrowserRouter>
    );

    fillValidForm();
    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should show error message when registration fails', async () => {
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockRejectedValue(new Error('E-mail já existe'));

    renderRegister();
    fillValidForm();

    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText(/E-mail já existe/i);
      expect(errorElement).not.toBeNull();
    });
  });

  it('should disable submit button while loading', async () => {
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderRegister();
    fillValidForm();

    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });
    fireEvent.click(submitButton);

    expect(submitButton.getAttribute('disabled')).toBe('');
    expect(submitButton.textContent).toMatch(/Cadastrando/i);
  });
});
