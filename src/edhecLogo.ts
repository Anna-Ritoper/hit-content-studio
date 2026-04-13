// EDHEC logo: path to static asset and inline SVG for embedding in visuals
// No em dashes (U+2014/U+2013) anywhere in this file

/** Path to the logo file served from public/ (from EDHEC official toolkit 2025-2026) */
export const EDHEC_LOGO_PATH = '/EDHEC_Logo_horizontal.png';
export const EDHEC_LOGO_WHITE_PATH = '/EDHEC_Logo_horizontal_white.png';
export const EDHEC_LOGO_DARK_PATH = '/EDHEC_Logo_horizontal_dark.png';

/**
 * Compact inline SVG snippet for embedding inside generated SVG visuals.
 * Renders the EDHEC wordmark with geometric symbol at a given position.
 * Use inside an SVG <g> element with a transform for positioning.
 */
/**
 * Renders the official EDHEC horizontal logo PNG as an SVG <image> element.
 * variant controls which PNG to load (dark for light backgrounds, white for dark).
 * The PNG native ratio is 2213x837 (about 2.64:1). width defaults to 260 so the
 * image height stays near 98px at scale=1.
 */
export function edhecLogoSvgGroup(
  x: number,
  y: number,
  scale = 0.35,
  variant: 'dark' | 'white' = 'dark'
): string {
  const baseW = 520;
  const baseH = Math.round(baseW * 837 / 2213);
  const href = variant === 'white' ? EDHEC_LOGO_WHITE_PATH : EDHEC_LOGO_DARK_PATH;
  return `<g transform="translate(${x},${y}) scale(${scale})"><image href="${href}" width="${baseW}" height="${baseH}" preserveAspectRatio="xMidYMid meet"/></g>`;
}
