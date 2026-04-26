import React from 'react';
import { RentalSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';
import { resolveDisplayImageUrl } from '../engine/resolveDisplayImageUrl';

/** Same layout as Services; schema alias for legacy `rental` type. */
export const Rental: React.FC<any> = (rawProps) => {
  const parseResult = RentalSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Rental Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const bgClass = bgMap[props.theme];
  const alignClass = alignMap[props.align];
  const pyClass = spacingMap[props.spacing];

  return (
    <section className={`w-full ${pyClass} ${bgClass}`}>
      <div className="container px-4 mx-auto md:px-6">
        <div className={`max-w-6xl mx-auto space-y-10 ${alignClass}`}>
          {props.title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{props.title}</h2>
          )}
          {props.subtitle && <p className="text-lg opacity-80 max-w-3xl">{props.subtitle}</p>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(props.items || []).map((item: any, i: number) => {
              const title = item.title || item.name || `Listing ${i + 1}`;
              const inner = (
                <>
                  {(item.iconUrl || item.imageUrl || item.image?.url) && (
                    <img
                      src={resolveDisplayImageUrl(item.iconUrl || item.imageUrl || item.image?.url)}
                      alt={item.image?.alt || ''}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
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

export default Rental;
