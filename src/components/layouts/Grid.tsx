/**
 * Grid - CSS Grid layout component
 * Supports configurable columns and gap
 */

import React from 'react';
import { GridSchema } from '../../schemas';
import { bgMap } from '../../engine/Tokens';

interface GridProps {
  columns?: number;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'primary' | 'secondary';
  minItemWidth?: string;  // e.g., "250px" for auto-fill
  // Slots injected by RecursiveRenderer
  slots?: {
    items?: React.ReactNode;
  };
}

export const Grid: React.FC<GridProps> = ({ 
  columns = 3,
  gap = 'md',
  theme = 'light',
  minItemWidth,
  slots = {}
}) => {
  // Validate props
  const parseResult = GridSchema.safeParse({
    columns, gap, theme
  });

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Grid Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.issues, null, 2)}</pre>
      </div>
    );
  }

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const bgClass = bgMap[theme];

  // Generate grid style
  const gridStyle: React.CSSProperties = minItemWidth 
    ? { gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}, 1fr))` }
    : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` };

  return (
    <section className={`w-full ${bgClass}`}>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div 
          className={`grid ${gapClasses[gap]}`}
          style={gridStyle}
        >
          {slots.items || (
            <div className="col-span-full p-8 border-2 border-dashed border-gray-300 rounded text-gray-400 text-center">
              Grid items slot - empty
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Grid;
