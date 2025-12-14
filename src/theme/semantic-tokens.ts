/**
 * Semantic tokens for colors
 * These reference the base color tokens and provide semantic meaning
 * Use nested objects, not dot notation for keys
 */
export const semanticTokens = {
  colors: {
    // Background tokens
    bg: {
      canvas: { value: '{colors.dark.900}' },
      surface: { value: '{colors.dark.850}' },
      elevated: { value: '{colors.dark.800}' },
      hover: { value: 'rgba(255, 255, 255, 0.06)' },
    },

    // Border tokens - very subtle, barely visible
    border: {
      default: { value: 'rgba(255, 255, 255, 0.1)' },
      muted: { value: 'rgba(255, 255, 255, 0.06)' },
    },

    // Text tokens
    text: {
      primary: { value: '#F9FAFB' },
      secondary: { value: '{colors.dark.400}' },
      tertiary: { value: '{colors.dark.500}' },
      muted: { value: '{colors.dark.600}' },
    },

    // Accent tokens
    accent: {
      default: { value: '{colors.primary.500}' },
      hover: { value: '{colors.primary.400}' },
    },

    // Status tokens
    status: {
      success: { value: '{colors.success.500}' },
      warning: { value: '{colors.warning.500}' },
      error: { value: '{colors.error.500}' },
    },
  },
};
