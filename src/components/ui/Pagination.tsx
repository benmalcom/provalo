import {
  HStack,
  Button,
  Text,
  Flex,
  IconButton,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from 'react-icons/fi';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
  isLoading,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems <= pageSize) return null;

  // ✅ Create Chakra v3 Select collection
  const pageSizeCollection = createListCollection({
    items: pageSizeOptions.map(size => ({
      label: `${size} per page`,
      value: String(size),
    })),
  });

  return (
    <Flex
      justify="space-between"
      align="center"
      w="full"
      gap={4}
      flexDirection={{ base: 'column', md: 'row' }}
    >
      <HStack gap={4}>
        <Text fontSize="sm" color="whiteAlpha.700">
          Showing {startItem}-{endItem} of {totalItems} items
        </Text>

        {/* Correct Chakra UI v3 Select */}
        <Select.Root
          size="sm"
          width="auto"
          value={[String(pageSize)]}
          onValueChange={e => onPageSizeChange(Number(e.value))} // fixed handler
          disabled={isLoading}
          collection={pageSizeCollection}
          w="150px"
        >
          <Select.HiddenSelect />
          <Select.Label srOnly>Page size</Select.Label>

          <Select.Control
            bg="rgba(20,21,31,0.8)"
            border="1px solid rgba(104,120,255,0.2)"
            color="white"
            rounded="md"
            _hover={{ borderColor: 'rgba(104,120,255,0.4)' }}
          >
            <Select.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                px={2}
                _hover={{ bg: 'transparent' }}
              >
                <Select.ValueText placeholder="Page size" />
              </Button>
            </Select.Trigger>

            <Select.IndicatorGroup>
              <Select.Indicator />
              <Select.ClearTrigger asChild>
                <IconButton
                  size="xs"
                  variant="ghost"
                  aria-label="Clear page size"
                >
                  ✕
                </IconButton>
              </Select.ClearTrigger>
            </Select.IndicatorGroup>
          </Select.Control>

          <Select.Positioner>
            <Select.Content
              bg="#14151F"
              border="1px solid rgba(104,120,255,0.2)"
              rounded="md"
            >
              {/* ✅ Correctly pass the item from collection */}
              {pageSizeCollection.items.map(item => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </HStack>

      {/* ✅ Navigation Buttons */}
      <HStack gap={2}>
        <Tooltip content="First Page">
          <IconButton
            variant="outline"
            borderColor="rgba(104,120,255,0.3)"
            color="white"
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange(1)}
            aria-label="First page"
          >
            <FiChevronsLeft />
          </IconButton>
        </Tooltip>

        <Tooltip content="Previous Page">
          <IconButton
            variant="outline"
            borderColor="rgba(104,120,255,0.3)"
            color="white"
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <FiChevronLeft />
          </IconButton>
        </Tooltip>

        <Button
          disabled
          border="1px solid rgba(104,120,255,0.3)"
          bg="rgba(104,120,255,0.2)"
          color="white"
        >
          Page {currentPage} of {totalPages}
        </Button>

        <Tooltip content="Next Page">
          <IconButton
            variant="outline"
            borderColor="rgba(104,120,255,0.3)"
            color="white"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <FiChevronRight />
          </IconButton>
        </Tooltip>

        <Tooltip content="Last Page">
          <IconButton
            variant="outline"
            borderColor="rgba(104,120,255,0.3)"
            color="white"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(totalPages)}
            aria-label="Last page"
          >
            <FiChevronsRight />
          </IconButton>
        </Tooltip>
      </HStack>
    </Flex>
  );
}
