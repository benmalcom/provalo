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
    },
  },
  variants: {
    variant: {
      solid: {
        bg: 'primary.500',
        color: 'white',
        _hover: {
          bg: 'primary.600',
        },
      },
      outline: {
        borderWidth: '1px',
        borderColor: 'border.default',
        color: 'text.primary',
        bg: 'transparent',
        _hover: {
          bg: 'bg.hover',
          borderColor: 'primary.500',
        },
      },
      ghost: {
        color: 'text.secondary',
        bg: 'transparent',
        _hover: {
          bg: 'bg.hover',
          color: 'text.primary',
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
