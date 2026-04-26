import React from 'react';
import { NewsSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';
import { resolveDisplayImageUrl } from '../engine/resolveDisplayImageUrl';

export const NewsSection: React.FC<any> = (rawProps) => {
  const parseResult = NewsSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>News Component Configuration Error</h3>
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
        <div className={`max-w-5xl mx-auto space-y-10 ${alignClass}`}>
          {props.title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{props.title}</h2>
          )}
          {props.subtitle && <p className="text-lg opacity-80 max-w-3xl">{props.subtitle}</p>}
          <ul className="space-y-8 text-left">
            {(props.items || []).map((item: any, i: number) => {
              const when = item.date || item.publishedAt || '';
              const blurb = item.excerpt || item.summary || '';
              const img = item.image?.url || item.imageUrl;
              const title = item.title || `News ${i + 1}`;
              const article = (
                <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40">
                  {img && (
                    <img
                      src={resolveDisplayImageUrl(img)}
                      alt={item.image?.alt || title}
                      className="w-full sm:w-40 h-40 object-cover rounded-lg shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    {when && (
                      <time className="text-sm text-gray-500 dark:text-gray-400">{when}</time>
                    )}
                    <h3 className="text-xl font-semibold mt-1">{title}</h3>
                    {blurb && <p className="mt-2 text-sm opacity-80 line-clamp-3">{blurb}</p>}
                    {item.href && (
                      <span className="inline-block mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                        Read more →
                      </span>
                    )}
                  </div>
                </article>
              );
              return (
                <li key={i}>
                  {item.href ? (
                    <a href={item.href} className="block hover:opacity-95 transition-opacity">
                      {article}
                    </a>
                  ) : (
                    article
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
