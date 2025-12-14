import { defineSlotRecipe } from '@chakra-ui/react';

export const cardSlotRecipe = defineSlotRecipe({
  className: 'chakra-card',
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: {
      bg: 'bg.surface',
      color: 'text.primary',
      borderRadius: '2xl',
      border: '1px solid',
      borderColor: 'border.muted',
      overflow: 'hidden',
    },
    header: {
      p: '6',
      pb: '0',
      fontWeight: 'semibold',
      fontSize: 'lg',
    },
    body: {
      p: '6',
      fontSize: 'md',
    },
    footer: {
      p: '6',
      pt: '0',
    },
  },
});
