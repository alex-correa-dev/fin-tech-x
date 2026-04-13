import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { authService } from './services/auth';

jest.mock('./services/auth', () => ({
  authService: {
    isAuthenticated: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn()
  }
}));

jest.mock('./components/Login/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-component">Login Component Mock</div>;
  };
});

jest.mock('./components/Register/Register', () => {
  return function MockRegister() {
    return <div data-testid="register-component">Register Component Mock</div>;
  };
});

jest.mock('./components/Dashboard/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard-component">Dashboard Component Mock</div>;
  };
});

jest.mock('./contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn(), setTheme: jest.fn() })
}));

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Route: ({ element }: { element: React.ReactNode }) => <>{element}</>,
  Navigate: () => null
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login component when user is not authenticated', () => {
    const mockIsAuthenticated = authService.isAuthenticated as jest.Mock;
    mockIsAuthenticated.mockReturnValue(false);

    render(<App />);
    
    const loginElement = screen.queryByTestId('login-component');
    expect(loginElement).not.toBeNull();
    expect(loginElement).toBeDefined();
  });

  it('should render dashboard component when user is authenticated', () => {
    const mockIsAuthenticated = authService.isAuthenticated as jest.Mock;
    const mockGetCurrentUser = authService.getCurrentUser as jest.Mock;
    
    mockIsAuthenticated.mockReturnValue(true);
    mockGetCurrentUser.mockReturnValue({ id: 1, name: 'Test User', email: 'test@test.com' });

    render(<App />);
    
    const dashboardElement = screen.queryByTestId('dashboard-component');
    expect(dashboardElement).not.toBeNull();
    expect(dashboardElement).toBeDefined();
  });
});