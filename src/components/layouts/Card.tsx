/**
 * Card - Container component with header, content, and footer slots
 */

import React from 'react';
import { CardSchema } from '../../schemas';
import { bgMap } from '../../engine/Tokens';

interface CardProps {
  title?: string;
  subtitle?: string;
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'primary' | 'secondary';
  // Slots injected by RecursiveRenderer
  slots?: {
    header?: React.ReactNode;
    content?: React.ReactNode;
    footer?: React.ReactNode;
  };
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  border = true,
  shadow = 'md',
  padding = 'md',
  theme = 'light',
  slots = {}
}) => {
  // Validate props
  const parseResult = CardSchema.safeParse({
    title, subtitle, border, shadow, padding, theme
  });

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Card Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.issues, null, 2)}</pre>
      </div>
    );
  }

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const bgClass = bgMap[theme];

  return (
    <div className={`rounded-lg overflow-hidden ${shadowClasses[shadow]} ${border ? 'border border-gray-200' : ''} ${bgClass}`}>
      {/* Header Slot or Default Header */}
      {(slots.header || title) && (
        <div className={`${paddingClasses[padding]} border-b border-gray-200/50`}>
          {slots.header || (
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
          )}
        </div>
      )}
      
      {/* Content Slot */}
      <div className={paddingClasses[padding]}>
        {slots.content || (
          <div className="text-gray-400 italic text-center py-4">
            Content slot - empty
          </div>
        )}
      </div>
      
      {/* Footer Slot */}
      {slots.footer && (
        <div className={`${paddingClasses[padding]} border-t border-gray-200/50 bg-gray-50/50`}>
          {slots.footer}
        </div>
      )}
    </div>
  );
};

export default Card;
