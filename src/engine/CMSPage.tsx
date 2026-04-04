import React from 'react';
import { WebsiteDesign, PageDesign } from '../types';

 interface CMSPageProps {
  design: WebsiteDesign;
  componentMap: Record<string, any>;
  route: string;
  page?: PageDesign; // Optional pre-fetched page for static generation optimization
}

export const CMSPage: React.FC<CMSPageProps> = ({ design, componentMap, route, page: prefetchedPage }) => {
  if (!design || !design.pages) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Database Connection Error</h1>
        <p className="text-gray-600 mt-4">Failed to fetch site design for this project. Check your backend port (4000) and NEXT_PUBLIC_PROJECT_NAME.</p>
      </div>
    );
  }

  const page = prefetchedPage || design.pages.find((p: any) => p.route === route);

  if (!page) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-600 mt-2">The route "{route}" is not defined in your database for this project.</p>
        <div className="mt-6 flex gap-4 justify-center">
          <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Go Home</a>
        </div>
      </div>
    );
  }

  const themeStyles = {
    '--primary-color': design.theme.primaryColor,
    '--secondary-color': design.theme.secondaryColor,
    fontFamily: design.theme.fontFamily,
  } as React.CSSProperties;

  return (
    <div className={design.theme.darkMode ? 'dark' : ''} style={themeStyles}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <main>
          {page.components.length === 0 ? (
            <div className="p-20 text-center">
              <h2 className="text-xl font-semibold opacity-50">Empty Page</h2>
              <p className="mt-2">This route exists in the DB, but has no components assigned to it.</p>
            </div>
          ) : (
            page.components
              .sort((a, b) => a.order - b.order)
              .map((comp: any, index: number) => {
                const Component = componentMap[comp.type];
                if (!Component) {
                  return (
                    <div key={index} className="p-4 m-2 border-2 border-dashed border-red-300 rounded text-red-500">
                      Component "{comp.type}" not found in your project components!
                    </div>
                  );
                }
                return (
                  <Component 
                    key={`${comp.type}-${index}`} 
                    {...comp.props} 
                    projectName={design.projectName}
                    pages={design.pages}
                    theme={design.theme} 
                  />
                );
              })
          )}
        </main>
      </div>
    </div>
  );
};
