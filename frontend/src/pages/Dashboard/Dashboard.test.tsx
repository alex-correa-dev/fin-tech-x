import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: {
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

jest.mock('../../components/Header/Header', () => {
  return function MockHeader({ onLogout }: { onLogout?: () => void }) {
    return (
      <div data-testid="mock-header">
        <button onClick={onLogout} data-testid="mock-logout-btn">
          Sign out
        </button>
      </div>
    );
  };
});

jest.mock('../../components/ChatInterface/ChatInterface', () => {
  return function MockChatInterface() {
    return <div data-testid="mock-chat-interface">Chat Interface Mock</div>;
  };
});

describe('Dashboard', () => {
  const mockGetCurrentUser = authService.getCurrentUser as jest.Mock;
  const mockLogout = authService.logout as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockReturnValue({ id: 1, name: 'Test User', email: 'test@test.com' });
  });

  const renderDashboard = (onLogout?: () => void) => {
    return render(
      <BrowserRouter>
        <Dashboard onLogout={onLogout} />
      </BrowserRouter>
    );
  };

  it('should render Header with authenticated user', () => {
    renderDashboard();
    expect(screen.getByTestId('mock-header')).toBeDefined();
  });

  it('should render ChatInterface', () => {
    renderDashboard();
    expect(screen.getByTestId('mock-chat-interface')).toBeDefined();
  });

  it('should call logout when logout button is clicked', () => {
    const mockOnLogout = jest.fn();
    renderDashboard(mockOnLogout);

    const logoutButton = screen.getByTestId('mock-logout-btn');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockOnLogout).toHaveBeenCalled();
  });
});
