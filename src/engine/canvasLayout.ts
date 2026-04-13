/**
 * Optional freeform layout from superadmin canvas (`props._canvas`).
 * When present with finite x/y, RecursiveRenderer wraps the component in an absolutely positioned box.
 */

export const CANVAS_LAYOUT_KEY = '_canvas' as const;

export type CanvasLayout = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  z?: number;
};

const DEFAULT_BOX_H = 160;

export function parseCanvasLayout(props: Record<string, unknown> | null | undefined): CanvasLayout | null {
  if (!props || typeof props !== 'object') return null;
  const raw = props[CANVAS_LAYOUT_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const c = raw as Record<string, unknown>;
  const x = typeof c.x === 'number' && Number.isFinite(c.x) ? c.x : null;
  const y = typeof c.y === 'number' && Number.isFinite(c.y) ? c.y : null;
  if (x === null || y === null) return null;
  const out: CanvasLayout = { x, y };
  if (typeof c.w === 'number' && Number.isFinite(c.w) && c.w > 0) out.w = c.w;
  if (typeof c.h === 'number' && Number.isFinite(c.h) && c.h > 0) out.h = c.h;
  if (typeof c.z === 'number' && Number.isFinite(c.z)) out.z = Math.round(c.z);
  return out;
}

export function omitCanvasLayout<T extends Record<string, unknown>>(props: T): T {
  if (!props || typeof props !== 'object') return props;
  const { [CANVAS_LAYOUT_KEY]: _removed, ...rest } = props;
  return rest as T;
}

export function pageHasCanvasLayout(instances: Array<{ props?: Record<string, unknown> }> | undefined): boolean {
  if (!Array.isArray(instances)) return false;
  return instances.some((inst) => parseCanvasLayout(inst.props) !== null);
}

/**
 * Minimum main height so absolutely placed nodes near the bottom stay scrollable.
 */
export function computeCanvasStageMinHeight(
  instances: Array<{ props?: Record<string, unknown> }>,
  fallbackMin = 480,
): number {
  let maxBottom = 0;
  for (const inst of instances) {
    const c = parseCanvasLayout(inst.props);
    if (!c) continue;
    const bottom = c.y + (c.h ?? DEFAULT_BOX_H);
    maxBottom = Math.max(maxBottom, bottom);
  }
  return Math.max(fallbackMin, Math.ceil(maxBottom + 32));
}
