import React from 'react';
import { ContactSectionSchema } from '../schemas';
import { alignMap, bgMap } from '../engine/Tokens';
import { CmsFreeformElements, readFreeformElements } from './CmsFreeformElements';

export const ContactSection: React.FC<any> = (rawProps) => {
  const parseResult = ContactSectionSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Contact Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const raw = props as Record<string, unknown>;
  const bgClass = bgMap[props.theme];
  const alignClass = alignMap[props.align];
  const freeformElements = readFreeformElements(raw);

  const rows = [
    props.phone && { label: 'Phone', value: props.phone, href: `tel:${props.phone.replace(/\s/g, '')}` },
    props.email && { label: 'Email', value: props.email, href: `mailto:${props.email}` },
    props.address && { label: 'Address', value: props.address },
    props.hours && { label: 'Hours', value: props.hours },
  ].filter(Boolean) as Array<{ label: string; value: string; href?: string }>;

  return (
    <section className={`w-full py-16 lg:py-24 ${bgClass}`}>
      <div className="container px-4 mx-auto md:px-6">
        <div className={`max-w-3xl mx-auto space-y-8 ${alignClass}`}>
          {props.title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{props.title}</h2>
          )}
          {props.subtitle && <p className="text-lg opacity-80">{props.subtitle}</p>}

          <dl className="space-y-4 text-left">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-gray-600 dark:text-gray-300 sm:w-28 shrink-0">
                  {row.label}
                </dt>
                <dd className="opacity-90">
                  {row.href ? (
                    <a href={row.href} className="text-blue-600 hover:underline dark:text-blue-400">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {props.mapUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 aspect-video bg-gray-100">
              <iframe
                title="Map"
                src={props.mapUrl}
                className="w-full h-full min-h-[240px]"
                loading="lazy"
                allowFullScreen
              />
            </div>
          )}
          {freeformElements.length > 0 && (
            <CmsFreeformElements
              items={freeformElements}
              alignCenter={props.align === 'center'}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
