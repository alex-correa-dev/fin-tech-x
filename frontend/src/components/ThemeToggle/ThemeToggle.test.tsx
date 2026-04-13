import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeToggle', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render sun icon when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const sunIcon = screen.getByText('☀️');
    expect(sunIcon).not.toBeNull();
  });

  it('should render moon icon when theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const moonIcon = screen.getByText('🌙');
    expect(moonIcon).not.toBeNull();
  });

  it('should call toggleTheme when button is clicked', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByTestId('theme-toggle-button');
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should have correct aria-label', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByTestId('theme-toggle-button');
    expect(button.getAttribute('aria-label')).toBe('Toggle theme');
  });

  it('should apply light theme class when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByTestId('theme-toggle-button');
    expect(button.className).toContain('-light');
    expect(button.className).not.toContain('-dark');
  });

  it('should apply dark theme class when theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByTestId('theme-toggle-button');
    expect(button.className).toContain('-dark');
    expect(button.className).not.toContain('-light');
  });

  it('should render slider div', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const slider = screen.getByTestId('theme-toggle-slider');
    expect(slider).not.toBeNull();
  });

  it('should render icon span inside slider', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const icon = screen.getByTestId('theme-toggle-icon');
    expect(icon).not.toBeNull();
  });
});
