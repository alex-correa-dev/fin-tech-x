import { apiService } from './api';
import { IUser, IAuthResponse, IRegisterData, ILoginData } from '../types';

class AuthService {
  async register(data: IRegisterData): Promise<{ user: IUser; token: string }> {
    const response = await apiService.post<IAuthResponse>('/auth/register', data);

    if (response.success && response.data) {
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    }

    throw new Error(response.error || 'Erro ao cadastrar');
  }

  async login(data: ILoginData): Promise<{ user: IUser; token: string }> {
    const response = await apiService.post<IAuthResponse>('/auth/login', data);

    if (response.success && response.data) {
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    }

    throw new Error(response.error || 'Erro ao fazer login');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): IUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export const authService = new AuthService();