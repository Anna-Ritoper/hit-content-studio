// EDHEC logo: path to static asset and inline SVG for embedding in visuals
// No em dashes (U+2014/U+2013) anywhere in this file

/** Path to the logo file served from public/ */
export const EDHEC_LOGO_PATH = '/Logo-EDHEC-2026.svg';

/**
 * Compact inline SVG snippet for embedding inside generated SVG visuals.
 * Renders the EDHEC wordmark with geometric symbol at a given position.
 * Use inside an SVG <g> element with a transform for positioning.
 */
export function edhecLogoSvgGroup(x: number, y: number, scale = 0.35): string {
  return `<g transform="translate(${x},${y}) scale(${scale})">
  <g transform="translate(60,60)" fill="#6B1E2E">
    <rect x="-4" y="-48" width="8" height="18" rx="1" transform="rotate(0)"/>
    <rect x="-6" y="-36" width="12" height="10" rx="1" transform="rotate(0)"/>
    <rect x="-4" y="-48" width="8" height="18" rx="1" transform="rotate(45)"/>
    <rect x="-6" y="-36" width="12" height="10" rx="1" transform="rotate(45)"/>
    <rect x="-4" y="-48" width="8" height="18" rx="1" transform="rotate(90)"/>
    <rect x="-6" y="-36" width="12" height="10" rx="1" transform="rotate(90)"/>
    <rect x="-4" y="-48" width="8" height="18" rx="1" transform="rotate(135)"/>
    <rect x="-6" y="-36" width="12" height="10" rx="1" transform="rotate(135)"/>
    <rect x="-4" y="-48" width="8" height="18" rx="1" transform="rotate(180)"/>
    <rect x="-6" y="-36" width="12" height="10" rx="1" transform="rotate(180)"/>
    <rect x="-4" y="-48" width="8" height="18" rx="1" transform="rotate(225)"/>
    <rect x="-6" y="-36" width="12" height="10" rx="1" transform="rotate(225)"/>
    <rect x="-4" y="-48" width="8" height="18" rx="1" transform="rotate(270)"/>
    <rect x="-6" y="-36" width="12" height="10" rx="1" transform="rotate(270)"/>
    <rect x="-4" y="-48" width="8" height="18" rx="1" transform="rotate(315)"/>
    <rect x="-6" y="-36" width="12" height="10" rx="1" transform="rotate(315)"/>
    <path d="M-8,-18 A20,20 0 0,1 8,-18" stroke="#6B1E2E" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M18,-8 A20,20 0 0,1 18,8" stroke="#6B1E2E" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M8,18 A20,20 0 0,1 -8,18" stroke="#6B1E2E" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M-18,8 A20,20 0 0,1 -18,-8" stroke="#6B1E2E" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>
  <text x="130" y="72" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="64" fill="#6B1E2E" letter-spacing="2">EDHEC</text>
  <text x="132" y="100" font-family="DM Sans, Helvetica Neue, sans-serif" font-weight="400" font-size="18" fill="#6B1E2E" letter-spacing="8">BUSINESS SCHOOL</text>
</g>`;
}
