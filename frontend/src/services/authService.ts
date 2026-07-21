import { apiClient } from './apiClient';

export const AuthService = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('sakhi_cycle_logs');
    // Redirect to admin login page without a full reload
    window.location.href = '/admin';
  }
};
