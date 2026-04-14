// Sanitise untrusted SVG before injecting via dangerouslySetInnerHTML.
// Used everywhere the app renders SVG from generated/user content.
//
// DOMPurify with { USE_PROFILES: { svg: true, svgFilters: true } } strips
// script tags, event handlers (onclick, onerror, etc.), javascript: URLs
// and any HTML elements that do not belong in SVG.

import DOMPurify from 'dompurify';

export function sanitizeSvg(svg: string): string {
  if (!svg) return '';
  try {
    return DOMPurify.sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: true },
      // Keep viewBox and namespaced attributes intact.
      ADD_ATTR: ['viewBox', 'preserveAspectRatio', 'xmlns', 'xmlns:xlink', 'href', 'xlink:href'],
    });
  } catch {
    // If DOMPurify fails (e.g. SSR or missing DOM), return an empty string
    // rather than risking an unsanitised payload reaching the DOM.
    return '';
  }
}
