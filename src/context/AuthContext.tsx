import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthSession {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session from localStorage on application bootstrap
  useEffect(() => {
    const sessionString = localStorage.getItem('italia_session');
    if (sessionString) {
      try {
        const session = JSON.parse(sessionString) as AuthSession;
        if (session && session.user && session.token) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch {
        localStorage.removeItem('italia_session');
      }
    }
    setIsLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<AuthSession>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('italia_session', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<AuthSession>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('italia_session', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('italia_session');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        signup,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
