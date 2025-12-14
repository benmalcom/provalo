import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  className: 'chakra-input',
  base: {
    width: '100%',
    minWidth: '0',
    outline: 'none',
    position: 'relative',
    appearance: 'none',
    bg: 'transparent',
    border: '1px solid',
    borderColor: 'border.default',
    borderRadius: 'xl',
    color: 'text.primary',
    transition: 'all 0.2s ease',
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
        h: '8',
        fontSize: 'sm',
      },
      md: {
        h: '10',
        fontSize: 'sm',
      },
      lg: {
        h: '12',
        fontSize: 'md',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
