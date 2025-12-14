'use client';

import { Box } from '@chakra-ui/react';
import ProvaloLogo from '@/components/ui/ProvaloLogo';

export default function LogoShowcase() {
  return (
    <div
      style={{
        background: '#0A0E14',
        minHeight: '100vh',
        padding: '48px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1
            style={{
              color: '#F9FAFB',
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            Provalo Brand Assets
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
            Professional crypto income verification - refined color palette &
            logo
          </p>
        </div>

        {/* Logo Variants */}
        <div
          style={{
            background: '#141922',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              color: '#F9FAFB',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
            }}
          >
            Logo Variants
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Full Logo */}
            <div>
              <div
                style={{
                  background: '#1A2028',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <ProvaloLogo size={40} variant="full" />
              </div>
              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                Full Logo
              </p>
            </div>

            {/* Icon Only - Medium */}
            <div>
              <div
                style={{
                  background: '#1A2028',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <ProvaloLogo size={40} variant="icon" />
              </div>
              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                Icon Only (40px)
              </p>
            </div>

            {/* Icon Only - Small */}
            <div>
              <div
                style={{
                  background: '#1A2028',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <ProvaloLogo size={24} variant="icon" />
              </div>
              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                Icon Only (24px)
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div
          style={{
            background: '#141922',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              color: '#F9FAFB',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
            }}
          >
            Color Palette
          </h2>

          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Primary Colors */}
            <div>
              <h3
                style={{
                  color: '#F9FAFB',
                  fontSize: '16px',
                  marginBottom: '12px',
                }}
              >
                Primary (Trust & Professional)
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['#06B6D4', '#0891B2', '#0E7490', '#155E75'].map(color => (
                  <div key={color} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        background: color,
                        borderRadius: '8px',
                        marginBottom: '8px',
                      }}
                    />
                    <p
                      style={{
                        color: '#9CA3AF',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Colors */}
            <div>
              <h3
                style={{
                  color: '#F9FAFB',
                  fontSize: '16px',
                  marginBottom: '12px',
                }}
              >
                Success (Verified Badge)
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['#10B981', '#059669', '#047857'].map(color => (
                  <div key={color} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        background: color,
                        borderRadius: '8px',
                        marginBottom: '8px',
                      }}
                    />
                    <p
                      style={{
                        color: '#9CA3AF',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3
                style={{
                  color: '#F9FAFB',
                  fontSize: '16px',
                  marginBottom: '12px',
                }}
              >
                Accent (Premium & Highlights)
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['#F59E0B', '#D97706', '#B45309'].map(color => (
                  <div key={color} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        background: color,
                        borderRadius: '8px',
                        marginBottom: '8px',
                      }}
                    />
                    <p
                      style={{
                        color: '#9CA3AF',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Surface Colors */}
            <div>
              <h3
                style={{
                  color: '#F9FAFB',
                  fontSize: '16px',
                  marginBottom: '12px',
                }}
              >
                Surfaces (Dark Mode)
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { color: '#0A0E14', label: 'Base' },
                  { color: '#141922', label: 'Elevated' },
                  { color: '#1A2028', label: 'Hover' },
                  { color: '#2D3748', label: 'Border' },
                ].map(({ color, label }) => (
                  <div key={color} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        background: color,
                        borderRadius: '8px',
                        marginBottom: '8px',
                        border: '1px solid #2D3748',
                      }}
                    />
                    <p style={{ color: '#9CA3AF', fontSize: '12px' }}>
                      {label}
                    </p>
                    <p
                      style={{
                        color: '#6B7280',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div
          style={{
            background: '#141922',
            borderRadius: '12px',
            padding: '32px',
          }}
        >
          <h2
            style={{
              color: '#F9FAFB',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
            }}
          >
            Usage Examples
          </h2>

          {/* Verified Badge */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10B981',
                borderRadius: '6px',
                padding: '6px 12px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M5 8L7 10L11 6"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  color: '#10B981',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Verified by acme.com
              </span>
            </div>
          </div>

          {/* Primary Button */}
          <div style={{ marginBottom: '24px' }}>
            <button
              style={{
                background: '#06B6D4',
                color: '#F9FAFB',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#0891B2')}
              onMouseOut={e => (e.currentTarget.style.background = '#06B6D4')}
            >
              Generate Report
            </button>
          </div>

          {/* Card Example */}
          <div
            style={{
              background: '#1A2028',
              border: '1px solid #2D3748',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <ProvaloLogo size={32} variant="icon" />
              <div>
                <h3
                  style={{
                    color: '#F9FAFB',
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  Income Report
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  PV-2024-A8K92J
                </p>
              </div>
            </div>
            <div
              style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}
            >
              Professional crypto income verification for banks, landlords, and
              immigration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
