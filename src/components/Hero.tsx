import React from 'react';
import { HeroSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';
import { Button } from './Button';

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

  const bgClass = bgMap[props.theme];
  const alignClass = alignMap[props.align];
  const spacingClass = spacingMap[props.spacing];

  return (
    <section className={`w-full ${spacingClass} ${bgClass} border-b`}>
      <div className="container px-4 md:px-6 mx-auto">
        <div className={`flex flex-col ${alignClass} space-y-8`}>
          <div className={`space-y-4 max-w-3xl ${props.align === 'center' ? 'mx-auto' : ''}`}>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {props.title}
            </h1>
            {props.subtitle && (
              <p className="text-lg md:text-xl opacity-80">
                {props.subtitle}
              </p>
            )}
          </div>
          
          {props.buttons && props.buttons.length > 0 && (
            <div className={`flex flex-wrap gap-4 ${props.align === 'center' ? 'justify-center' : ''}`}>
              {props.buttons.map((btn, i) => (
                <Button key={i} {...btn} />
              ))}
            </div>
          )}

          {props.images && props.images.length > 0 && (
             <div className={`mt-12 flex flex-wrap gap-6 ${props.align === 'center' ? 'justify-center' : ''}`}>
               {props.images.map((img, i) => (
                 <div key={i} className="overflow-hidden rounded-2xl shadow-lg border border-opacity-20 border-white">
                   <img src={img.url} alt={img.alt || 'Hero block'} className="w-80 h-56 object-cover hover:scale-105 transition-transform duration-300" />
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
