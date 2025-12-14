// src/providers/ChakraProvider.tsx
'use client';

import { ChakraProvider as Provider } from '@chakra-ui/react';
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from '@/components/ui/color-mode';
import { system } from '@/theme';

export function ChakraProvider(props: ColorModeProviderProps) {
  return (
    <Provider value={system}>
      <ColorModeProvider {...props} />
    </Provider>
  );
}
