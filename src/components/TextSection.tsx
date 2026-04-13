import React from 'react';
import { TextSectionSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';

export const TextSection: React.FC<any> = (rawProps) => {
  const parseResult = TextSectionSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Text Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const bgClass = bgMap[props.theme];
  const alignClass = alignMap[props.align];
  const pyClass = spacingMap[props.spacing];
  const body = props.content || props.body || props.text || '';
  const looksLikeHtml = typeof body === 'string' && /<\/?[a-z][\s\S]*>/i.test(body);

  return (
    <section className={`w-full ${pyClass} ${bgClass}`}>
      <div className="container px-4 mx-auto md:px-6">
        <div className={`max-w-4xl mx-auto space-y-6 ${alignClass}`}>
          {props.title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{props.title}</h2>
          )}
          {body ? (
            looksLikeHtml ? (
              <div
                className="prose prose-lg dark:prose-invert max-w-none opacity-90 text-left"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90 text-left">{body}</p>
            )
          ) : (
            <p className="text-gray-500 text-sm italic">No text content.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextSection;
