import { defineRecipe } from '@chakra-ui/react';

export const textareaRecipe = defineRecipe({
  className: 'chakra-textarea',
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
    resize: 'vertical',
    py: '3',
    px: '4',
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
        fontSize: 'sm',
        minH: '60px',
      },
      md: {
        fontSize: 'sm',
        minH: '80px',
      },
      lg: {
        fontSize: 'md',
        minH: '100px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
