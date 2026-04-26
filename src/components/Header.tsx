import React from 'react';
import { HeaderSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';
import { Button } from './Button';
import { surfaceStyleFromProps, fontSizeFromProp } from '../engine/cmsSurfaceStyle';
import { mergeHeaderZones } from './headerCanvasUtils';
import { cmsLiveEditAttrs } from '../engine/cmsLiveEditAttrs';

const ROW_JUSTIFY: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const ROW_ITEMS: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

function cj(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

export const Header: React.FC<any> = (rawProps) => {
  const parseResult = HeaderSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Header Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const p = parseResult.data;
  const raw = p as Record<string, unknown>;
  const le = !!(raw as { __liveEdit?: boolean }).__liveEdit;
  const surface = surfaceStyleFromProps(raw);
  const useThemeBg = typeof raw.bgColor !== 'string' || !String(raw.bgColor).trim();
  const bgClass = useThemeBg ? bgMap[p.theme] : '';
  const headerPositionClass = p.sticky ? 'sticky top-0 z-50' : 'relative';
  const headerStyle: React.CSSProperties = {
    ...surface,
    ...((p.style || {}) as React.CSSProperties),
    ...(p.sticky ? { top: p.topOffset || '0px' } : {}),
  };
  if (raw.borderBottom === true && typeof raw.borderColor === 'string' && raw.borderColor) {
    headerStyle.borderBottomWidth = 1;
    headerStyle.borderBottomStyle = 'solid';
    headerStyle.borderBottomColor = raw.borderColor;
  }
  const borderClass =
    raw.borderBottom === true && typeof raw.borderColor === 'string'
      ? 'border-b-0'
      : p.borderClassName || 'border-black/10 dark:border-white/10';
  const shadowClass = p.shadowClassName || '';
  const accent = typeof raw.accentColor === 'string' ? raw.accentColor : undefined;
  const titleColor = typeof raw.textColor === 'string' && raw.textColor ? { color: raw.textColor } : undefined;
  const fs = fontSizeFromProp(raw.fontSize);
  const navFs = fontSizeFromProp(raw.navFontSize) ?? 14;

  const rj = ROW_JUSTIFY[p.rowJustify] || 'justify-between';
  const ri = ROW_ITEMS[p.rowItems] || 'items-center';
  const isStack = p.headerLayout === 'stack';
  const ctaInNav = p.ctaWithNav !== false;
  const gapN = typeof raw.contentGap === 'number' && raw.contentGap > 0 ? raw.contentGap : 0;
  const gapStyle: React.CSSProperties | undefined = gapN > 0 ? { gap: gapN } : undefined;
  const stackN = ROW_JUSTIFY[p.stackNavJustify] || 'justify-center';
  const stackB =
    p.stackBrandAlign === 'end' ? 'md:justify-end' : p.stackBrandAlign === 'start' ? 'md:justify-start' : 'md:justify-center';

  const linkNodes = (p.links || []).map((link, i) => (
    <a
      key={i}
      href={link.href}
      target={link.isExternal ? '_blank' : undefined}
      rel={link.isExternal ? 'noopener noreferrer' : undefined}
      className={cj(
        'rounded-full px-3 py-2 font-medium transition-all opacity-85 hover:opacity-100',
        'hover:bg-black/10 dark:hover:bg-white/10',
        p.linkClassName,
      )}
      style={{ fontSize: navFs }}
    >
      {link.label}
    </a>
  ));

  const brandBlock = (
    <div className={cj('flex items-center gap-3', p.brandClassName)}>
      <span
        className={cj('inline-block h-2.5 w-2.5 rounded-full', !accent && 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]')}
        style={accent ? { backgroundColor: accent, boxShadow: `0 0 18px ${accent}88` } : undefined}
      />
      <a
        href="/"
        className="font-semibold text-xl tracking-tight"
        style={{ ...titleColor, fontSize: fs }}
        {...cmsLiveEditAttrs(le, 'title')}
      >
        {p.title}
      </a>
    </div>
  );

  const cta = p.button ? <Button {...p.button} /> : null;
  const mobileMenu = (
    <div className="md:hidden flex items-center">
      <button
        className={cj(
          'rounded-full border border-black/15 dark:border-white/20 px-3 py-1.5 text-sm',
          'opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
          p.mobileMenuButtonClassName,
        )}
      >
        Menu
      </button>
    </div>
  );

  if (p.headerCanvas) {
    const zones = mergeHeaderZones(
      p.headerZones as
        | Partial<Record<'brand' | 'nav' | 'cta' | 'mobileMenu', { l: number; t: number }>>
        | undefined,
    );
    const barH = p.headerCanvasHeight ?? 88;
    return (
      <header
        className={cj(
          headerPositionClass,
          'w-full border-b backdrop-blur-xl supports-[backdrop-filter]:bg-opacity-70',
          borderClass,
          shadowClass,
          bgClass,
          p.className,
        )}
        style={headerStyle}
      >
        <div className={cj('container mx-auto', p.containerClassName)}>
          <div
            className={cj('relative w-full overflow-x-hidden', p.innerClassName)}
            style={{ minHeight: barH }}
          >
            <div className="relative min-h-full w-full px-4 md:px-6">
              <div
                className="absolute"
                style={{ left: `${zones.brand.l}%`, top: `${zones.brand.t}%`, zIndex: 2 }}
              >
                {brandBlock}
              </div>
              <nav
                className={cj(
                  'absolute hidden md:flex max-w-[min(70vw,60%)] flex-wrap items-center',
                  gapN === 0 && 'gap-2',
                  p.navClassName,
                )}
                style={{
                  left: `${zones.nav.l}%`,
                  top: `${zones.nav.t}%`,
                  zIndex: 6,
                  ...(gapN > 0 ? { gap: gapN } : {}),
                }}
              >
                {linkNodes}
                {ctaInNav && cta}
              </nav>
              {!ctaInNav && cta && (
                <div
                  className="absolute hidden md:block"
                  style={{ left: `${zones.cta.l}%`, top: `${zones.cta.t}%`, zIndex: 8 }}
                >
                  {cta}
                </div>
              )}
              <div
                className="absolute md:hidden"
                style={{ left: `${zones.mobileMenu.l}%`, top: `${zones.mobileMenu.t}%`, zIndex: 10 }}
              >
                {mobileMenu}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isStack) {
    return (
      <header
        className={cj(
          headerPositionClass,
          'w-full border-b backdrop-blur-xl supports-[backdrop-filter]:bg-opacity-70',
          borderClass,
          shadowClass,
          bgClass,
          p.className,
        )}
        style={headerStyle}
      >
        <div className={cj('container mx-auto', p.containerClassName)}>
          <div className={cj('flex flex-col py-2', p.innerClassName)} style={gapStyle}>
            <div className={cj('flex w-full min-h-[2.5rem] items-center justify-between', stackB)}>{brandBlock}{mobileMenu}</div>
            <div className={cj('hidden md:flex w-full min-h-10 flex-wrap items-center', stackN)} style={gapStyle}>
              <nav
                className={cj(
                  'flex flex-wrap items-center',
                  ctaInNav ? 'gap-2' : 'min-w-0 flex-1 justify-center gap-2',
                  p.navClassName,
                )}
              >
                {linkNodes}
                {ctaInNav && cta}
              </nav>
              {!ctaInNav && cta}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Single-row header bar
  return (
    <header
      className={cj(
        headerPositionClass,
        'w-full border-b backdrop-blur-xl supports-[backdrop-filter]:bg-opacity-70',
        borderClass,
        shadowClass,
        bgClass,
        p.className,
      )}
      style={headerStyle}
    >
      <div className={cj('container mx-auto', p.containerClassName)}>
        <div
          className={cj('flex w-full h-18 px-4 md:px-6 flex-wrap', rj, ri, p.rowReverse && 'flex-row-reverse', p.innerClassName)}
          style={gapStyle}
        >
          {brandBlock}
          <nav
            className={cj(
              'hidden md:flex items-center',
              ctaInNav
                ? cj('gap-2', p.navClassName)
                : cj('min-w-0 flex-1 flex-wrap justify-center', p.navClassName, 'gap-2'),
            )}
          >
            {linkNodes}
            {ctaInNav && cta}
          </nav>
          {!ctaInNav && cta && <div className="hidden md:flex items-center">{cta}</div>}
          {mobileMenu}
        </div>
      </div>
    </header>
  );
};

export default Header;
