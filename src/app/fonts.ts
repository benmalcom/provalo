import localFont from 'next/font/local';

export const blackbird = localFont({
  src: [
    {
      path: '../../public/fonts/Blackbird-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Blackbird-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Blackbird-Demi.woff',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-blackbird',
  display: 'swap',
});

export const mdNichrome = localFont({
  src: '../../public/fonts/MDNichrome-Dark.woff',
  weight: '400',
  variable: '--font-md-nichrome',
  display: 'swap',
});
