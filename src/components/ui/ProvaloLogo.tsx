export const ProvaloLogo = ({
  size = 40,
  variant = 'full',
  className = '',
}) => {
  // Icon only - Document with verification checkmark
  const IconOnly = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Document background */}
      <rect
        x="8"
        y="5"
        width="24"
        height="30"
        rx="3"
        fill="url(#doc-gradient)"
      />
      <rect
        x="8"
        y="5"
        width="24"
        height="30"
        rx="3"
        stroke="#06B6D4"
        strokeWidth="1.5"
      />

      {/* Document lines */}
      <line
        x1="13"
        y1="12"
        x2="27"
        y2="12"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="17"
        x2="24"
        y2="17"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="22"
        x2="27"
        y2="22"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Verification badge circle */}
      <circle cx="28" cy="28" r="8" fill="#10B981" />
      <circle cx="28" cy="28" r="8" stroke="#0A0E14" strokeWidth="2" />

      {/* Checkmark in badge */}
      <path
        d="M24.5 28L26.5 30L31.5 25"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient
          id="doc-gradient"
          x1="20"
          y1="5"
          x2="20"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0891B2" stopOpacity="0.15" />
          <stop offset="1" stopColor="#155E75" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );

  // Full logo with text
  const FullLogo = () => (
    <svg
      width={size * 4}
      height={size}
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Document Icon */}
      <rect
        x="8"
        y="5"
        width="24"
        height="30"
        rx="3"
        fill="url(#doc-gradient-full)"
      />
      <rect
        x="8"
        y="5"
        width="24"
        height="30"
        rx="3"
        stroke="#06B6D4"
        strokeWidth="1.5"
      />

      <line
        x1="13"
        y1="12"
        x2="27"
        y2="12"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="17"
        x2="24"
        y2="17"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="22"
        x2="27"
        y2="22"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <circle cx="28" cy="28" r="8" fill="#10B981" />
      <circle cx="28" cy="28" r="8" stroke="#0A0E14" strokeWidth="2" />

      <path
        d="M24.5 28L26.5 30L31.5 25"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Text: Provalo */}
      <text
        x="45"
        y="27"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="700"
        fill="#F9FAFB"
        letterSpacing="-0.5"
      >
        Provalo
      </text>

      <defs>
        <linearGradient
          id="doc-gradient-full"
          x1="20"
          y1="5"
          x2="20"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0891B2" stopOpacity="0.15" />
          <stop offset="1" stopColor="#155E75" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );

  return variant === 'full' ? <FullLogo /> : <IconOnly />;
};

export default ProvaloLogo;
