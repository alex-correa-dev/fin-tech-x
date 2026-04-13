import { apiService } from './api';

global.fetch = jest.fn();

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('get', () => {
    it('should make GET request with correct headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' })
      });
      
      const result = await apiService.get('/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should include auth token when available', async () => {
      localStorage.setItem('token', 'fake-token');
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({})
      });
      
      await apiService.get('/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer fake-token'
          })
        })
      );
    });
  });

  describe('post', () => {
    it('should make POST request with body', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'created' })
      });
      
      const result = await apiService.post('/test', { name: 'test' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' })
        })
      );
      expect(result).toEqual({ data: 'created' });
    });
  });

  it('should throw error on failed request', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Something went wrong' })
    });
    
    await expect(apiService.get('/test')).rejects.toThrow('Something went wrong');
  });
});