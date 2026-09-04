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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register') &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }

    const text = await response.text();
    let result: any = {};
    if (text && text.trim()) {
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        result = { message: 'Server returned a non-JSON response. Please ensure backend server is running on port 5000.' };
      }
    }

    if (!response.ok || result.success === false) {
      throw new Error(result.message || `Server request failed with status ${response.status}.`);
    }

    return result;
  } catch (error: any) {
    if (error.message && error.message.includes('JSON')) {
      throw new Error('Backend server did not respond. Please ensure backend server is running (`npm run dev` in server directory).');
    }
    throw error;
  }
}
