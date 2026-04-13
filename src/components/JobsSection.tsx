import React from 'react';
import { JobsSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';

export const JobsSection: React.FC<any> = (rawProps) => {
  const parseResult = JobsSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Jobs Component Configuration Error</h3>
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
        <div className={`max-w-4xl mx-auto space-y-8 ${alignClass}`}>
          {props.title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{props.title}</h2>
          )}
          {props.subtitle && <p className="text-lg opacity-80">{props.subtitle}</p>}
          <ul className="space-y-4 text-left">
            {(props.items || []).map((item: any, i: number) => {
              const title = item.title || `Position ${i + 1}`;
              const meta = [item.department, item.location, item.employmentType || item.type]
                .filter(Boolean)
                .join(' · ');
              const posted = item.postedAt || item.date || '';
              const card = (
                <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {meta && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{meta}</p>}
                    {posted && (
                      <p className="text-xs text-gray-500 mt-2">Posted {posted}</p>
                    )}
                  </div>
                  {item.href && (
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 shrink-0">
                      Apply →
                    </span>
                  )}
                </div>
              );
              return (
                <li key={i}>
                  {item.href ? (
                    <a href={item.href} className="block hover:opacity-95 transition-opacity">
                      {card}
                    </a>
                  ) : (
                    card
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

export default JobsSection;
