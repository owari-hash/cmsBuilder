import React from 'react';
import { AboutSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';

export const About: React.FC<any> = (rawProps) => {
  // Validate props against schema
  const parseResult = AboutSchema.safeParse(rawProps);
  
  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>About Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;

  // Map tokens to Tailwind classes
  const bgClass = bgMap[props.theme];
  const alignClass = alignMap[props.align];

  return (
    <section className={`w-full py-16 lg:py-24 ${bgClass}`}>
      <div className="container px-4 mx-auto md:px-6">
        <div className={`flex flex-col space-y-6 max-w-4xl mx-auto ${alignClass}`}>
          {props.title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {props.title}
            </h2>
          )}
          <p className="text-lg leading-relaxed opacity-80">
            {props.description}
          </p>

          {props.images && props.images.length > 0 && (
            <div className="grid gap-4 mt-8 sm:grid-cols-2">
              {props.images.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                  <img
                    alt={img.alt || "About visual"}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    src={img.url}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
