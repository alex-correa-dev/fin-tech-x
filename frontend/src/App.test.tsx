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
    getCurrentUser: jest.fn(),
  },
}));

jest.mock('./pages/Home/Home', () => {
  return function MockHome() {
    return <div data-testid="home-component">Home Component Mock</div>;
  };
});

jest.mock('./pages/Login/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-component">Login Component Mock</div>;
  };
});

jest.mock('./pages/Register/Register', () => {
  return function MockRegister() {
    return <div data-testid="register-component">Register Component Mock</div>;
  };
});

jest.mock('./pages/Dashboard/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard-component">Dashboard Component Mock</div>;
  };
});

jest.mock('./contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn(), setTheme: jest.fn() }),
}));

jest.mock('./contexts/ToastContext', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Route: ({ element }: { element: React.ReactNode }) => <>{element}</>,
  Navigate: () => null,
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render home component at root path', () => {
    render(<App />);

    const homeElement = screen.queryByTestId('home-component');
    expect(homeElement).not.toBeNull();
  });

  it('should render login component when user is not authenticated', () => {
    const mockIsAuthenticated = authService.isAuthenticated as jest.Mock;
    mockIsAuthenticated.mockReturnValue(false);

    render(<App />);

    const loginElement = screen.queryByTestId('login-component');
    expect(loginElement).not.toBeNull();
  });

  it('should render dashboard component when user is authenticated', () => {
    const mockIsAuthenticated = authService.isAuthenticated as jest.Mock;
    mockIsAuthenticated.mockReturnValue(true);

    render(<App />);

    const dashboardElement = screen.queryByTestId('dashboard-component');
    expect(dashboardElement).not.toBeNull();
  });
});
