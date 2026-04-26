import React from 'react';
import { HeroSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';
import { Button } from './Button';
import { surfaceStyleFromProps, fontSizeFromProp } from '../engine/cmsSurfaceStyle';
import { cmsLiveEditAttrs } from '../engine/cmsLiveEditAttrs';
import { resolveDisplayImageUrl } from '../engine/resolveDisplayImageUrl';
import { CmsFreeformElements, readFreeformElements } from './CmsFreeformElements';

/** superadmin / client admin often save CTAs as primaryBtn*; Hero schema only listed `buttons`. */
function effectiveHeroButtons(
  raw: Record<string, unknown>,
  fromSchema: { text: string; href?: string; variant?: string }[] | undefined,
) {
  if (fromSchema && fromSchema.length > 0) return fromSchema;
  const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : '');
  const p: { text: string; href: string; variant: 'primary' | 'secondary' }[] = [];
  const t1 = s(raw.primaryBtnText);
  if (t1) p.push({ text: t1, href: s(raw.primaryBtnUrl) || '#', variant: 'primary' });
  const t2 = s(raw.secondaryBtnText);
  if (t2) p.push({ text: t2, href: s(raw.secondaryBtnUrl) || '#', variant: 'secondary' });
  return p;
}

export const Hero: React.FC<any> = (rawProps) => {
  const parseResult = HeroSchema.safeParse(rawProps);
  
  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Hero Component Configuration Error</h3>
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
  const alignClass = alignMap[props.align];
  const spacingClass = spacingMap[props.spacing];
  const titleSize = fontSizeFromProp(raw.titleSize);
  const subtitleSize = fontSizeFromProp(raw.subtitleSize);
  const textColor = typeof raw.textColor === 'string' ? raw.textColor : undefined;
  const hasImage = raw.hasImage === true;
  const firstImg = props.images && props.images[0];
  const legacyImageUrl = typeof raw.imageUrl === 'string' ? raw.imageUrl.trim() : '';
  const primaryImageSrc = resolveDisplayImageUrl(
    (firstImg?.url && String(firstImg.url).trim()) || legacyImageUrl,
  );

  const buttonRow = effectiveHeroButtons(raw, props.buttons);
  const freeformElements = readFreeformElements(raw);

  const titleStyle: React.CSSProperties = {
    ...(titleSize ? { fontSize: titleSize, lineHeight: 1.1 } : {}),
    ...(textColor ? { color: textColor } : {}),
  };
  const subtitleStyle: React.CSSProperties = {
    ...(subtitleSize ? { fontSize: subtitleSize } : {}),
    ...(textColor ? { color: textColor, opacity: 0.85 } : {}),
  };

  const textBlock = (
    <div className={`space-y-4 max-w-3xl ${props.align === 'center' && !hasImage ? 'mx-auto' : ''}`}>
      <h1
        className={titleSize ? 'font-extrabold tracking-tight' : 'text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl'}
        style={titleStyle}
        {...cmsLiveEditAttrs(le, 'title')}
      >
        {props.title}
      </h1>
      {props.subtitle && (
        <p
          className={subtitleSize ? '' : 'text-lg md:text-xl opacity-80'}
          style={subtitleStyle}
          {...cmsLiveEditAttrs(le, 'subtitle')}
        >
          {props.subtitle}
        </p>
      )}
      {freeformElements.length > 0 && (
        <CmsFreeformElements
          items={freeformElements}
          alignCenter={props.align === 'center' && !hasImage}
          defaultTextColor={textColor}
        />
      )}
      {buttonRow.length > 0 && (
        <div className={`flex flex-wrap gap-4 ${props.align === 'center' ? 'justify-center' : ''}`}>
          {buttonRow.map((btn, i) => (
            <Button key={i} {...(btn as React.ComponentProps<typeof Button>)} />
          ))}
        </div>
      )}
    </div>
  );

  const imageBlock =
    props.images && props.images.length > 0 ? (
      <div className={`mt-12 flex flex-wrap gap-6 ${props.align === 'center' ? 'justify-center' : ''}`}>
        {props.images.map((img, i) => (
          <div key={i} className="overflow-hidden rounded-2xl shadow-lg border border-opacity-20 border-white">
            <img src={resolveDisplayImageUrl(img.url)} alt={img.alt || 'Hero block'} className="w-80 h-56 object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
      </div>
    ) : null;

  return (
    <section
      className={`w-full border-b ${hasImage ? 'py-12 md:py-16' : `${spacingClass} ${useThemeBg ? bgClass : ''}`}`}
      style={surface}
    >
      <div className="container px-4 md:px-6 mx-auto">
        {hasImage ? (
          <div className="grid w-full max-w-6xl mx-auto grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div
              className={`order-2 md:order-1 min-h-[220px] w-full rounded-2xl md:min-h-[280px] ${primaryImageSrc ? '' : 'bg-slate-200/80'}`}
              style={
                primaryImageSrc
                  ? {
                      backgroundImage: `url(${JSON.stringify(primaryImageSrc)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
              aria-hidden={!primaryImageSrc}
            />
            <div className={`order-1 md:order-2 flex flex-col ${alignClass} space-y-6`}>{textBlock}</div>
          </div>
        ) : (
          <div className={`flex flex-col ${alignClass} space-y-8`}>
            {textBlock}
            {imageBlock}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
