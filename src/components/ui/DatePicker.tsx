/**
 * Custom Date Range Picker Component
 *
 * Styled date range picker using chakra-dayzed-datepicker with Provalo theme.
 * Install: npm install chakra-dayzed-datepicker date-fns dayzed
 */

'use client';

import { RangeDatepicker, SingleDatepicker } from 'chakra-dayzed-datepicker';

// Shared calendar styles
const calendarStyles = {
  dateNavBtnProps: {
    background: 'transparent',
    color: '#999999',
    _hover: {
      background: '#252525',
    },
  },
  dayOfMonthBtnProps: {
    defaultBtnProps: {
      background: 'transparent',
      color: '#e0e0e0',
      borderRadius: '8px',
      _hover: {
        background: '#252525',
      },
    },
    isInRangeBtnProps: {
      background: 'rgba(0, 217, 255, 0.3)',
      color: 'white',
      _hover: {
        background: 'rgba(0, 217, 255, 0.4)',
      },
    },
    selectedBtnProps: {
      background: '#00d9ff',
      color: '#000000',
      _hover: {
        background: '#00b8d9',
      },
    },
    todayBtnProps: {
      borderWidth: '1px',
      borderColor: '#00d9ff',
    },
  },
  popoverCompProps: {
    popoverContentProps: {
      background: '#1a1a1a',
      borderColor: '#333333',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      padding: '12px',
    },
    popoverBodyProps: {
      padding: 0,
    },
  },
  calendarPanelProps: {
    wrapperProps: {
      borderColor: 'transparent',
    },
    contentProps: {
      borderWidth: 0,
    },
    headerProps: {
      padding: '8px',
    },
    dividerProps: {
      display: 'none',
    },
  },
  weekdayLabelProps: {
    color: '#666666',
    fontWeight: '500',
    fontSize: '12px',
  },
  dateHeadingProps: {
    color: '#e0e0e0',
    fontWeight: '600',
    fontSize: '14px',
  },
};

interface DateRangePickerProps {
  selectedDates: Date[];
  onDateChange: (dates: Date[]) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  id?: string;
}

export function DateRangePicker({
  selectedDates,
  onDateChange,
  placeholder = 'Select date range',
  minDate,
  maxDate,
  disabled = false,
  id,
}: DateRangePickerProps) {
  return (
    <RangeDatepicker
      id={id}
      triggerVariant="input"
      selectedDates={selectedDates}
      onDateChange={onDateChange}
      minDate={minDate}
      maxDate={maxDate}
      usePortal
      configs={{
        dateFormat: 'MMM d, yyyy',
        firstDayOfWeek: 0,
      }}
      propsConfigs={{
        triggerBtnProps: {
          background: '#1a1a1a',
          borderColor: '#333333',
          borderWidth: '1px',
          borderRadius: '12px',
          height: '40px',
          fontSize: '14px',
          color: '#e0e0e0',
          fontWeight: 'normal',
          width: '100%',
          justifyContent: 'flex-start',
          paddingX: '16px',
          _hover: {
            background: '#1a1a1a',
            borderColor: '#333333',
          },
          _focus: {
            background: '#1a1a1a',
            borderColor: '#00d9ff',
            boxShadow: 'none',
            outline: 'none',
          },
          _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        },
        inputProps: {
          placeholder,
          background: '#1a1a1a',
          borderColor: '#333333',
          borderWidth: '1px',
          borderRadius: '12px',
          height: '44px',
          fontSize: '14px',
          color: '#e0e0e0',
          paddingX: '16px',
          _hover: {
            background: '#1a1a1a',
            borderColor: '#333333',
          },
          _focus: {
            background: '#1a1a1a',
            borderColor: '#00d9ff',
            boxShadow: 'none',
            outline: 'none',
          },
          _placeholder: {
            color: '#666666',
          },
          disabled: disabled,
        },
        ...calendarStyles,
      }}
    />
  );
}

/**
 * Single Date Picker Component
 */
interface SingleDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export function SingleDatePicker({
  date,
  onDateChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  name,
  id,
}: SingleDatePickerProps) {
  return (
    <SingleDatepicker
      id={id}
      name={name}
      triggerVariant="input"
      date={date}
      onDateChange={onDateChange}
      minDate={minDate}
      maxDate={maxDate}
      usePortal
      configs={{
        dateFormat: 'MMM d, yyyy',
        firstDayOfWeek: 0,
      }}
      propsConfigs={{
        triggerBtnProps: {
          background: '#1a1a1a',
          borderColor: '#333333',
          borderWidth: '1px',
          borderRadius: '12px',
          height: '44px',
          fontSize: '14px',
          color: '#e0e0e0',
          fontWeight: 'normal',
          width: '100%',
          justifyContent: 'flex-start',
          paddingX: '16px',
          _hover: {
            background: '#1a1a1a',
            borderColor: '#333333',
          },
          _focus: {
            background: '#1a1a1a',
            borderColor: '#00d9ff',
            boxShadow: 'none',
            outline: 'none',
          },
          _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        },
        inputProps: {
          placeholder,
          background: '#1a1a1a',
          borderColor: '#333333',
          borderWidth: '1px',
          borderRadius: '12px',
          height: '44px',
          fontSize: '14px',
          color: '#e0e0e0',
          paddingX: '16px',
          _hover: {
            background: '#1a1a1a',
            borderColor: '#333333',
          },
          _focus: {
            background: '#1a1a1a',
            borderColor: '#00d9ff',
            boxShadow: 'none',
            outline: 'none',
          },
          _placeholder: {
            color: '#666666',
          },
          disabled: disabled,
        },
        ...calendarStyles,
      }}
    />
  );
}
