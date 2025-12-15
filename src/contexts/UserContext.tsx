'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';

// Types
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  displayName: string | null;
  businessName: string | null;
  address: string | null;
  phone: string | null;
  createdAt: string;
  _count: {
    wallets: number;
    transactions: number;
    reports: number;
  };
}

export interface UpdateProfileData {
  displayName?: string | null;
  businessName?: string | null;
  address?: string | null;
  phone?: string | null;
}

interface UserContextValue {
  // Data
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  updateProfile: (data: UpdateProfileData) => Promise<UserProfile>;
  refresh: () => Promise<void>;

  // State
  isUpdating: boolean;

  // Computed
  /** Name to display on statements (displayName > name > email) */
  statementName: string;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const isAuthenticated = status === 'authenticated';

  /**
   * Fetch user profile from API
   */
  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch user');
      }
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (profileData: UpdateProfileData): Promise<UserProfile> => {
      setIsUpdating(true);

      try {
        const response = await fetch('/api/user', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update profile');
        }

        const { user: updatedUser } = await response.json();
        setUser(updatedUser);
        return updatedUser;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /**
   * Refresh user data
   */
  const refresh = useCallback(async (): Promise<void> => {
    await fetchUser();
  }, [fetchUser]);

  // Fetch user on mount and when auth status changes
  useEffect(() => {
    if (status !== 'loading') {
      fetchUser();
    }
  }, [status, fetchUser]);

  // Compute the name to use on statements
  const statementName = user?.displayName || user?.name || user?.email || '';

  const value: UserContextValue = {
    user,
    isLoading: status === 'loading' || isLoading,
    error,
    updateProfile,
    refresh,
    isUpdating,
    statementName,
    isAuthenticated,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Hook to access user context
 */
export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

/**
 * Hook for optional user access (doesn't throw if outside provider)
 */
export function useUserOptional(): UserContextValue | null {
  return useContext(UserContext);
}
