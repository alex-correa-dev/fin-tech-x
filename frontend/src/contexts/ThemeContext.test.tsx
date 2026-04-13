import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

const TestComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button data-testid="toggle-button" onClick={toggleTheme}>Toggle</button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>Set Light</button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-mode', 'light-mode');
    jest.clearAllMocks();
  });

  describe('ThemeProvider', () => {
    it('should provide light theme by default', () => {
      mockMatchMedia(false);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('should load saved theme from localStorage', () => {
      mockMatchMedia(false);
      localStorage.setItem('theme', 'dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });

    it('should use system preference when no saved theme', () => {
      mockMatchMedia(true);
      localStorage.removeItem('theme');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });

    it('should prefer saved theme over system preference', () => {
      mockMatchMedia(true);
      localStorage.setItem('theme', 'light');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('should toggle theme when toggleTheme is called', () => {
      mockMatchMedia(false);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      const toggleButton = screen.getByTestId('toggle-button');
      
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
      
      fireEvent.click(toggleButton);
      
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
      
      fireEvent.click(toggleButton);
      
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('should set theme to light when setTheme is called with light', () => {
      mockMatchMedia(false);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      const setLightButton = screen.getByTestId('set-light');
      
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
      
      fireEvent.click(setLightButton);
      
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('should set theme to dark when setTheme is called with dark', () => {
      mockMatchMedia(false);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      const setDarkButton = screen.getByTestId('set-dark');
      
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
      
      fireEvent.click(setDarkButton);
      
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });

    it('should save theme to localStorage when theme changes', () => {
      mockMatchMedia(false);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      const toggleButton = screen.getByTestId('toggle-button');
      
      expect(localStorage.getItem('theme')).toBe('light');
      
      fireEvent.click(toggleButton);
      
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should add dark-mode class to document when theme is dark', () => {
      mockMatchMedia(false);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      const toggleButton = screen.getByTestId('toggle-button');
      
      expect(document.documentElement.classList.contains('light-mode')).toBe(true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
      
      fireEvent.click(toggleButton);
      
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
      expect(document.documentElement.classList.contains('light-mode')).toBe(false);
    });

    it('should add light-mode class to document when theme is light', () => {
      mockMatchMedia(false);
      localStorage.setItem('theme', 'dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
      
      const setLightButton = screen.getByTestId('set-light');
      fireEvent.click(setLightButton);
      
      expect(document.documentElement.classList.contains('light-mode')).toBe(true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    });
  });

  describe('useTheme', () => {
    it('should throw error when used outside of ThemeProvider', () => {
      mockMatchMedia(false);
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('should provide theme context when used within ThemeProvider', () => {
      mockMatchMedia(false);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('theme-value')).not.toBeNull();
    });
  });
});