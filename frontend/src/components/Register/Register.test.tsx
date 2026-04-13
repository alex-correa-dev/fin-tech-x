import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: {
    register: jest.fn()
  }
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
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

  it('should submit form with name, email and password', async () => {
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockResolvedValue({ user: { id: 1 }, token: 'token' });
    
    renderRegister();
    
    const nameInput = screen.getByLabelText(/Full name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmInput = screen.getByLabelText(/Confirm password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('should show error when passwords do not match', async () => {
    renderRegister();
    
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmInput = screen.getByLabelText(/Confirm password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const errorElement = screen.getByText(/Passwords do not match/i);
      expect(errorElement).not.toBeNull();
      expect(errorElement.textContent).toBe('Passwords do not match');
    });
  });

  it('should show error when password is too short', async () => {
    renderRegister();
    
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmInput = screen.getByLabelText(/Confirm password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const errorElement = screen.getByText(/Password must be at least 6 characters/i);
      expect(errorElement).not.toBeNull();
      expect(errorElement.textContent).toBe('Password must be at least 6 characters');
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
    
    const nameInput = screen.getByLabelText(/Full name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmInput = screen.getByLabelText(/Confirm password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show error message when registration fails', async () => {
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockRejectedValue(new Error('Email already exists'));
    
    renderRegister();
    
    const nameInput = screen.getByLabelText(/Full name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmInput = screen.getByLabelText(/Confirm password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const errorElement = screen.getByText(/Email already exists/i);
      expect(errorElement).not.toBeNull();
      expect(errorElement.textContent).toBe('Email already exists');
    });
  });

  it('should disable submit button while loading', async () => {
    const mockRegister = authService.register as jest.Mock;
    mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderRegister();
    
    const nameInput = screen.getByLabelText(/Full name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmInput = screen.getByLabelText(/Confirm password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(submitButton.getAttribute('disabled')).toBe('');
    expect(submitButton.textContent).toMatch(/Creating account/i);
  });
});