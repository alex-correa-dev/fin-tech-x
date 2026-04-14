import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { useTheme } from '../../contexts/ThemeContext';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../components/Header/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header Mock</div>;
  };
});

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
    });
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('should render Header component', () => {
    renderHome();
    expect(screen.getByTestId('mock-header')).toBeDefined();
  });

  it('should render robot image with alt text', () => {
    renderHome();
    const robotImage = screen.getByAltText('AI Robot');
    expect(robotImage).toBeDefined();
  });

  it('should render main title', () => {
    renderHome();
    expect(screen.getByText('Unlock the Power Of Future AI')).toBeDefined();
  });

  it('should render subtitle', () => {
    renderHome();
    expect(
      screen.getByText('Chat with the smartest AI Future Experience power of AI with us')
    ).toBeDefined();
  });
});
