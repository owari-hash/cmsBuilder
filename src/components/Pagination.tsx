import React from 'react';
import { PaginationSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';

export const Pagination: React.FC<any> = (rawProps) => {
  const parseResult = PaginationSchema.safeParse(rawProps);
  
  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Pagination Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const bgClass = bgMap[props.theme];

  // Derive pages from context if available, otherwise fallback
  const pages = rawProps.pages || [];
  const currentRoute = rawProps.currentRoute || '/';

  const currentIndex = pages.findIndex((p: any) => p.route === currentRoute);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex !== -1 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <div className={`w-full py-8 text-center ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="inline-flex items-center gap-2 shadow-sm border rounded-full p-2 bg-opacity-50">
          <a
             href={prevPage ? prevPage.route : '#'} 
             className={`px-4 py-2 rounded-full text-sm font-medium ${!prevPage ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
          >
            &larr; Prev
          </a>
          
          <div className="hidden sm:flex gap-1 items-center px-4 border-l border-r border-opacity-20 border-current">
            {pages.map((p: any) => (
              <a 
                key={p.route} 
                href={p.route}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  currentRoute === p.route 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'opacity-70 hover:bg-black/10 dark:hover:bg-white/10 hover:opacity-100'
                }`}
              >
                {p.title === 'Home' || p.route === '/' ? '1' : p.title.replace(/[^0-9]/g, '') || '?'}
              </a>
            ))}
          </div>

          <a 
             href={nextPage ? nextPage.route : '#'} 
             className={`px-4 py-2 rounded-full text-sm font-medium ${!nextPage ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
          >
            Next &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
