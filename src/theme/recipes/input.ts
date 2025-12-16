import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  className: 'chakra-input',
  base: {
    width: '100%',
    minWidth: '0',
    outline: 'none',
    position: 'relative',
    appearance: 'none',
    bg: 'dark.850',
    border: '1px solid {colors.dark.700}',
    borderRadius: 'xl',
    color: 'text.primary',
    transition: 'all 0.2s ease',
    _placeholder: {
      color: 'text.tertiary',
    },
    _hover: {
      border: '1px solid {colors.dark.600}',
    },
    _focus: {
      border: '1px solid {colors.primary.500}',
      boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
      outline: 'none',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      _hover: {
        border: '1px solid {colors.dark.700}',
      },
    },
  },
  variants: {
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
        px: '4',
        fontSize: 'md',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
