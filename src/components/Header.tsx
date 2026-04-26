import React from 'react';
import { HeaderSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';
import { Button } from './Button';
import { surfaceStyleFromProps, fontSizeFromProp } from '../engine/cmsSurfaceStyle';

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

  const props = parseResult.data;
  const raw = props as Record<string, unknown>;
  const surface = surfaceStyleFromProps(raw);
  const useThemeBg = typeof raw.bgColor !== 'string' || !String(raw.bgColor).trim();
  const bgClass = useThemeBg ? bgMap[props.theme] : '';
  const headerPositionClass = props.sticky ? 'sticky top-0 z-50' : 'relative';
  const headerStyle: React.CSSProperties = {
    ...surface,
    ...((props.style || {}) as React.CSSProperties),
    ...(props.sticky ? { top: props.topOffset || '0px' } : {}),
  };
  if (raw.borderBottom === true && typeof raw.borderColor === 'string' && raw.borderColor) {
    headerStyle.borderBottomWidth = 1;
    headerStyle.borderBottomStyle = 'solid';
    headerStyle.borderBottomColor = raw.borderColor;
  }
  const borderClass =
    raw.borderBottom === true && typeof raw.borderColor === 'string'
      ? 'border-b-0'
      : props.borderClassName || 'border-black/10 dark:border-white/10';
  const shadowClass = props.shadowClassName || '';
  const accent = typeof raw.accentColor === 'string' ? raw.accentColor : undefined;
  const titleColor =
    typeof raw.textColor === 'string' && raw.textColor ? { color: raw.textColor } : undefined;
  const fs = fontSizeFromProp(raw.fontSize);

  return (
    <header
      className={`${headerPositionClass} w-full border-b backdrop-blur-xl supports-[backdrop-filter]:bg-opacity-70 ${borderClass} ${shadowClass} ${bgClass} ${props.className || ''}`.trim()}
      style={headerStyle}
    >
      <div className={`container mx-auto ${props.containerClassName || ''}`.trim()}>
        <div className={`flex h-18 items-center px-4 md:px-6 justify-between ${props.innerClassName || ''}`.trim()}>
        <div className={`flex items-center gap-3 ${props.brandClassName || ''}`.trim()}>
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${accent ? '' : 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]'}`}
            style={
              accent
                ? { backgroundColor: accent, boxShadow: `0 0 18px ${accent}88` }
                : undefined
            }
          />
          <a href="/" className="font-semibold text-xl tracking-tight" style={{ ...titleColor, fontSize: fs }}>
            {props.title}
          </a>
        </div>
        <nav className={`hidden md:flex items-center gap-2 ${props.navClassName || ''}`.trim()}>
          {props.links?.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-all opacity-85 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 ${props.linkClassName || ''}`.trim()}
            >
              {link.label}
            </a>
          ))}
          {props.button && (
            <Button {...props.button} />
          )}
        </nav>
        <div className="md:hidden flex items-center">
          <button className={`rounded-full border border-black/15 dark:border-white/20 px-3 py-1.5 text-sm opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${props.mobileMenuButtonClassName || ''}`.trim()}>
            Menu
          </button>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
