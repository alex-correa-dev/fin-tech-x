import { authService } from './auth';
import { apiService } from './api';

jest.mock('./api', () => ({
  apiService: {
    post: jest.fn()
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('register', () => {
    it('should register user and store token', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: 1, name: 'Test User', email: 'test@test.com' },
          token: 'fake-token'
        }
      };
      
      (apiService.post as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await authService.register({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      });
      
      expect(apiService.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      });
      expect(result.user).toEqual({ id: 1, name: 'Test User', email: 'test@test.com' });
      expect(result.token).toBe('fake-token');
      expect(localStorage.getItem('token')).toBe('fake-token');
    });

    it('should throw error when registration fails', async () => {
      (apiService.post as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Email already exists'
      });
      
      await expect(authService.register({
        name: 'Test',
        email: 'test@test.com',
        password: '123456'
      })).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login user and store token', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: 1, name: 'Test User', email: 'test@test.com' },
          token: 'fake-token'
        }
      };
      
      (apiService.post as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await authService.login({
        email: 'test@test.com',
        password: 'password123'
      });
      
      expect(apiService.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123'
      });
      expect(result.user).toEqual({ id: 1, name: 'Test User', email: 'test@test.com' });
      expect(result.token).toBe('fake-token');
      expect(localStorage.getItem('token')).toBe('fake-token');
    });
  });

  describe('logout', () => {
    it('should clear localStorage', () => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({ id: 1 }));
      
      authService.logout();
      
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'fake-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from localStorage', () => {
      const user = { id: 1, name: 'Test' };
      localStorage.setItem('user', JSON.stringify(user));
      
      expect(authService.getCurrentUser()).toEqual(user);
    });

    it('should return null when user not in localStorage', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });
  });
});