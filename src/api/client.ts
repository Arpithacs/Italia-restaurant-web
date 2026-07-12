export interface ApiError extends Error {
  status?: number;
  errorMsg?: string;
}

const API_BASE = (import.meta as any).env.VITE_API_URL || '/api';

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('/') ? `${API_BASE}${endpoint}` : `${API_BASE}/${endpoint}`;

  // Read authentication token from localStorage
  const sessionString = localStorage.getItem('italia_session');
  let token: string | null = null;
  if (sessionString) {
    try {
      const parsed = JSON.parse(sessionString);
      token = parsed.token || null;
    } catch {
      // Ignore parse failure
    }
  }

  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // Guard against non-JSON error pages
    }

    const message = errorData.error || `HTTP error! status: ${response.status}`;
    const err = new Error(message) as ApiError;
    err.status = response.status;
    err.errorMsg = message;
    throw err;
  }

  // Handle empty or 204 responses gracefully
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
