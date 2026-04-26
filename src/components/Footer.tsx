import React from 'react';
import { FooterSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';
import { Button } from './Button';
import { surfaceStyleFromProps, fontSizeFromProp } from '../engine/cmsSurfaceStyle';
import { cmsLiveEditAttrs } from '../engine/cmsLiveEditAttrs';

export const Footer: React.FC<any> = (rawProps) => {
  const parseResult = FooterSchema.safeParse(rawProps);
  
  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Footer Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const raw = props as Record<string, unknown>;
  const le = !!(raw as { __liveEdit?: boolean }).__liveEdit;
  const surface = surfaceStyleFromProps(raw);
  const useThemeBg = typeof raw.bgColor !== 'string' || !String(raw.bgColor).trim();
  const bgClass = useThemeBg ? bgMap[props.theme] : '';
  const borderClass = props.borderClassName || 'border-t';
  const shadowClass = props.shadowClassName || '';
  const footerStyle: React.CSSProperties = {
    ...surface,
    ...((props.style || {}) as React.CSSProperties),
  };
  const textMuted =
    typeof raw.textColor === 'string' && raw.textColor
      ? { color: raw.textColor, opacity: 0.85 }
      : undefined;
  const titleColor =
    typeof raw.textColor === 'string' && raw.textColor ? { color: raw.textColor } : undefined;
  const fs = fontSizeFromProp(raw.fontSize);
  const footerLinkEntries = props.footerLinks
    ? Object.entries(props.footerLinks)
    : [];
  const hasFooterLinks = footerLinkEntries.length > 0;

  return (
    <footer className={`w-full py-10 ${bgClass} ${borderClass} ${shadowClass} ${props.className || ''}`.trim()} style={footerStyle}>
      <div className={`container px-4 md:px-6 mx-auto ${props.containerClassName || ''}`.trim()}>
         <div
            className={`grid grid-cols-1 gap-8 text-center md:text-left ${
              hasFooterLinks ? 'md:grid-cols-3' : 'md:grid-cols-1'
            } ${props.gridClassName || ''}`.trim()}
         >
           <div className={`flex flex-col space-y-3 ${props.brandClassName || ''}`.trim()}>
             <span className="font-bold text-xl" style={{ ...titleColor, fontSize: fs }} {...cmsLiveEditAttrs(le, 'title')}>
               {props.title}
             </span>
             <span className="text-sm opacity-70" style={textMuted} {...cmsLiveEditAttrs(le, 'copyright')}>
               {props.copyright}
             </span>
             {props.button ? (
               <div className="pt-2">
                 <Button {...props.button} />
               </div>
             ) : null}
           </div>
           {hasFooterLinks ? (
             <>
           <div></div>
           <div className={`flex flex-col space-y-3 md:items-end ${props.linksSectionClassName || ''}`.trim()}>
             <span className="font-semibold mb-2">Links</span>
             {footerLinkEntries.map(([key, label]) => (
               <a key={key} href={`/${key}`} className={`text-sm hover:underline opacity-80 hover:opacity-100 ${props.linkClassName || ''}`.trim()}>
                 {label}
               </a>
             ))}
           </div>
             </>
           ) : null}
         </div>
      </div>
    </footer>
  );
};

export default Footer;
