import { defineRecipe } from '@chakra-ui/react';

export const textareaRecipe = defineRecipe({
  className: 'chakra-textarea',
  base: {
    width: '100%',
    minWidth: '0',
    outline: 'none',
    position: 'relative',
    appearance: 'none',
    bg: 'bg.surface',
    border: '1px solid',
    borderColor: 'border.default',
    borderRadius: 'xl',
    color: 'text.primary',
    transition: 'all 0.2s ease',
    resize: 'vertical',
    _placeholder: {
      color: 'text.tertiary',
    },
    _hover: {
      borderColor: 'border.default',
    },
    _focus: {
      borderColor: 'primary.500',
      boxShadow: 'none',
      outline: 'none',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
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
