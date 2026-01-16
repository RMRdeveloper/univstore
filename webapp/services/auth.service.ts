import { apiClient } from '@/lib';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    apiClient.setToken(response.accessToken);
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    apiClient.setToken(response.accessToken);
    return response;
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  logout(): void {
    apiClient.clearToken();
  },
};
