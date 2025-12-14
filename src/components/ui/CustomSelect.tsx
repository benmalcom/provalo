/**
 * Custom Select Component
 *
 * Styled select using chakra-react-select with Provalo theme.
 * Install: npm install chakra-react-select
 */

'use client';

import { Select, type GroupBase, type Props } from 'chakra-react-select';

export function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  return (
    <Select<Option, IsMulti, Group>
      {...props}
      selectedOptionStyle="color"
      chakraStyles={{
        container: provided => ({
          ...provided,
          width: '100%',
        }),
        control: (provided, state) => ({
          ...provided,
          background: 'var(--chakra-colors-bg-surface)',
          borderColor: 'var(--chakra-colors-border-default)',
          borderRadius: '12px',
          minHeight: '40px',
          height: '40px',
          boxShadow: 'none',
          transition: 'background-color 200ms ease, border-color 200ms ease',
          fontSize: '14px',
          '&:hover': {
            borderColor: 'var(--chakra-colors-border-default)',
          },
          ...(state.isFocused && {
            backgroundColor: 'var(--chakra-colors-bg-surface)',
            borderColor: 'var(--chakra-colors-primary-500)',
            boxShadow: 'none',
          }),
        }),
        placeholder: provided => ({
          ...provided,
          color: 'var(--chakra-colors-text-tertiary)',
          fontSize: '14px',
        }),
        singleValue: provided => ({
          ...provided,
          color: 'var(--chakra-colors-text-primary)',
          fontSize: '14px',
        }),
        input: provided => ({
          ...provided,
          fontSize: '14px',
          color: 'var(--chakra-colors-text-primary)',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected
            ? 'var(--chakra-colors-primary-500)'
            : 'transparent',
          color: state.isSelected
            ? 'white'
            : 'var(--chakra-colors-text-primary)',
          fontSize: '14px',
          padding: '10px 12px',
          '&:hover': {
            backgroundColor: state.isSelected
              ? 'var(--chakra-colors-primary-500)'
              : 'var(--chakra-colors-bg-hover)',
            color: state.isSelected
              ? 'white'
              : 'var(--chakra-colors-text-primary)',
          },
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }),
        menu: provided => ({
          ...provided,
          background: 'var(--chakra-colors-bg-surface)',
          border: '1px solid var(--chakra-colors-border-default)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          mt: '4px',
          zIndex: 10,
        }),
        menuList: provided => ({
          ...provided,
          padding: '4px',
          background: 'var(--chakra-colors-bg-surface)',
        }),
        valueContainer: provided => ({
          ...provided,
          padding: '0 16px',
        }),
        clearIndicator: provided => ({
          ...provided,
          cursor: 'pointer',
          color: 'var(--chakra-colors-text-tertiary)',
          '&:hover': {
            color: 'var(--chakra-colors-text-secondary)',
          },
        }),
        dropdownIndicator: provided => ({
          ...provided,
          cursor: 'pointer',
          color: 'var(--chakra-colors-text-tertiary)',
          '&:hover': {
            color: 'var(--chakra-colors-text-secondary)',
          },
          padding: '0 12px',
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
      }}
      menuPortalTarget={
        typeof document !== 'undefined' ? document.body : undefined
      }
      styles={{ menuPortal: base => ({ ...base, zIndex: 1400 }) }}
    />
  );
}
