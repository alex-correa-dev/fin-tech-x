import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

jest.mock('../Icon/Icon', () => {
  return function MockIcon({ name, onClick }: { name: string; onClick?: () => void }) {
    return (
      <span data-testid={`icon-${name}`} onClick={onClick}>
        Icon Mock
      </span>
    );
  };
});

describe('Input', () => {
  const defaultProps = {
    type: 'text',
    id: 'test-input',
    name: 'test',
    value: '',
    onChange: jest.fn(),
    placeholder: 'Enter text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input with correct placeholder', () => {
    render(<Input {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeDefined();
  });

  it('should call onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input {...defaultProps} onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input {...defaultProps} disabled={true} />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should be required when required prop is true', () => {
    render(<Input {...defaultProps} required={true} />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  it('should render left icon when iconLeft is provided', () => {
    render(<Input {...defaultProps} iconLeft="email" />);
    const leftIcon = screen.getByTestId('icon-email');
    expect(leftIcon).toBeDefined();
  });

  it('should render right icon when iconRight is provided', () => {
    render(<Input {...defaultProps} iconRight="lock" />);
    const rightIcon = screen.getByTestId('icon-lock');
    expect(rightIcon).toBeDefined();
  });

  it('should not render left icon when not provided', () => {
    render(<Input {...defaultProps} />);
    const leftIcon = screen.queryByTestId(/icon-/);
    expect(leftIcon).toBeNull();
  });

  it('should call onIconRightClick when right icon is clicked', () => {
    const handleRightIconClick = jest.fn();
    render(<Input {...defaultProps} iconRight="write" onIconRightClick={handleRightIconClick} />);
    const rightIcon = screen.getByTestId('icon-write');
    fireEvent.click(rightIcon);
    expect(handleRightIconClick).toHaveBeenCalledTimes(1);
  });

  describe('password type', () => {
    it('should toggle input type when right icon is clicked', () => {
      render(<Input {...defaultProps} type="password" iconRight="write" />);
      const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
      const rightIcon = screen.getByTestId('icon-write');

      expect(input.type).toBe('password');

      fireEvent.click(rightIcon);
      expect(input.type).toBe('text');

      fireEvent.click(rightIcon);
      expect(input.type).toBe('password');
    });
  });
});
