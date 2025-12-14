
export type NumberType = 'currency' | 'token' | 'price' | 'betting';

export interface NumberFormatOptions {
  type: NumberType;
  useSubscript?: boolean;
  useSuffixes?: boolean;
  decimals?: number;
  maxDecimals?: number;
  symbol?: string;
  currency?: string;
  maxZeros?: number;
  maxWidth?: number;
  includeSymbol?: boolean;
  locale?: string;
  symbolSpacing?: 'none' | 'micro' | 'hair' | 'thin' | 'narrow';
}

interface DefaultConfig {
  maxZeros: number;
  useSuffixes: boolean;
  useSubscript: boolean;
  decimals: number;
  scientificThreshold: number;
  symbolSpacing: 'none' | 'micro' | 'hair' | 'thin' | 'narrow';
}

export class NumberFormatter {
  private static readonly DEFAULT_CONFIGS: Record<NumberType, DefaultConfig> = {
    currency: {
      maxZeros: 5,
      useSuffixes: true,
      useSubscript: true,
      decimals: 6,
      scientificThreshold: Number.POSITIVE_INFINITY,
      symbolSpacing: 'hair',
    },
    token: {
      maxZeros: 3,
      useSuffixes: true,
      useSubscript: true,
      decimals: 10,
      scientificThreshold: Number.POSITIVE_INFINITY,
      symbolSpacing: 'hair',
    },
    price: {
      maxZeros: 7,
      useSuffixes: false,
      useSubscript: true,
      decimals: 8,
      scientificThreshold: Number.POSITIVE_INFINITY,
      symbolSpacing: 'none',
    },
    // ✅ NEW: Betting format
    betting: {
      maxZeros: 0, // Never use subscript for betting
      useSuffixes: false, // Never use K/M/B for betting amounts
      useSubscript: false, // Never use subscript
      decimals: 2, // Always 2 decimal places for USDC
      scientificThreshold: Number.POSITIVE_INFINITY,
      symbolSpacing: 'none', // No space: "$100.00"
    },
  };

  private static readonly SPACING_CHARS = {
    none: '',
    micro: '\u2006',
    hair: '\u200A',
    thin: '\u2009',
    narrow: '\u202F',
  };

  static format(
    value: number | string | null | undefined,
    options: NumberFormatOptions
  ): string {
    // Handle edge cases
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      isNaN(Number(value))
    ) {
      return NumberFormatter.formatZero(options);
    }

    const num = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (!isFinite(num)) {
      return NumberFormatter.formatZero(options);
    }

    if (num === 0) {
      return NumberFormatter.formatZero(options);
    }

    // Get configuration for this type
    const config = NumberFormatter.getConfig(options);

    // Apply formatting logic
    return NumberFormatter.applyFormatting(num, config, options);
  }

  private static getConfig(
    options: NumberFormatOptions
  ): DefaultConfig & NumberFormatOptions {
    const defaults = NumberFormatter.DEFAULT_CONFIGS[options.type];
    return {
      ...defaults,
      ...options,
      decimals: options.decimals ?? options.maxDecimals ?? defaults.decimals,
      symbolSpacing: options.symbolSpacing ?? defaults.symbolSpacing,
    };
  }

  private static getSpacingChar(
    spacing: 'none' | 'micro' | 'hair' | 'thin' | 'narrow'
  ): string {
    return NumberFormatter.SPACING_CHARS[spacing];
  }

  private static formatZero(options: NumberFormatOptions): string {
    const config = NumberFormatter.getConfig(options);
    const { currency = '', symbol = '', includeSymbol = true } = options;
    const spacingChar = NumberFormatter.getSpacingChar(config.symbolSpacing);
    const suffix = includeSymbol && symbol ? `${spacingChar}${symbol}` : '';

    // ✅ For betting, always show 2 decimals
    if (options.type === 'betting') {
      return `${currency}0.00${suffix}`;
    }

    return `${currency}0${suffix}`;
  }

  private static applyFormatting(
    num: number,
    config: DefaultConfig & NumberFormatOptions,
    options: NumberFormatOptions
  ): string {
    const absNum = Math.abs(num);
    const { currency = '', symbol = '', includeSymbol = true } = options;
    const spacingChar = NumberFormatter.getSpacingChar(config.symbolSpacing);

    // Handle large numbers with K/M/B/T notation
    if (config.useSuffixes && absNum >= 1000) {
      const formatted = NumberFormatter.formatWithSuffixes(num);
      const suffix = includeSymbol && symbol ? `${spacingChar}${symbol}` : '';
      return `${currency}${formatted}${suffix}`;
    }

    // Handle normal and small numbers
    if (absNum >= 1 || options.type === 'betting') {
      const formatted = NumberFormatter.formatDecimal(
        num,
        config.decimals,
        config.locale,
        options.type === 'betting' // ✅ Force minimum decimals for betting
      );
      const suffix = includeSymbol && symbol ? `${spacingChar}${symbol}` : '';
      return `${currency}${formatted}${suffix}`;
    } else {
      return NumberFormatter.formatSmallNumber(num, config, options);
    }
  }

  private static formatWithSuffixes(num: number): string {
    const absNum = Math.abs(num);
    if (absNum >= 1_000_000_000_000) {
      return `${(num / 1_000_000_000_000).toFixed(2)}T`;
    } else if (absNum >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (absNum >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    } else if (absNum >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toString();
  }

  private static formatDecimal(
    num: number,
    maxDecimals: number,
    locale = 'en-US',
    forceMinDecimals = false // ✅ NEW: Force minimum decimals for betting
  ): string {
    try {
      return num.toLocaleString(locale, {
        maximumFractionDigits: maxDecimals,
        minimumFractionDigits: forceMinDecimals ? maxDecimals : 0, // ✅ Fixed
      });
    } catch {
      return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
    }
  }

  private static formatSmallNumber(
    num: number,
    config: DefaultConfig & NumberFormatOptions,
    options: NumberFormatOptions
  ): string {
    const { currency = '', symbol = '', includeSymbol = true } = options;
    const spacingChar = NumberFormatter.getSpacingChar(config.symbolSpacing);
    const suffix = includeSymbol && symbol ? `${spacingChar}${symbol}` : '';

    const str = Math.abs(num).toFixed(30);
    const decimalIndex = str.indexOf('.');
    let consecutiveZeros = 0;

    if (decimalIndex !== -1) {
      for (let i = decimalIndex + 1; i < str.length; i++) {
        if (str[i] === '0') {
          consecutiveZeros++;
        } else {
          break;
        }
      }
    }

    if (config.useSubscript && consecutiveZeros > config.maxZeros) {
      const subscriptFormatted = NumberFormatter.formatWithSubscript(
        num,
        consecutiveZeros
      );
      return `${currency}${subscriptFormatted}${suffix}`;
    } else if (consecutiveZeros > config.scientificThreshold) {
      const scientificFormatted = num.toExponential(2);
      return `${currency}${scientificFormatted}${suffix}`;
    } else {
      const decimalFormatted = NumberFormatter.formatDecimal(
        num,
        Math.min(consecutiveZeros + 4, config.decimals),
        config.locale
      );
      return `${currency}${decimalFormatted}${suffix}`;
    }
  }

  private static formatWithSubscript(
    num: number,
    consecutiveZeros: number
  ): string {
    const str = Math.abs(num).toFixed(30);
    const decimalIndex = str.indexOf('.');
    if (decimalIndex === -1) return num.toString();

    let firstNonZeroIndex = -1;
    for (let i = decimalIndex + 1 + consecutiveZeros; i < str.length; i++) {
      if (str[i] !== '0') {
        firstNonZeroIndex = i;
        break;
      }
    }

    if (firstNonZeroIndex === -1) return num.toString();

    const significantPart = str.substring(
      firstNonZeroIndex,
      firstNonZeroIndex + 4
    );

    const sign = num < 0 ? '-' : '';
    return `${sign}0.0₍${consecutiveZeros}₎${significantPart}`;
  }
}

// Convenience functions
export const formatCurrency = (
  value: number | string | null | undefined,
  options: Omit<NumberFormatOptions, 'type'> = {}
): string => {
  return NumberFormatter.format(value, { ...options, type: 'currency' });
};

export const formatToken = (
  value: number | string | null | undefined,
  options: Omit<NumberFormatOptions, 'type'> = {}
): string => {
  return NumberFormatter.format(value, { ...options, type: 'token' });
};

export const formatPrice = (
  value: number | string | null | undefined,
  options: Omit<NumberFormatOptions, 'type'> = {}
): string => {
  return NumberFormatter.format(value, { ...options, type: 'price' });
};

// NEW: Betting formatter
export const formatBetting = (
  value: number | string | null | undefined,
  options: Omit<NumberFormatOptions, 'type'> = {}
): string => {
  return NumberFormatter.format(value, {
    ...options,
    type: 'betting',
    currency: options.currency ?? '$', // Default to $ for USDC
  });
};

export const formatNumber = NumberFormatter.format;

export default NumberFormatter;
