'use client';

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {toast => (
          <Toast.Root
            data-testid={`toast-${toast.id}`}
            data-toast-type={toast.type}
            width={{ md: 'sm' }}
            bg="brand.gray.2"
            borderColor="brand.gray.3"
            borderWidth="1px"
            borderRadius="brand"
            color="brand.white"
          >
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="brand.yellow" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && (
                <Toast.Title
                  data-testid={`toast-${toast.id}-title`}
                  color="brand.white"
                  fontWeight="600"
                >
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description
                  data-testid={`toast-${toast.id}-description`}
                  color="brand.gray.4"
                >
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger
                color="brand.yellow"
                _hover={{ color: 'brand.yellow', opacity: 0.8 }}
              >
                {toast.action.label}
              </Toast.ActionTrigger>
            )}
            {toast.closable && (
              <Toast.CloseTrigger
                color="brand.gray.4"
                _hover={{ color: 'brand.white' }}
              />
            )}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
