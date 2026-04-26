import React from 'react';
import { ServicesSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';
import { surfaceStyleFromProps, fontSizeFromProp } from '../engine/cmsSurfaceStyle';

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
  const titleSize = fontSizeFromProp(raw.titleSize);

  return (
    <section className={`w-full ${pyClass} ${useThemeBg ? bgClass : ''}`} style={surface}>
      <div className="container px-4 mx-auto md:px-6">
        <div className={`max-w-6xl mx-auto space-y-10 ${alignClass}`}>
          {props.title && (
            <h2
              className={titleSize ? 'font-bold tracking-tight' : 'text-3xl font-bold tracking-tight sm:text-4xl'}
              style={{
                ...(titleSize ? { fontSize: titleSize } : {}),
                ...(typeof raw.textColor === 'string' ? { color: raw.textColor } : {}),
              }}
            >
              {props.title}
            </h2>
          )}
          {props.subtitle && <p className="text-lg opacity-80 max-w-3xl">{props.subtitle}</p>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(props.items || []).map((item: any, i: number) => {
              const title = item.title || item.name || `Item ${i + 1}`;
              const inner = (
                <>
                  {item.iconUrl || item.icon ? (
                    <img
                      src={item.iconUrl || item.icon}
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
                  className="block p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40 hover:shadow-md transition-shadow text-left"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
