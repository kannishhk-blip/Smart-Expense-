const API_BASE_URL = '/api';

export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: any,
  customHeaders?: Record<string, string>
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const config: RequestInit = {
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
      window.location.href = '/login';
    }
  }

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'An unexpected error occurred. Please try again.');
  }

  return result;
}
