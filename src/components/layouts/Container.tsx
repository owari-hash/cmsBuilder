/**
 * Container - Max-width wrapper with padding
 * Simple layout component for section containment
 */

import React from 'react';
import { ContainerSchema } from '../../schemas';
import { bgMap } from '../../engine/Tokens';

interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'primary' | 'secondary';
  // Slots injected by RecursiveRenderer
  slots?: {
    default?: React.ReactNode;
  };
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'xl',
  padding = 'lg',
  theme = 'light',
  slots = {}
}) => {
  // Validate props
  const parseResult = ContainerSchema.safeParse({
    maxWidth, padding, theme
  });

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Container Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.issues, null, 2)}</pre>
      </div>
    );
  }

  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  };

  const paddingClasses = {
    none: 'py-0 px-0',
    sm: 'py-4 px-4',
    md: 'py-8 px-4 md:px-6',
    lg: 'py-12 px-4 md:px-6 lg:px-8',
    xl: 'py-16 px-4 md:px-6 lg:px-8 xl:px-12'
  };

  const bgClass = bgMap[theme];

  return (
    <section className={`w-full ${bgClass}`}>
      <div className={`container mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]}`}>
        {slots.default || (
          <div className="p-8 border-2 border-dashed border-gray-300 rounded text-gray-400 text-center">
            Container slot - empty
          </div>
        )}
      </div>
    </section>
  );
};

export default Container;
