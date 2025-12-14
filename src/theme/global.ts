// Global styles for Provalo
// Component-specific styles are in recipes

export const globalStyles = {
  // Font family - Inter from next/font
  'body, *': {
    fontFamily:
      'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Global box-sizing
  '*': {
    boxSizing: 'border-box',
  },

  // HTML base
  html: {
    height: '100%',
    WebkitFontSmoothing: 'antialiased',
    textShadow: '1px 1px 1px rgba(0,0,0,0.004)',
  },

  // Body base
  body: {
    height: '100%',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    bg: 'bg.canvas',
    color: 'text.primary',
    transition: 'background-color 0.3s ease',
    WebkitFontSmoothing: 'antialiased',
    textShadow: '1px 1px 1px rgba(0,0,0,0.004)',
  },

  // CSS Reset
  'html, body, div, span, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, abbr, address, cite, code, del, dfn, img, ins, kbd, q, samp, small, sub, sup, var, b, i, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, figcaption, figure, footer, header, hgroup, menu, nav, section, summary, time, mark, audio, video':
    {
      margin: 0,
      padding: 0,
      border: 0,
      fontSize: '100%',
      font: 'inherit',
      verticalAlign: 'baseline',
    },

  // HTML5 elements
  'article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section':
    {
      display: 'block',
    },

  // Horizontal rule
  hr: {
    display: 'block',
    height: '1px',
    border: 0,
    borderBottom: '2px solid #f0f1f2',
  },

  // Form elements
  'input, select': {
    verticalAlign: 'middle',
  },

  'select, input, textarea, button': {
    font: '99% sans-serif',
  },

  // Code elements
  'pre, code, kbd, samp': {
    fontFamily: 'monospace, sans-serif',
  },

  // Links
  'a, a:hover, a:active': {
    outline: 'none',
    textDecoration: 'none',
  },

  'a:link': {
    WebkitTapHighlightColor: 'transparent',
  },

  // Subscript/superscript
  'sub, sup': {
    fontSize: '50%',
    lineHeight: 0,
    position: 'relative',
  },

  sup: {
    top: '-0.9em',
  },

  // Headings
  'h1, h2, h3, h4, h5, h6': {
    fontWeight: 400,
    margin: 0,
    padding: 0,
  },

  // Lists
  ul: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },

  // Chakra UI overrides
  '.chakra-input, .chakra-input__field': {
    minWidth: 'unset !important',
  },

  // Input padding fix
  'input, .chakra-input': {
    paddingInlineStart: '16px !important',
    paddingInlineEnd: '16px !important',
  },

  // Datepicker input overrides
  '.chakra-popover__content input, [data-chakra-component="RangeDatepicker"] input, [data-chakra-component="SingleDatepicker"] input':
    {
      background: '#1a1a1a !important',
      borderColor: '#333333 !important',
      borderRadius: '12px !important',
      color: '#e0e0e0 !important',
    },
  '.chakra-popover__content input:focus, [data-chakra-component="RangeDatepicker"] input:focus, [data-chakra-component="SingleDatepicker"] input:focus':
    {
      background: '#1a1a1a !important',
      borderColor: '#00d9ff !important',
      boxShadow: 'none !important',
    },

  // Textarea padding fix
  'textarea, .chakra-textarea': {
    paddingInlineStart: '16px !important',
    paddingInlineEnd: '16px !important',
    paddingTop: '12px !important',
    paddingBottom: '12px !important',
  },

  // Button padding fix
  'button, .chakra-button': {
    paddingInlineStart: '16px !important',
    paddingInlineEnd: '16px !important',
  },
  'button[data-size="lg"], .chakra-button[data-size="lg"]': {
    paddingInlineStart: '24px !important',
    paddingInlineEnd: '24px !important',
  },
};
