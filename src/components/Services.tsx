import React from 'react';
import { ServicesSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';
import { surfaceStyleFromProps, fontSizeFromProp, typographyStyleFromProps } from '../engine/cmsSurfaceStyle';
import { resolveDisplayImageUrl } from '../engine/resolveDisplayImageUrl';
import { CmsFreeformElements, readFreeformElements } from './CmsFreeformElements';

const SHADOW_MAP: Record<string, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

export const Services: React.FC<any> = (rawProps) => {
  const parseResult = ServicesSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Services Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const raw = props as Record<string, unknown>;
  const surface = surfaceStyleFromProps(raw);
  const useThemeBg = typeof raw.bgColor !== 'string' || !String(raw.bgColor).trim();
  const bgClass = useThemeBg ? bgMap[props.theme] : '';
  const alignClass = alignMap[props.align];
  const pyClass = spacingMap[props.spacing];
  const titleStyle = typographyStyleFromProps(raw, 'title');
  const subtitleStyle = typographyStyleFromProps(raw, 'subtitle');
  const freeformElements = readFreeformElements(raw);
  const textColor = typeof raw.textColor === 'string' ? raw.textColor : undefined;

  // SuperAdmin block-level visual props
  const cols = typeof raw.columns === 'number' && raw.columns >= 1 ? raw.columns : 3;
  const cardBg = typeof raw.cardBg === 'string' && raw.cardBg ? raw.cardBg : undefined;
  const cardRadius = typeof raw.cardRadius === 'number' ? raw.cardRadius : undefined;
  const cardShadow = typeof raw.cardShadow === 'string' ? raw.cardShadow : undefined;

  const gridColsClass =
    cols === 1 ? 'sm:grid-cols-1' :
    cols === 2 ? 'sm:grid-cols-2' :
    cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' :
    'sm:grid-cols-2 lg:grid-cols-3';

  const cardShadowClass = cardShadow ? SHADOW_MAP[cardShadow] || '' : '';

  const cardStyle: React.CSSProperties = {
    ...(cardBg ? { backgroundColor: cardBg } : {}),
    ...(cardRadius !== undefined ? { borderRadius: cardRadius } : {}),
  };

  const titleSizeVal = titleStyle.fontSize;

  return (
    <section className={`w-full ${pyClass} ${useThemeBg ? bgClass : ''}`} style={surface}>
      <div className="container px-4 mx-auto md:px-6">
        <div className={`max-w-6xl mx-auto space-y-10 ${alignClass}`}>
          {props.title && (
            <h2
              className={titleSizeVal ? 'font-bold tracking-tight' : 'text-3xl font-bold tracking-tight sm:text-4xl'}
              style={{
                ...titleStyle,
                ...(typeof raw.textColor === 'string' ? { color: raw.textColor } : {}),
              }}
            >
              {props.title}
            </h2>
          )}
          {props.subtitle && <p className="text-lg opacity-80 max-w-3xl" style={subtitleStyle}>{props.subtitle}</p>}
          <div className={`grid gap-6 ${gridColsClass}`}>
            {(props.items || []).map((item: any, i: number) => {
              const title = item.title || item.name || `Item ${i + 1}`;
              const inner = (
                <>
                  {item.iconUrl || item.icon ? (
                    <img
                      src={resolveDisplayImageUrl(item.iconUrl || item.icon)}
                      alt=""
                      className="w-12 h-12 object-contain mb-3"
                    />
                  ) : null}
                  <h3 className="text-xl font-semibold">{title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm opacity-80 leading-relaxed">{item.description}</p>
                  )}
                  {item.price && (
                    <p className="mt-2 font-medium text-blue-600 dark:text-blue-400">{item.price}</p>
                  )}
                </>
              );
              return item.href ? (
                <a
                  key={i}
                  href={item.href}
                  className={`block p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left ${cardShadowClass} ${!cardBg ? 'bg-white/50 dark:bg-gray-900/40' : ''} ${cardRadius === undefined ? 'rounded-xl' : ''}`}
                  style={cardStyle}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={i}
                  className={`p-6 border border-gray-200 dark:border-gray-700 ${cardShadowClass} ${!cardBg ? 'bg-white/50 dark:bg-gray-900/40' : ''} ${cardRadius === undefined ? 'rounded-xl' : ''}`}
                  style={cardStyle}
                >
                  {inner}
                </div>
              );
            })}
          </div>
          {freeformElements.length > 0 && (
            <CmsFreeformElements
              items={freeformElements}
              alignCenter={props.align === 'center'}
              defaultTextColor={textColor}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;

