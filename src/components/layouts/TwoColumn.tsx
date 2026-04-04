/**
 * TwoColumn - Layout component with left/right slots
 * Supports configurable column ratios and responsive behavior
 */

import React from 'react';
import { TwoColumnSchema } from '../../schemas';
import { bgMap } from '../../engine/Tokens';

interface TwoColumnProps {
  ratio?: '50/50' | '60/40' | '40/60' | '70/30' | '30/70';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  verticalAlign?: 'top' | 'center' | 'bottom';
  theme?: 'light' | 'dark' | 'primary' | 'secondary';
  // Slots injected by RecursiveRenderer
  slots?: {
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
}

export const TwoColumn: React.FC<TwoColumnProps> = ({ 
  ratio = '50/50', 
  gap = 'md',
  verticalAlign = 'top',
  theme = 'light',
  slots = {}
}) => {
  // Validate props
  const parseResult = TwoColumnSchema.safeParse({
    ratio, gap, verticalAlign, theme
  });

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>TwoColumn Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.issues, null, 2)}</pre>
      </div>
    );
  }

  const ratioClasses = {
    '50/50': 'lg:grid-cols-2',
    '60/40': 'lg:grid-cols-[60%_40%]',
    '40/60': 'lg:grid-cols-[40%_60%]',
    '70/30': 'lg:grid-cols-[70%_30%]',
    '30/70': 'lg:grid-cols-[30%_70%]'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const alignClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end'
  };

  const bgClass = bgMap[theme];

  return (
    <section className={`w-full ${bgClass}`}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className={`grid grid-cols-1 ${ratioClasses[ratio]} ${gapClasses[gap]} ${alignClasses[verticalAlign]}`}>
          <div className="left-column min-h-[100px]">
            {slots.left || (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded text-gray-400 text-center">
                Left slot - empty
              </div>
            )}
          </div>
          <div className="right-column min-h-[100px]">
            {slots.right || (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded text-gray-400 text-center">
                Right slot - empty
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoColumn;
