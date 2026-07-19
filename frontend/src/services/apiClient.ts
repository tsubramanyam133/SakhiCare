import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://sakhicare-lsl9.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For refresh token cookies
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized, attempt to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token using the http-only cookie
        const res = await axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        
        // You would typically update your auth store with the new access token here
        // useAuthStore.getState().setAccessToken(res.data.accessToken);
        
        // originalRequest.headers.Authorization = \`Bearer \${res.data.accessToken}\`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, meaning the user must log in again
        // useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
