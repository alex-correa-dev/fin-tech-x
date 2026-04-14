import {
  sanitizeInput,
  sanitizeResponse,
  sanitizeName,
  sanitizeEmail,
  sanitizeString,
  isValidEmail,
  isValidPassword,
} from './sanitize';

describe('sanitizeInput', () => {
  it('should return empty string for null/undefined input', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('should remove HTML tags', () => {
    const input = '<script>alert("xss")</script>Hello World';
    expect(sanitizeInput(input)).toBe('Hello World');
  });

  it('should remove all HTML attributes', () => {
    const input = '<div onclick="alert(1)">Click me</div>';
    expect(sanitizeInput(input)).toBe('Click me');
  });

  it('should trim whitespace', () => {
    const input = '  Hello World  ';
    expect(sanitizeInput(input)).toBe('Hello World');
  });

  it('should limit to 500 characters', () => {
    const input = 'a'.repeat(600);
    expect(sanitizeInput(input).length).toBeLessThanOrEqual(500);
  });

  it('should remove script tags with content', () => {
    const input = '<script>malicious code</script>Safe text';
    expect(sanitizeInput(input)).toBe('Safe text');
  });
});

describe('sanitizeResponse', () => {
  it('should return empty string for null/undefined input', () => {
    expect(sanitizeResponse('')).toBe('');
  });

  it('should allow basic formatting tags', () => {
    const input = '<b>Bold</b> and <i>italic</i>';
    const result = sanitizeResponse(input);
    expect(result).toContain('<b>Bold</b>');
    expect(result).toContain('<i>italic</i>');
  });

  it('should remove script tags', () => {
    const input = '<script>alert("xss")</script><b>Safe</b>';
    const result = sanitizeResponse(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('<b>Safe</b>');
  });

  it('should remove iframe tags', () => {
    const input = '<iframe src="malicious.com"></iframe><p>Text</p>';
    const result = sanitizeResponse(input);
    expect(result).not.toContain('<iframe>');
    expect(result).toContain('<p>Text</p>');
  });

  it('should allow links with safe attributes', () => {
    const input = '<a href="https://example.com" target="_blank">Link</a>';
    const result = sanitizeResponse(input);
    expect(result).toContain('href="https://example.com"');
  });

  it('should remove unsafe link attributes', () => {
    const input = '<a href="javascript:alert(1)">Click</a>';
    const result = sanitizeResponse(input);
    // eslint-disable-next-line no-script-url
    expect(result).not.toContain('javascript:');
  });

  it('should trim whitespace', () => {
    const input = '  Hello World  ';
    expect(sanitizeResponse(input)).toBe('Hello World');
  });

  it('should limit to 5000 characters', () => {
    const input = 'a'.repeat(6000);
    expect(sanitizeResponse(input).length).toBeLessThanOrEqual(5000);
  });
});

describe('sanitizeName', () => {
  it('should return empty string for null/undefined input', () => {
    expect(sanitizeName('')).toBe('');
  });

  it('should trim whitespace', () => {
    expect(sanitizeName('  John Doe  ')).toBe('John Doe');
  });

  it('should remove HTML tags', () => {
    expect(sanitizeName('<b>John</b> Doe')).toBe('John Doe');
  });

  it('should limit to 100 characters', () => {
    const input = 'a'.repeat(150);
    expect(sanitizeName(input).length).toBeLessThanOrEqual(100);
  });
});

describe('sanitizeEmail', () => {
  it('should return empty string for null/undefined input', () => {
    expect(sanitizeEmail('')).toBe('');
  });

  it('should normalize email to lowercase', () => {
    expect(sanitizeEmail('USER@Example.com')).toBe('user@example.com');
  });

  it('should trim whitespace', () => {
    expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com');
  });

  it('should remove HTML tags', () => {
    expect(sanitizeEmail('<b>user</b>@example.com')).toBe('user@example.com');
  });

  it('should handle Gmail addresses correctly', () => {
    expect(sanitizeEmail('User.Name@gmail.com')).toBe('user.name@gmail.com');
  });
});

describe('sanitizeString', () => {
  it('should return empty string for null/undefined input', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('should trim whitespace', () => {
    expect(sanitizeString('  test  ')).toBe('test');
  });

  it('should strip low characters', () => {
    expect(sanitizeString('test\x00\x01\x02')).toBe('test');
  });

  it('should limit to 255 characters', () => {
    const input = 'a'.repeat(300);
    expect(sanitizeString(input).length).toBeLessThanOrEqual(255);
  });

  it('should remove HTML tags', () => {
    expect(sanitizeString('<script>test</script>')).toBe('');
  });
});

describe('isValidEmail', () => {
  it('should return false for empty email', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should return true for valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('should return false for empty password', () => {
    expect(isValidPassword('')).toBe(false);
  });

  it('should return false for password shorter than 6 characters', () => {
    expect(isValidPassword('12345')).toBe(false);
  });

  it('should return true for password with 6 or more characters', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('password123')).toBe(true);
  });

  it('should return false for password longer than 100 characters', () => {
    const longPassword = 'a'.repeat(101);
    expect(isValidPassword(longPassword)).toBe(false);
  });
});
