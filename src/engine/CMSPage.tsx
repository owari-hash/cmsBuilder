/**
 * CMSPage - Hybrid Architecture Renderer
 * Renders nested component trees with project-specific theming
 */

import React from 'react';
import { WebsiteDesign, ComponentInstance } from '../types';
import { RecursiveRenderer, buildComponentTree } from './RecursiveRenderer';
import { generateCSSVariables } from './Tokens';

interface CMSPageProps {
  design: WebsiteDesign;
  route: string;
  // Flat component instances from API - tree built at render time
  componentInstances?: ComponentInstance[];
}

export const CMSPage: React.FC<CMSPageProps> = ({ 
  design, 
  route, 
  componentInstances 
}) => {
  // Validate design data
  if (!design || !design.theme) {
    return (
      <div className="p-20 text-center min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Failed to load site design. Check your backend connection and NEXT_PUBLIC_PROJECT_NAME environment variable.
          </p>
        </div>
      </div>
    );
  }

  // Build component tree from flat instances
  const normalizedInstances = Array.isArray(componentInstances)
    ? componentInstances.map((instance) => ({
        ...instance,
        componentType: String(instance.componentType || (instance as any).type || '').toLowerCase()
      }))
    : [];

  const componentTree = normalizedInstances.length > 0
    ? buildComponentTree(normalizedInstances)
    : [];

  // Generate CSS variables from theme
  const themeStyles = generateCSSVariables(design.theme);

  // Check if we have any components to render
  const hasComponents = componentTree && componentTree.length > 0;

  return (
    <div 
      className={design.theme.darkMode ? 'dark' : ''} 
      style={themeStyles}
      data-project={design.projectName}
      data-route={route}
    >
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <main>
          {!hasComponents ? (
            <div className="p-20 text-center">
              <h2 className="text-xl font-semibold opacity-50">Empty Page</h2>
              <p className="mt-2 text-gray-500">
                This page has no components. Add components from the CMS to get started.
              </p>
            </div>
          ) : (
            componentTree.map((node, index) => (
              <RecursiveRenderer
                key={`${node.instanceId}-${index}`}
                node={node}
                projectTheme={design.theme}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
