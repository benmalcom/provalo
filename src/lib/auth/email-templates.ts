/**
 * Email Templates for Provalo
 *
 * Beautiful, branded email templates for magic link authentication.
 */

/**
 * Brand Colors
 */
const BRAND = {
  primary: '#00d9ff', // Cyan - primary brand color
  primaryDark: '#0891b2', // Darker cyan for hover
  background: '#0a0a0a', // Dark background
  surface: '#1a1a1a', // Card background
  surfaceLight: '#252525', // Lighter surface
  text: '#e0e0e0', // Primary text
  textMuted: '#888888', // Muted text
  textDark: '#666666', // Darker muted text
  border: '#333333', // Border color
  success: '#10B981', // Green for success
};

/**
 * HTML email template for magic links
 */
export function getMagicLinkHtml({
  url,
}: {
  url: string;
  email?: string;
}): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Sign in to Provalo</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.background}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    Your magic link to sign in to Provalo - valid for 24 hours
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND.background};">
    <tr>
      <td align="center" style="padding: 48px 24px;">
        
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px;">
          
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <!-- Logo Icon (SVG as background) -->
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, ${BRAND.primary} 0%, #0891b2 100%); border-radius: 12px; display: inline-block; vertical-align: middle;"></div>
                  </td>
                  <td style="vertical-align: middle; padding-left: 12px;">
                    <span style="font-size: 28px; font-weight: 700; color: ${BRAND.text}; letter-spacing: -0.5px;">
                      Provalo
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND.surface}; border-radius: 20px; border: 1px solid ${BRAND.border}; overflow: hidden;">
                
                <!-- Gradient Top Border -->
                <tr>
                  <td style="height: 4px; background: linear-gradient(90deg, ${BRAND.primary} 0%, #0891b2 50%, ${BRAND.success} 100%);"></td>
                </tr>
                
                <!-- Card Content -->
                <tr>
                  <td style="padding: 48px 40px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      
                      <!-- Icon -->
                      <tr>
                        <td align="center" style="padding-bottom: 24px;">
                          <div style="width: 64px; height: 64px; background-color: ${BRAND.surfaceLight}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="font-size: 28px;">✨</span>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Heading -->
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: ${BRAND.text}; line-height: 1.3;">
                            Sign in to Provalo
                          </h1>
                        </td>
                      </tr>
                      
                      <!-- Subtext -->
                      <tr>
                        <td align="center" style="padding-bottom: 32px;">
                          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${BRAND.textMuted};">
                            Click the button below to securely sign in.<br>
                            No password needed!
                          </p>
                        </td>
                      </tr>
                      
                      <!-- CTA Button -->
                      <tr>
                        <td align="center" style="padding-bottom: 32px;">
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="border-radius: 12px; background: linear-gradient(135deg, ${BRAND.primary} 0%, #0891b2 100%);">
                                <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 600; color: #000000; text-decoration: none; border-radius: 12px;">
                                  Sign in to Provalo →
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Divider -->
                      <tr>
                        <td style="padding-bottom: 24px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="border-top: 1px solid ${BRAND.border};"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Link Expiry Info -->
                      <tr>
                        <td align="center" style="padding-bottom: 24px;">
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="background-color: ${BRAND.surfaceLight}; border-radius: 8px; padding: 12px 20px;">
                                <span style="font-size: 13px; color: ${BRAND.textMuted};">
                                  ⏱️ This link expires in <strong style="color: ${BRAND.text};">24 hours</strong>
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Alternative Link -->
                      <tr>
                        <td align="center">
                          <p style="margin: 0; font-size: 13px; color: ${BRAND.textDark}; line-height: 1.6;">
                            Button not working? Copy and paste this link:<br>
                            <a href="${url}" style="color: ${BRAND.primary}; word-break: break-all; text-decoration: none;">
                              ${url.length > 60 ? url.substring(0, 60) + '...' : url}
                            </a>
                          </p>
                        </td>
                      </tr>
                      
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Security Note -->
          <tr>
            <td align="center" style="padding-top: 32px; padding-bottom: 16px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: rgba(16, 185, 129, 0.1); border-radius: 8px; padding: 12px 20px; border: 1px solid rgba(16, 185, 129, 0.2);">
                    <span style="font-size: 13px; color: ${BRAND.success};">
                      🔒 This is a secure, one-time link just for you
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: ${BRAND.textDark};">
                If you didn't request this email, you can safely ignore it.
              </p>
              <p style="margin: 0; font-size: 12px; color: ${BRAND.textDark};">
                © ${currentYear} Provalo · Crypto income verification made simple
              </p>
            </td>
          </tr>
          
          <!-- Social Links -->
          <tr>
            <td align="center" style="padding-top: 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://provalo.io" style="color: ${BRAND.textDark}; font-size: 12px; text-decoration: none;">Website</a>
                  </td>
                  <td style="color: ${BRAND.textDark};">·</td>
                  <td style="padding: 0 8px;">
                    <a href="https://twitter.com/provalo" style="color: ${BRAND.textDark}; font-size: 12px; text-decoration: none;">Twitter</a>
                  </td>
                  <td style="color: ${BRAND.textDark};">·</td>
                  <td style="padding: 0 8px;">
                    <a href="mailto:support@provalo.io" style="color: ${BRAND.textDark}; font-size: 12px; text-decoration: none;">Support</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Plain text email template for magic links
 */
export function getMagicLinkText({ url }: { url: string }): string {
  const currentYear = new Date().getFullYear();

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ✨ PROVALO - Sign In Link
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Click this link to sign in to your account:

${url}

⏱️ This link expires in 24 hours.

🔒 This is a secure, one-time link just for you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you didn't request this email, you can safely ignore it.

© ${currentYear} Provalo
Crypto income verification made simple

Website: https://provalo.io
Support: support@provalo.io
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

/**
 * Email subject line
 */
export const MAGIC_LINK_SUBJECT = '✨ Sign in to Provalo';
