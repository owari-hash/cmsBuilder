import React from 'react';
import { WebsiteDesign, PageDesign } from '../types';

interface CMSPageProps {
  design: WebsiteDesign;
  componentMap: Record<string, any>;
  route: string;
}

export const CMSPage: React.FC<CMSPageProps> = ({ design, componentMap, route }) => {
  const page = design.pages.find((p) => p.route === route);

  if (!page) {
    return <div>404 - Page Not Found</div>;
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
          {page.components
            .sort((a, b) => a.order - b.order)
            .map((comp, index) => {
              const Component = componentMap[comp.type];
              if (!Component) {
                console.warn(`Component type "${comp.type}" not found in componentMap.`);
                return null;
              }
              return <Component key={`${comp.type}-${index}`} {...comp.props} theme={design.theme} />;
            })}
        </main>
      </div>
    </div>
  );
};
