/**
 * useUserProfile Hook
 *
 * Manages the current user's profile data.
 * Handles fetching and updating profile information.
 */

'use client';

import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';

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

interface UseUserProfileReturn {
  // Data
  user: UserProfile | null;
  profile: UserProfile | null; // Alias
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
}

// Fetcher for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch');
  }
  return response.json();
};

/**
 * Hook to manage user profile
 */
export function useUserProfile(): UseUserProfileReturn {
  // Fetch user profile with SWR
  const { data, error, isLoading } = useSWR<{ user: UserProfile }>(
    '/api/user',
    fetcher
  );

  // Action state
  const [isUpdating, setIsUpdating] = useState(false);

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
          const error = await response.json();
          throw new Error(error.error || 'Failed to update profile');
        }

        const { user } = await response.json();

        // Refresh profile data
        await mutate('/api/user');

        return user;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /**
   * Refresh profile data
   */
  const refresh = useCallback(async (): Promise<void> => {
    await mutate('/api/user');
  }, []);

  // Compute the name to use on statements
  const user = data?.user || null;
  const statementName = user?.displayName || user?.name || user?.email || '';

  return {
    // Data
    user,
    profile: user, // Alias for backwards compatibility
    isLoading,
    error: error || null,

    // Actions
    updateProfile,
    refresh,

    // State
    isUpdating,

    // Computed
    statementName,
  };
}
