import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { useTheme } from '../../contexts/ThemeContext';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../ThemeToggle/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button data-testid="theme-toggle-mock">Toggle Theme</button>;
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
    });
  });

  const renderHeader = (props = {}) => {
    return render(
      <BrowserRouter>
        <Header {...props} />
      </BrowserRouter>
    );
  };

  describe('when user is not authenticated', () => {
    it('should render logo', () => {
      renderHeader({ isAuthenticated: false });

      expect(screen.getByText('💰')).not.toBeNull();
      expect(screen.getByText('FinTechX')).not.toBeNull();
    });

    it('should not render badge when not authenticated', () => {
      renderHeader({ isAuthenticated: false });

      expect(screen.queryByTestId('header-badge')).toBeNull();
    });

    it('should render Sign In button when not authenticated', () => {
      renderHeader({ isAuthenticated: false });

      expect(screen.getByTestId('header-login-btn')).not.toBeNull();
    });

    it('should not render user info when not authenticated', () => {
      renderHeader({ isAuthenticated: false });

      expect(screen.queryByTestId('header-user-area')).toBeNull();
    });

    it('should navigate to login when Sign In button is clicked', () => {
      renderHeader({ isAuthenticated: false });

      const loginButton = screen.getByTestId('header-login-btn');
      fireEvent.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('when user is authenticated', () => {
    it('should render badge when authenticated', () => {
      renderHeader({
        isAuthenticated: true,
        userName: 'John Doe',
        userEmail: 'john@example.com',
      });

      expect(screen.getByTestId('header-badge')).not.toBeNull();
    });

    it('should render user name and email', () => {
      renderHeader({
        isAuthenticated: true,
        userName: 'John Doe',
        userEmail: 'john@example.com',
      });

      expect(screen.getByTestId('header-user-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('header-user-email')).toHaveTextContent('john@example.com');
    });

    it('should render Sign out button when authenticated', () => {
      renderHeader({
        isAuthenticated: true,
        userName: 'John Doe',
        userEmail: 'john@example.com',
      });

      expect(screen.getByTestId('header-logout-btn')).not.toBeNull();
    });

    it('should use default User when userName is not provided', () => {
      renderHeader({
        isAuthenticated: true,
        userEmail: 'john@example.com',
      });

      expect(screen.getByTestId('header-user-name')).toHaveTextContent('User');
    });

    it('should call onLogout and navigate to login when Sign out button is clicked', () => {
      const mockOnLogout = jest.fn();

      renderHeader({
        isAuthenticated: true,
        userName: 'John Doe',
        userEmail: 'john@example.com',
        onLogout: mockOnLogout,
      });

      const logoutButton = screen.getByTestId('header-logout-btn');
      fireEvent.click(logoutButton);

      expect(mockOnLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('theme styles', () => {
    it('should apply light theme class when theme is light', () => {
      (useTheme as jest.Mock).mockReturnValue({
        theme: 'light',
        toggleTheme: jest.fn(),
      });

      renderHeader({ isAuthenticated: false });

      const header = screen.getByTestId('header-component');
      expect(header.className).toContain('main-header');
      expect(header.className).toContain('-light');
      expect(header.className).not.toContain('-dark');
    });

    it('should apply dark theme class when theme is dark', () => {
      (useTheme as jest.Mock).mockReturnValue({
        theme: 'dark',
        toggleTheme: jest.fn(),
      });

      renderHeader({ isAuthenticated: false });

      const header = screen.getByTestId('header-component');
      expect(header.className).toContain('main-header');
      expect(header.className).toContain('-dark');
      expect(header.className).not.toContain('-light');
    });
  });

  describe('ThemeToggle integration', () => {
    it('should render ThemeToggle component', () => {
      renderHeader({ isAuthenticated: false });

      expect(screen.getByTestId('theme-toggle-mock')).not.toBeNull();
    });
  });
});
