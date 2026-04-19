import React from 'react';
import { SectionSchema } from '../../schemas';
import { bgMap } from '../../engine/Tokens';

export const Section: React.FC<any> = (rawProps) => {
  const parseResult = SectionSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Section Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const bgClass = bgMap[props.theme] || '';
  
  const style: React.CSSProperties = {
    minHeight: props.minHeight,
    paddingTop: props.paddingY,
    paddingBottom: props.paddingY,
  };
  
  if (props.backgroundColor && !bgClass) {
      style.backgroundColor = props.backgroundColor;
  }

  const slots = rawProps.slots || {};

  return (
    <section className={`w-full relative ${bgClass}`.trim()} style={style}>
      {slots.default || rawProps.children}
    </section>
  );
};
