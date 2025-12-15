/**
 * useUserProfile Hook
 *
 * This hook now wraps the UserContext for backward compatibility.
 * New code should use `useUser` from '@/contexts' directly.
 */

'use client';

import { useUser, type UserProfile, type UpdateProfileData } from '@/contexts';

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

/**
 * Hook to manage user profile
 * @deprecated Use `useUser` from '@/contexts' instead
 */
export function useUserProfile(): UseUserProfileReturn {
  const {
    user,
    isLoading,
    error,
    updateProfile,
    refresh,
    isUpdating,
    statementName,
  } = useUser();

  return {
    // Data
    user,
    profile: user, // Alias for backwards compatibility
    isLoading,
    error,

    // Actions
    updateProfile,
    refresh,

    // State
    isUpdating,

    // Computed
    statementName,
  };
}

// Re-export types for backward compatibility
export type { UserProfile, UpdateProfileData };
