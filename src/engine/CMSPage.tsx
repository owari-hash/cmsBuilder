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

  return (
    <main style={{ fontFamily: design.theme.fontFamily }}>
      {page.components
        .sort((a, b) => a.order - b.order)
        .map((comp, index) => {
          const Component = componentMap[comp.type];
          if (!Component) {
            console.warn(`Component type "${comp.type}" not found in componentMap.`);
            return null;
          }
          return <Component key={`${comp.type}-${index}`} {...comp.props} />;
        })}
    </main>
  );
};
