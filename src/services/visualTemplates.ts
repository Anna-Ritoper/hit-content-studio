// Deterministic carousel slide builders used by BOTH the Visual Studio
// preview AND the PPTX exporter. Whatever the user types here is exactly what
// ends up in the preview SVG and in the PPTX.
//
// No em dashes (U+2014) or en dashes (U+2013) anywhere in this file.

import { EDHEC_LOGO_DARK_PATH, EDHEC_LOGO_WHITE_PATH } from '../edhecLogo';

export const BORDEAUX = '#6B1E2E';
export const CREAM = '#F5F0EC';
export const WHITE = '#FFFFFF';
export const CORAL = '#D4614A';
export const DARK = '#1A1F3C';
export const MUTED = '#555555';

export type StyleId = 'Bordeaux classique' | 'Creme elegant' | 'Barometre data';

export interface StyleTheme {
  id: StyleId;
  coverBg: string;
  coverText: string;
  coverAccent: string;
  bodyBg: string;
  bodyText: string;
  bodyAccent: string;
  closingBg: string;
  closingText: string;
  closingAccent: string;
}

export const THEMES: Record<StyleId, StyleTheme> = {
  'Bordeaux classique': {
    id: 'Bordeaux classique',
    coverBg: BORDEAUX, coverText: WHITE,   coverAccent: CREAM,
    bodyBg: CREAM,     bodyText: DARK,     bodyAccent: CORAL,
    closingBg: BORDEAUX, closingText: WHITE, closingAccent: CREAM,
  },
  'Creme elegant': {
    id: 'Creme elegant',
    coverBg: CREAM,    coverText: BORDEAUX, coverAccent: CORAL,
    bodyBg: WHITE,     bodyText: DARK,      bodyAccent: BORDEAUX,
    closingBg: BORDEAUX, closingText: WHITE, closingAccent: CREAM,
  },
  'Barometre data': {
    id: 'Barometre data',
    coverBg: '#F0F4F9', coverText: BORDEAUX, coverAccent: CORAL,
    bodyBg: WHITE,      bodyText: DARK,      bodyAccent: '#2A7D6B',
    closingBg: BORDEAUX, closingText: WHITE, closingAccent: CREAM,
  },
};

export function escapeXml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Parse the user's raw "Points cles" textarea into an ordered list of points.
export function parsePoints(raw: string): string[] {
  return (raw || '')
    .split(/\n+/)
    .map(line => line.replace(/^[-*\u2022\u25CF\s]+/, '').trim())
    .filter(Boolean);
}

// Wrap text into lines of up to maxChars, breaking on word boundaries.
function wrapLines(text: string, maxChars: number, maxLines: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const candidate = (current + ' ' + w).trim();
    if (candidate.length > maxChars) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines.slice(0, maxLines);
}

// Extract a leading percentage/number from a point, return { stat, remainder }
export function splitStat(raw: string): { stat: string | null; remainder: string } {
  const match = (raw || '').match(/^[-+]?\d+(?:[.,]\d+)?\s*%?/);
  if (!match) return { stat: null, remainder: raw };
  const stat = match[0].trim();
  const remainder = raw.slice(match[0].length).replace(/^[:,\s-]+/, '').trim();
  return { stat, remainder };
}

// Total slide count from format label. Centralised so preview and PPTX agree.
export function slideCountForFormat(format: string): number {
  if (format.includes('3')) return 3;
  if (format.includes('5')) return 5;
  if (format.includes('7')) return 7;
  if (format.toLowerCase().includes('unique') || format.toLowerCase().includes('single')) return 1;
  return 5;
}

export type SlideKind = 'cover' | 'content' | 'closing';

export interface SlideSpec {
  kind: SlideKind;
  index: number;         // 1-based
  total: number;
  programme: string;
  title: string;
  heading?: string;
  body?: string;
  stat?: string | null;
  theme: StyleTheme;
}

// Assemble an ordered list of slide specs from user input.
export function buildSlideSpecs(opts: {
  format: string;
  style: StyleId;
  programme: string;
  title: string;
  points: string[];
}): SlideSpec[] {
  const total = slideCountForFormat(opts.format);
  const theme = THEMES[opts.style];
  const programme = (opts.programme || 'Chaire Management in Innovative Health').trim();
  const title = (opts.title || '').trim();

  if (total === 1) {
    return [{
      kind: 'cover', index: 1, total: 1,
      programme, title, theme,
      body: opts.points.slice(0, 3).join('\n'),
    }];
  }

  const contentCount = Math.max(1, total - 2);
  const usedPoints = opts.points.slice(0, contentCount);
  while (usedPoints.length < contentCount) usedPoints.push('');

  const specs: SlideSpec[] = [];
  specs.push({ kind: 'cover', index: 1, total, programme, title, theme });
  usedPoints.forEach((raw, i) => {
    const [headLine, ...bodyLines] = raw.split(/:\s*/);
    const heading = headLine || raw || `Point ${i + 1}`;
    const body = bodyLines.join(': ');
    const { stat, remainder } = splitStat(raw);
    specs.push({
      kind: 'content', index: i + 2, total,
      programme, title, theme,
      heading: stat ? '' : heading,
      body: stat ? remainder : body,
      stat: stat,
    });
  });
  specs.push({ kind: 'closing', index: total, total, programme, title, theme });
  return specs;
}

// ---------- SVG builders (1080x1080) ----------

const LOGO_WHITE = `<g transform="translate(820,960) scale(0.35)"><image href="${EDHEC_LOGO_WHITE_PATH}" width="520" height="197" preserveAspectRatio="xMidYMid meet"/></g>`;
const LOGO_DARK  = `<g transform="translate(820,960) scale(0.35)"><image href="${EDHEC_LOGO_DARK_PATH}" width="520" height="197" preserveAspectRatio="xMidYMid meet"/></g>`;

function footer(slide: SlideSpec, onDark: boolean): string {
  const opacity = onDark ? 0.75 : 0.55;
  const color = onDark ? CREAM : MUTED;
  const counter = slide.total > 1 ? `${slide.index} / ${slide.total}` : '';
  return `
  <text x="80" y="1020" font-family="Montserrat, DM Sans, sans-serif" font-size="14" fill="${color}" opacity="${opacity}">${escapeXml(slide.programme)}</text>
  ${counter ? `<text x="720" y="1020" text-anchor="end" font-family="Montserrat, DM Sans, sans-serif" font-size="14" fill="${color}" opacity="${opacity}">${counter}</text>` : ''}
  ${onDark ? LOGO_WHITE : LOGO_DARK}`;
}

export function renderCoverSvg(s: SlideSpec): string {
  const onDark = isDarkBg(s.theme.coverBg);
  const titleLines = wrapLines(s.title || 'Votre titre ici', 18, 4);
  const startY = 480 - (titleLines.length - 1) * 48;
  return `<svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="${s.theme.coverBg}"/>
  <text x="540" y="200" text-anchor="middle" font-family="Montserrat, DM Sans, sans-serif" font-size="18" fill="${s.theme.coverAccent}" letter-spacing="4">${escapeXml(s.programme.toUpperCase())}</text>
  <line x1="440" y1="230" x2="640" y2="230" stroke="${s.theme.coverAccent}" stroke-width="2"/>
  ${titleLines.map((ln, i) => `<text x="540" y="${startY + i * 96}" text-anchor="middle" font-family="Montserrat, Playfair Display, serif" font-size="80" font-weight="700" fill="${s.theme.coverText}">${escapeXml(ln)}</text>`).join('\n  ')}
  ${s.body ? `<text x="540" y="${startY + titleLines.length * 96 + 60}" text-anchor="middle" font-family="Montserrat, DM Sans, sans-serif" font-size="22" fill="${s.theme.coverText}" opacity="0.85">${escapeXml(s.body.split('\n').slice(0, 1).join(' '))}</text>` : ''}
  ${footer(s, onDark)}
</svg>`;
}

export function renderContentSvg(s: SlideSpec): string {
  const onDark = isDarkBg(s.theme.bodyBg);
  const badge = String(s.index - 1).padStart(2, '0');
  const headingLines = wrapLines(s.heading || '', 22, 3);
  const bodyLines = wrapLines(s.body || '', 42, 5);

  if (s.stat) {
    return `<svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="${s.theme.bodyBg}"/>
  <text x="80" y="170" font-family="Montserrat, DM Sans, sans-serif" font-size="16" fill="${BORDEAUX}" font-weight="700" letter-spacing="4">${badge}   ${escapeXml((s.title || '').toUpperCase())}</text>
  <line x1="80" y1="200" x2="220" y2="200" stroke="${s.theme.bodyAccent}" stroke-width="3"/>
  <text x="540" y="560" text-anchor="middle" font-family="Montserrat, Playfair Display, serif" font-size="200" font-weight="700" fill="${s.theme.bodyAccent}">${escapeXml(s.stat)}</text>
  ${bodyLines.map((ln, i) => `<text x="540" y="${700 + i * 44}" text-anchor="middle" font-family="Montserrat, DM Sans, sans-serif" font-size="28" fill="${s.theme.bodyText}">${escapeXml(ln)}</text>`).join('\n  ')}
  ${footer(s, onDark)}
</svg>`;
  }

  return `<svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="${s.theme.bodyBg}"/>
  <text x="80" y="170" font-family="Montserrat, DM Sans, sans-serif" font-size="16" fill="${BORDEAUX}" font-weight="700" letter-spacing="4">${badge}   ${escapeXml((s.title || '').toUpperCase())}</text>
  <line x1="80" y1="200" x2="220" y2="200" stroke="${s.theme.bodyAccent}" stroke-width="3"/>
  ${headingLines.map((ln, i) => `<text x="80" y="${340 + i * 84}" font-family="Montserrat, Playfair Display, serif" font-size="68" font-weight="700" fill="${BORDEAUX}">${escapeXml(ln)}</text>`).join('\n  ')}
  ${bodyLines.map((ln, i) => `<text x="80" y="${340 + headingLines.length * 84 + 60 + i * 40}" font-family="Montserrat, DM Sans, sans-serif" font-size="28" fill="${s.theme.bodyText}">${escapeXml(ln)}</text>`).join('\n  ')}
  ${footer(s, onDark)}
</svg>`;
}

export function renderClosingSvg(s: SlideSpec): string {
  const onDark = isDarkBg(s.theme.closingBg);
  return `<svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="${s.theme.closingBg}"/>
  <text x="540" y="420" text-anchor="middle" font-family="Montserrat, DM Sans, sans-serif" font-size="18" fill="${s.theme.closingAccent}" letter-spacing="4">EN SAVOIR PLUS</text>
  <line x1="440" y1="450" x2="640" y2="450" stroke="${s.theme.closingAccent}" stroke-width="2"/>
  <text x="540" y="560" text-anchor="middle" font-family="Montserrat, Playfair Display, serif" font-size="56" font-weight="700" fill="${s.theme.closingText}">Chaire Management</text>
  <text x="540" y="625" text-anchor="middle" font-family="Montserrat, Playfair Display, serif" font-size="56" font-weight="700" fill="${s.theme.closingText}">in Innovative Health</text>
  <text x="540" y="700" text-anchor="middle" font-family="Montserrat, DM Sans, sans-serif" font-size="22" fill="${s.theme.closingText}" opacity="0.85">EDHEC Business School</text>
  ${footer(s, onDark)}
</svg>`;
}

export function renderSvg(s: SlideSpec): string {
  if (s.kind === 'cover') return renderCoverSvg(s);
  if (s.kind === 'closing') return renderClosingSvg(s);
  return renderContentSvg(s);
}

function isDarkBg(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Relative luminance (quick approx). Dark = <128
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return l < 128;
}

// Strip hex colour to the 6-char form pptxgenjs wants.
export function toPptxColor(hex: string): string {
  return hex.replace('#', '').toUpperCase();
}
