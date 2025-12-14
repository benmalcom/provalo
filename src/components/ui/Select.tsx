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
          background: 'var(--chakra-colors-brand-gray-2)',
          borderColor: 'var(--chakra-colors-brand-gray-4)',
          borderRadius: '8px',
          minHeight: '46px',
          height: '46px',
          boxShadow: 'none',
          transition: 'background-color 200ms ease, border-color 200ms ease',
          fontFamily: 'blackbird',
          fontWeight: '400',
          fontSize: '14px',
          '&:hover': {
            borderColor: 'var(--chakra-colors-brand-gray-5)',
          },
          ...(state.isFocused && {
            backgroundColor: 'var(--chakra-colors-brand-black)',
            borderColor: 'var(--chakra-colors-brand-gray-5)',
            boxShadow: 'none',
          }),
        }),
        placeholder: provided => ({
          ...provided,
          color: 'var(--chakra-colors-brand-gray-6)',
          fontSize: '14px',
          fontFamily: 'blackbird',
        }),
        singleValue: provided => ({
          ...provided,
          color: 'var(--chakra-colors-brand-gray-6)',
          fontSize: '14px',
          fontFamily: 'blackbird',
        }),
        input: provided => ({
          ...provided,
          fontSize: '14px',
          fontFamily: 'blackbird',
          color: 'var(--chakra-colors-brand-gray-6)',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected
            ? 'var(--chakra-colors-brand-gray-7)'
            : 'transparent',
          color: state.isSelected
            ? 'var(--chakra-colors-brand-white)'
            : 'var(--chakra-colors-brand-gray-4)',
          fontSize: '14px',
          fontFamily: 'blackbird',
          padding: '10px 12px',
          '&:hover': {
            backgroundColor: 'var(--chakra-colors-brand-gray-7)',
            color: 'var(--chakra-colors-brand-white)',
          },
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }),
        menu: provided => ({
          ...provided,
          background: 'var(--chakra-colors-brand-gray-2)',
          border: '1px solid var(--chakra-colors-brand-gray-4)',
          borderRadius: '8px',
          boxShadow: 'lg',
          overflow: 'hidden',
          mt: '4px',
          zIndex: 10,
        }),
        menuList: provided => ({
          ...provided,
          padding: '4px',
        }),
        valueContainer: provided => ({
          ...provided,
          padding: '0 12px',
        }),
        clearIndicator: provided => ({
          ...provided,
          cursor: 'pointer',
          color: 'var(--chakra-colors-brand-gray-4)',
          '&:hover': {
            color: 'var(--chakra-colors-brand-gray-6)',
          },
        }),
        dropdownIndicator: provided => ({
          ...provided,
          cursor: 'pointer',
          color: 'var(--chakra-colors-brand-gray-4)',
          '&:hover': {
            color: 'var(--chakra-colors-brand-gray-6)',
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
