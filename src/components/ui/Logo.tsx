'use client';

import Image from 'next/image';
import { Box } from '@chakra-ui/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

const sizes = {
  sm: '32px',
  md: '40px',
  lg: '50px',
};

/**
 * Provalo Logo Component
 *
 * Uses SVG files for consistency:
 * - /images/logo.svg for icon only (100x100 viewBox)
 * - /images/logo-full.svg for full logo with text (200x80 viewBox)
 */
export function Logo({ size = 'md', iconOnly = false }: LogoProps) {
  const height = sizes[size];

  if (iconOnly) {
    return (
      <Box height={height} width={height}>
        <Image
          src="/images/logo.svg"
          alt="Provalo"
          width={100}
          height={100}
          style={{ height: '100%', width: 'auto' }}
          priority
        />
      </Box>
    );
  }

  return (
    <Box height={height} width="auto">
      <Image
        src="/images/logo-full.svg"
        alt="Provalo"
        width={200}
        height={80}
        style={{ height: '100%', width: 'auto' }}
        priority
      />
    </Box>
  );
}
