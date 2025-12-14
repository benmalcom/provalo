'use client';

import React from 'react';
import { Alert, CloseButton, Box } from '@chakra-ui/react';

export interface ErrorBannerProps {
  message: string;
  title?: string;
  onDismiss?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  title,
}) => {
  return (
    <Box position="relative" width="100%" marginBottom="16px">
      <Alert.Root
        status="error"
        width="100%"
        borderRadius="8px"
        padding="12px 16px"
        paddingRight={onDismiss ? '48px' : '16px'}
        css={{
          background:
            'linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(185, 28, 28, 0.06) 100%)',
          border: '1px solid rgba(220, 38, 38, 0.25)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Alert.Content>
          {title && (
            <Alert.Title
              color="red.400"
              fontFamily="blackbird"
              fontWeight="500"
              fontSize="14px"
              lineHeight="1.4"
              marginBottom="4px"
              css={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </Alert.Title>
          )}
          <Alert.Description
            color="brand.gray.6"
            fontFamily="blackbird"
            fontWeight="400"
            fontSize="13px"
            lineHeight="1.5"
            css={{
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {message}
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      {/* Close Button - Positioned absolute top-right */}
      {onDismiss && (
        <CloseButton
          position="absolute"
          top="2px"
          right="2px"
          size="sm"
          color="brand.gray.5"
          onClick={onDismiss}
          transition="all 0.2s ease"
          css={{
            '&:hover': {
              color: 'token(colors.brand.white)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      )}
    </Box>
  );
};

export default ErrorBanner;
