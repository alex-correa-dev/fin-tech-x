import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Icon from './Icon';

jest.mock('./icons', () => ({
  iconComponents: {
    email: () => <svg data-testid="mock-svg" />,
    lock: () => <svg data-testid="mock-svg" />,
  },
}));

describe('Icon', () => {
  it('should render when valid name is provided', () => {
    render(<Icon name="email" />);
    expect(screen.getByTestId('icon-container')).toBeDefined();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Icon name="email" onClick={handleClick} />);
    const container = screen.getByTestId('icon-container');
    fireEvent.click(container);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when not provided', () => {
    const handleClick = jest.fn();
    render(<Icon name="email" />);
    const container = screen.getByTestId('icon-container');
    fireEvent.click(container);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
