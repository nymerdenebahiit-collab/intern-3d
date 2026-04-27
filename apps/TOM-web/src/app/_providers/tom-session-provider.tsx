'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { TomCurrentUser } from '@/lib/tom-types';

type SessionResponse = {
  user: TomCurrentUser;
};

type TomSessionContextValue = {
  user: TomCurrentUser | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  errorMessage: string;
  clearError: () => void;
  refresh: () => Promise<TomCurrentUser | null>;
  login: (userId: string) => Promise<TomCurrentUser | null>;
  logout: () => Promise<void>;
};

const TomSessionContext = createContext<TomSessionContextValue | null>(null);

async function readJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const data = (await response.json().catch(() => null)) as T | { error?: string; details?: unknown } | null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data as T;
}

export function TomSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TomCurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const hasLoadedRef = useRef(false);

  async function refresh() {
    try {
      const data = await readJson<SessionResponse>('/api/session', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });
      setUser(data.user);
      setErrorMessage('');
      return data.user;
    } catch (error) {
      setUser(null);
      const message = error instanceof Error ? error.message : 'Failed to load current session.';
      if (message !== 'Session not found.') {
        setErrorMessage(message);
      } else {
        setErrorMessage('');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function login(userId: string) {
    setIsAuthenticating(true);
    try {
      const data = await readJson<SessionResponse>('/api/session', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      setUser(data.user);
      setErrorMessage('');
      return data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in.';
      setErrorMessage(message);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function logout() {
    setIsAuthenticating(true);
    try {
      await readJson<{ ok: true }>('/api/session', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      setUser(null);
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out.';
      setErrorMessage(message);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }

  function clearError() {
    setErrorMessage('');
  }

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    void refresh();
  }, []);

  return (
    <TomSessionContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticating,
        errorMessage,
        clearError,
        refresh,
        login,
        logout,
      }}
    >
      {children}
    </TomSessionContext.Provider>
  );
}

export function useTomSession() {
  const context = useContext(TomSessionContext);
  if (!context) {
    throw new Error('useTomSession must be used within TomSessionProvider.');
  }

  return context;
}
