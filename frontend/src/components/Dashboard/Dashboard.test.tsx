import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: {
    logout: jest.fn(),
    getCurrentUser: jest.fn()
  }
}));

jest.mock('../ChatInterface/ChatInterface', () => {
  return function MockChatInterface() {
    return <div>Chat Interface Mock</div>;
  };
});

jest.mock('../ThemeToggle/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button>Toggle Theme</button>;
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Dashboard', () => {
  const mockGetCurrentUser = authService.getCurrentUser as jest.Mock;
  const mockLogout = authService.logout as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockReturnValue({ id: 1, name: 'Test User', email: 'test@test.com' });
  });

  it('should display user name and email', () => {
    render(
      <BrowserRouter>
        <Dashboard onLogout={jest.fn()} />
      </BrowserRouter>
    );
    
    const userNameElement = screen.getByText(/Test User/i);
    const userEmailElement = screen.getByText(/test@test.com/i);
    
    expect(userNameElement).not.toBeNull();
    expect(userNameElement.textContent).toBe('Test User');
    expect(userEmailElement).not.toBeNull();
    expect(userEmailElement.textContent).toBe('test@test.com');
  });

  it('should call logout and navigate to login when logout button is clicked', () => {
    const mockOnLogout = jest.fn();
    
    render(
      <BrowserRouter>
        <Dashboard onLogout={mockOnLogout} />
      </BrowserRouter>
    );
    
    const logoutButton = screen.getByRole('button', { name: /Sign out/i });
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should render chat interface', () => {
    render(
      <BrowserRouter>
        <Dashboard onLogout={jest.fn()} />
      </BrowserRouter>
    );
    
    const chatElement = screen.getByText(/Chat Interface Mock/i);
    expect(chatElement).not.toBeNull();
    expect(chatElement.textContent).toBe('Chat Interface Mock');
  });
});