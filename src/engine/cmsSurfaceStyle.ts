import type { CSSProperties } from 'react';

/** Flat color/spacing props saved by superadmin / canvas editors. */
export function surfaceStyleFromProps(raw: Record<string, unknown>): CSSProperties {
  const s: CSSProperties = {};
  if (typeof raw.bgColor === 'string' && raw.bgColor) s.backgroundColor = raw.bgColor;
  if (typeof raw.textColor === 'string' && raw.textColor) s.color = raw.textColor;

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

  return s;
}

export function fontSizeFromProp(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}
