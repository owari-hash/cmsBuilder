import React from 'react';
import { AboutSchema } from '../schemas';
import { alignMap, bgMap, spacingMap } from '../engine/Tokens';
import { surfaceStyleFromProps, fontSizeFromProp, typographyStyleFromProps } from '../engine/cmsSurfaceStyle';
import { cmsLiveEditAttrs } from '../engine/cmsLiveEditAttrs';
import { resolveDisplayImageUrl } from '../engine/resolveDisplayImageUrl';
import { CmsFreeformElements, readFreeformElements } from './CmsFreeformElements';

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
  const raw = props as Record<string, unknown>;
  const le = !!(raw as { __liveEdit?: boolean }).__liveEdit;
  const surface = surfaceStyleFromProps(raw);
  const useThemeBg = typeof raw.bgColor !== 'string' || !String(raw.bgColor).trim();
  const bgClass = useThemeBg ? bgMap[props.theme] : '';
  const alignClass = alignMap[props.align];
  const titleStyle = typographyStyleFromProps(raw, 'title');
  const descriptionStyle = typographyStyleFromProps(raw, 'body'); // About description uses 'body' or '' prefix in builder? Usually '' for generic blocks.
  const freeformElements = readFreeformElements(raw);
  const textColor = typeof raw.textColor === 'string' ? raw.textColor : undefined;

  const titleSizeVal = titleStyle.fontSize;

  return (
    <section className={`w-full py-16 lg:py-24 ${useThemeBg ? bgClass : ''}`} style={surface}>
      <div className="container px-4 mx-auto md:px-6">
        <div className={`flex flex-col space-y-6 max-w-4xl mx-auto ${alignClass}`}>
          {props.title && (
            <h2
              className={titleSizeVal ? 'font-bold tracking-tight' : 'text-3xl font-bold tracking-tight sm:text-4xl'}
              style={titleStyle}
              {...cmsLiveEditAttrs(le, 'title')}
            >
              {props.title}
            </h2>
          )}
          <p
            className="text-lg leading-relaxed opacity-80"
            style={descriptionStyle}
            {...cmsLiveEditAttrs(le, 'description')}
          >
            {props.description}
          </p>

          {props.images && props.images.length > 0 && (
            <div className="grid gap-4 mt-8 sm:grid-cols-2">
              {props.images.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                  <img
                    alt={img.alt || "About visual"}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    src={resolveDisplayImageUrl(img.url)}
                  />
                </div>
              ))}
            </div>
          )}
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

export default About;
