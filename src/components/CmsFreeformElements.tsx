import React from 'react';
import { resolveDisplayImageUrl } from '../engine/resolveDisplayImageUrl';

export type CmsFreeformElementsProps = {
  items: unknown[];
  /** When true, container uses text-center (e.g. hero center layout). */
  alignCenter?: boolean;
  /** Used for menu link color fallback when element has no `color`. */
  defaultTextColor?: string;
  extraClassName?: string;
};

function wrapOptionalHref(
  o: Record<string, unknown>,
  child: React.ReactNode,
): React.ReactNode {
  const href = typeof o.href === 'string' && o.href.trim() ? o.href.trim() : '';
  if (!href) return child;
  const ext = !!o.isExternal;
  return (
    <a
      href={href}
      target={ext ? '_blank' : undefined}
      rel={ext ? 'noopener noreferrer' : undefined}
      className="no-underline text-inherit"
    >
      {child}
    </a>
  );
}

function navLinksFromUnknown(links: unknown): { label: string; href: string; isExternal?: boolean }[] {
  if (!Array.isArray(links)) return [];
  return links
    .map((x) => {
      if (!x || typeof x !== 'object') return null;
      const r = x as Record<string, unknown>;
      return {
        label: String(r.label ?? '').trim(),
        href: String(r.href ?? '#').trim() || '#',
        isExternal: !!r.isExternal,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

function elementKey(o: Record<string, unknown>, i: number): string {
  return o.id && typeof o.id === 'string' ? o.id : `free-el-${i}`;
}

/**
 * Renders `_elements` saved by Superadmin / client admin (text, button, image, …).
 */
export function CmsFreeformElements({
  items,
  alignCenter = false,
  defaultTextColor,
  extraClassName = '',
}: CmsFreeformElementsProps) {
  if (!items.length) return null;

  return (
    <div
      className={
        'mt-6 w-full max-w-3xl space-y-3 ' +
        (alignCenter ? 'text-center' : 'text-left') +
        (extraClassName ? ` ${extraClassName}` : '')
      }
    >
      {items.map((el, i) => {
        if (!el || typeof el !== 'object') return null;
        const o = el as Record<string, unknown>;
        const t = o.type;
        const key = elementKey(o, i);

        if (t === 'text') {
          const body =
            typeof o.value === 'string' || typeof o.value === 'number'
              ? String(o.value)
              : typeof o.label === 'string'
                ? o.label
                : '';
          if (!body) return null;
          const c = o.color;
          const sz = typeof o.size === 'number' ? o.size : 16;
          const inner = (
            <p
              className="leading-relaxed"
              style={{
                color: typeof c === 'string' ? c : defaultTextColor,
                fontSize: sz,
                textAlign:
                  o.align === 'right' ? 'right' : o.align === 'center' ? 'center' : 'left',
              }}
            >
              {body}
            </p>
          );
          return <React.Fragment key={key}>{wrapOptionalHref(o, inner)}</React.Fragment>;
        }

        if (t === 'button') {
          const label =
            typeof o.value === 'string' || typeof o.value === 'number'
              ? String(o.value)
              : typeof o.label === 'string'
                ? o.label
                : '';
          if (!label) return null;
          const r = typeof o.radius === 'number' ? o.radius : 8;
          const style: React.CSSProperties = {
            color: (typeof o.color === 'string' && o.color) || '#fff',
            background: (typeof o.bg === 'string' && o.bg) || '#6366f1',
            borderRadius: r,
            fontSize: (typeof o.size === 'number' && o.size) || 14,
            textDecoration: 'none',
          };
          const href = typeof o.href === 'string' && o.href.trim();
          const ext = !!o.isExternal;
          const face = href ? (
            <a
              className="inline-block px-4 py-2 font-medium"
              style={style}
              href={href}
              target={ext ? '_blank' : undefined}
              rel={ext ? 'noopener noreferrer' : undefined}
            >
              {label}
            </a>
          ) : (
            <span className="inline-block px-4 py-2 font-medium cursor-default" style={style}>
              {label}
            </span>
          );
          return (
            <div key={key} className={alignCenter ? 'flex justify-center' : ''}>
              {face}
            </div>
          );
        }

        if (t === 'image') {
          const src = typeof o.src === 'string' && o.src.trim() ? resolveDisplayImageUrl(o.src) : '';
          const w = o.width;
          const widthCss =
            w === '100%' || w === '100'
              ? '100%'
              : typeof w === 'number'
                ? w
                : typeof w === 'string' && w.trim()
                  ? w.trim()
                  : 'auto';
          const maxH = typeof o.height === 'number' ? o.height : undefined;
          const isExternal = typeof src === 'string' && /^https?:\/\//i.test(src);
          if (!src) {
            return (
              <div
                key={key}
                className="w-full rounded-lg border border-dashed border-slate-300/80 bg-slate-100/50 py-10 text-sm text-slate-500"
              >
                {typeof o.label === 'string' && o.label ? o.label : 'Image'}
              </div>
            );
          }
          return (
            <div key={key} className="w-full min-w-0">
              {wrapOptionalHref(
                o,
                <img
                  src={src}
                  alt={typeof o.label === 'string' ? o.label : ''}
                  referrerPolicy={isExternal ? 'no-referrer' : undefined}
                  className="h-auto max-w-full rounded-lg object-contain"
                  style={{
                    maxHeight: maxH,
                    width: widthCss === 'auto' ? undefined : widthCss,
                    maxWidth: widthCss === '100%' ? '100%' : undefined,
                  }}
                />,
              )}
            </div>
          );
        }

        if (t === 'input') {
          const ph = typeof o.placeholder === 'string' ? o.placeholder : '';
          const r = typeof o.radius === 'number' ? o.radius : 8;
          return (
            <div key={key} className={alignCenter ? 'flex justify-center' : ''}>
              <input
                type="text"
                readOnly
                placeholder={ph}
                className="w-full max-w-md border border-slate-200 px-3 py-2 text-sm outline-none"
                style={{
                  background: (typeof o.bg === 'string' && o.bg) || '#f1f5f9',
                  borderRadius: r,
                  color: typeof o.color === 'string' ? o.color : defaultTextColor,
                  width:
                    o.width === '100%'
                      ? '100%'
                      : typeof o.width === 'number'
                        ? o.width
                        : '100%',
                  maxWidth: 28 * 16,
                }}
              />
            </div>
          );
        }

        if (t === 'divider') {
          const h = typeof o.height === 'number' ? o.height : 1;
          const bg = typeof o.color === 'string' && o.color ? o.color : 'currentColor';
          return (
            <div
              key={key}
              className="w-full my-2 opacity-40"
              style={{
                height: h,
                background: bg,
                maxWidth: o.width === '100%' ? '100%' : typeof o.width === 'number' ? o.width : '100%',
                marginLeft: alignCenter ? 'auto' : undefined,
                marginRight: alignCenter ? 'auto' : undefined,
              }}
            />
          );
        }

        if (t === 'badge') {
          const text =
            typeof o.value === 'string' || typeof o.value === 'number'
              ? String(o.value)
              : typeof o.label === 'string'
                ? o.label
                : '';
          if (!text) return null;
          const r = typeof o.radius === 'number' ? o.radius : 999;
          return (
            <div key={key} className={alignCenter ? 'flex justify-center' : ''}>
              {wrapOptionalHref(
                o,
                <span
                  className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
                  style={{
                    color: (typeof o.color === 'string' && o.color) || '#fff',
                    background: (typeof o.bg === 'string' && o.bg) || '#6366f1',
                    borderRadius: r,
                    fontSize: (typeof o.size === 'number' && o.size) || 11,
                  }}
                >
                  {text}
                </span>,
              )}
            </div>
          );
        }

        if (t === 'section') {
          const h = typeof o.height === 'number' ? o.height : 120;
          const bg = typeof o.bg === 'string' && o.bg ? o.bg : '#f8fafc';
          return (
            <div
              key={key}
              className="w-full rounded-lg border border-slate-200/80"
              style={{
                minHeight: h,
                background: bg,
                width: o.width === '100%' ? '100%' : undefined,
              }}
            />
          );
        }

        if (t === 'card') {
          const h = typeof o.height === 'number' ? o.height : 160;
          const r = typeof o.radius === 'number' ? o.radius : 12;
          const bg = typeof o.bg === 'string' && o.bg ? o.bg : '#ffffff';
          const title =
            typeof o.value === 'string' || typeof o.value === 'number'
              ? String(o.value)
              : typeof o.label === 'string'
                ? o.label
                : '';
          const inner = (
            <div
              className="flex w-full flex-col justify-center border border-slate-200/90 p-4 shadow-sm"
              style={{ minHeight: h, borderRadius: r, background: bg }}
            >
              {title ? <p className="font-medium text-slate-800">{title}</p> : null}
            </div>
          );
          return <div key={key} className="w-full">{wrapOptionalHref(o, inner)}</div>;
        }

        if (t === 'menu') {
          const links = navLinksFromUnknown(o.links);
          const fz = typeof o.size === 'number' ? o.size : 14;
          const color = (typeof o.color === 'string' && o.color) || defaultTextColor || '#1e293b';
          const justify =
            o.align === 'right' ? 'justify-end' : o.align === 'center' ? 'justify-center' : 'justify-start';
          if (!links.length) {
            return (
              <p key={key} className="text-sm italic opacity-50" style={{ color }}>
                Menu
              </p>
            );
          }
          return (
            <nav
              key={key}
              className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${justify}`}
              style={{ fontSize: fz, color }}
            >
              {links.map((L, j) => (
                <a
                  key={`${key}-${j}`}
                  href={L.href || '#'}
                  className="hover:opacity-80 underline-offset-4 hover:underline"
                  target={L.isExternal ? '_blank' : undefined}
                  rel={L.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {L.label || L.href}
                </a>
              ))}
            </nav>
          );
        }

        return null;
      })}
    </div>
  );
}

/** Safe read of `_elements` from parsed props + passthrough. */
export function readFreeformElements(raw: Record<string, unknown>): unknown[] {
  return Array.isArray(raw._elements) ? (raw._elements as unknown[]) : [];
}
