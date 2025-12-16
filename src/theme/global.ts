// Global styles for Provalo
// All styles in one place - Chakra v3 globalCss

export const globalStyles = {
  // Box-sizing for all elements
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  // HTML base
  html: {
    minHeight: '100%',
    scrollBehavior: 'smooth',
    colorScheme: 'dark',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
  },

  // Body base
  body: {
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    bg: '#0a0a0a',
    color: '#f9fafb',
    fontFamily:
      'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    overflowX: 'hidden',
  },

  // Minimal reset
  'h1, h2, h3, h4, h5, h6, p, blockquote, pre, figure, dl, dd': {
    margin: 0,
  },

  ul: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },

  // Links
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },

  // Horizontal rule
  hr: {
    border: 0,
    height: '1px',
    bg: 'whiteAlpha.100',
  },

  // Code elements
  'pre, code, kbd, samp': {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
  },

  // Selection color
  '::selection': {
    background: 'rgba(6, 182, 212, 0.3)',
    color: 'white',
  },

  // Focus visible for accessibility
  ':focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.500',
    outlineOffset: '2px',
  },

  // Remove default button styles
  button: {
    background: 'none',
    cursor: 'pointer',
  },

  // Form elements inherit font
  'input, textarea, select, button': {
    font: 'inherit',
  },
};
