import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  className: 'chakra-button',
  base: {
    fontWeight: 'semibold',
    borderRadius: 'xl',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      _hover: {
        transform: 'none',
        boxShadow: 'none',
      },
    },
  },
  variants: {
    variant: {
      solid: {
        bg: 'primary.500',
        color: 'white',
        _hover: {
          bg: 'primary.600',
          transform: 'translateY(-1px)',
        },
        _active: {
          bg: 'primary.700',
          transform: 'translateY(0)',
        },
      },
      outline: {
        border: '1px solid {colors.dark.700}',
        color: 'text.primary',
        bg: 'transparent',
        _hover: {
          bg: 'dark.800',
          border: '1px solid {colors.dark.600}',
        },
        _active: {
          bg: 'dark.700',
        },
      },
      ghost: {
        color: 'text.secondary',
        bg: 'transparent',
        _hover: {
          bg: 'dark.800',
          color: 'text.primary',
        },
        _active: {
          bg: 'dark.700',
        },
      },
    },
    size: {
      sm: {
        h: '8',
        px: '3',
        fontSize: 'sm',
      },
      md: {
        h: '10',
        px: '4',
        fontSize: 'sm',
      },
      lg: {
        h: '12',
        px: '6',
        fontSize: 'md',
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});
