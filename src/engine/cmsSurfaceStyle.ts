import type { CSSProperties } from 'react';

/** Flat color/spacing props saved by superadmin / canvas editors. */
export function surfaceStyleFromProps(raw: Record<string, unknown>): CSSProperties {
  const s: CSSProperties = {};
  if (typeof raw.bgColor === 'string' && raw.bgColor) s.backgroundColor = raw.bgColor;
  if (typeof raw.textColor === 'string' && raw.textColor) s.color = raw.textColor;

  // Font family from SuperAdmin block settings
  if (typeof raw.fontFamily === 'string' && raw.fontFamily.trim()) {
    s.fontFamily = raw.fontFamily;
  }

  // Accent color as CSS variable for child elements (buttons, links, etc.)
  if (typeof raw.accentColor === 'string' && raw.accentColor.trim()) {
    (s as any)['--accent-color'] = raw.accentColor;
  }

  const px = raw.paddingX;
  if (typeof px === 'number' && Number.isFinite(px)) {
    s.paddingLeft = px;
    s.paddingRight = px;
  } else if (typeof px === 'string' && px.trim()) {
    const n = Number(px);
    if (Number.isFinite(n)) {
      s.paddingLeft = n;
      s.paddingRight = n;
    }
  }

  const py = raw.paddingY;
  if (typeof py === 'number' && Number.isFinite(py)) {
    s.paddingTop = py;
    s.paddingBottom = py;
  } else if (typeof py === 'string' && py.trim()) {
    const n = Number(py);
    if (Number.isFinite(n)) {
      s.paddingTop = n;
      s.paddingBottom = n;
    }
  }

  // Borders
  if (typeof raw.radius === 'number') s.borderRadius = raw.radius;
  if (typeof raw.borderWidth === 'number') s.borderWidth = raw.borderWidth;
  if (typeof raw.borderColor === 'string') s.borderColor = raw.borderColor;
  if (s.borderWidth && !s.borderStyle) s.borderStyle = 'solid';

  // Shadow
  if (typeof raw.boxShadow === 'string' && raw.boxShadow) s.boxShadow = raw.boxShadow;

  // Overlays (for Hero or Banner components)
  if (typeof raw.overlayColor === 'string') {
    (s as any)['--overlay-color'] = raw.overlayColor;
  }
  if (typeof raw.overlayOpacity === 'number') {
    (s as any)['--overlay-opacity'] = raw.overlayOpacity;
  }

  return s;
}

export function typographyStyleFromProps(
  raw: Record<string, unknown>,
  prefix: 'title' | 'subtitle' | 'body' | '' = ''
): CSSProperties {
  const s: CSSProperties = {};
  const p = prefix; // e.g. "title"
  
  const size = raw[`${p}Size`] || (p === '' ? raw.fontSize : undefined);
  if (size !== undefined) {
    const fs = fontSizeFromProp(size);
    if (fs) s.fontSize = fs;
  }

  const weight = raw[`${p}Weight`] || (p === '' ? raw.fontWeight : undefined);
  if (typeof weight === 'number' || typeof weight === 'string') s.fontWeight = weight as any;

  const lh = raw[`${p}LineHeight`] || (p === '' ? raw.lineHeight : undefined);
  if (typeof lh === 'number' || typeof lh === 'string') s.lineHeight = lh as any;

  const ls = raw[`${p}LetterSpacing`] || (p === '' ? raw.letterSpacing : undefined);
  if (typeof ls === 'number' || typeof ls === 'string') s.letterSpacing = ls as any;

  const transform = raw[`${p}Transform`] || (p === '' ? raw.textTransform : undefined);
  if (typeof transform === 'string') s.textTransform = transform as any;

  const color = raw[`${p}Color`] || (p === '' ? raw.textColor : undefined);
  if (typeof color === 'string' && color) s.color = color;

  return s;
}

export function fontSizeFromProp(v: unknown): string | number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim()) {
    // If it already has units (px, rem, em), use it as is
    if (/[a-z%]+$/i.test(v)) return v;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}
