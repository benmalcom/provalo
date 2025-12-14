import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { colors } from './colors';
import { semanticTokens } from './semantic-tokens';
import {
  buttonRecipe,
  inputRecipe,
  textareaRecipe,
  cardSlotRecipe,
} from './recipes';
import { globalStyles } from './global';

const config = defineConfig({
  theme: {
    tokens: {
      colors,
    },
    semanticTokens,
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      textarea: textareaRecipe,
    },
    slotRecipes: {
      card: cardSlotRecipe,
    },
  },
  globalCss: globalStyles,
});

export const system = createSystem(defaultConfig, config);
