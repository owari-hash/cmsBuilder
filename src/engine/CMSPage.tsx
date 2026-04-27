/**
 * CMSPage - Hybrid Architecture Renderer
 * Renders nested component trees with project-specific theming
 */

import React from 'react';
import { WebsiteDesign, ComponentInstance } from '../types';
import { RecursiveRenderer, buildComponentTree } from './RecursiveRenderer';
import { generateCSSVariables } from './Tokens';
import { computeCanvasStageMinHeight, pageHasCanvasLayout } from './canvasLayout';
import { dedupeRootInstances } from './dedupeRootInstances';
import { normalizePageRoute } from './pageRoute';

interface CMSPageProps {
  design: WebsiteDesign;
  route: string;
  // Flat component instances from API - tree built at render time
  componentInstances?: ComponentInstance[];
  /**
   * When true (e.g. client admin iframe preview), text nodes may expose `data-cms-editable`
   * for double-click inline edit + postMessage to parent.
   */
  liveEdit?: boolean;
}

export const CMSPage: React.FC<CMSPageProps> = ({ 
  design, 
  route, 
  componentInstances,
  liveEdit = false,
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

  const routeKey = normalizePageRoute(route);

  // Build component tree from flat instances
  const normalizedInstances = Array.isArray(componentInstances)
    ? componentInstances.map((instance) => ({
        ...instance,
        componentType: String(instance.componentType || (instance as any).type || '').toLowerCase()
      }))
    : [];

  const routeInstances = dedupeRootInstances(
    normalizedInstances.filter(
      (instance) => normalizePageRoute(instance.pageRoute) === routeKey,
    ),
  );
  const globalInstances = normalizedInstances.filter(
    (instance) => normalizePageRoute(instance.pageRoute) === '/',
  );
  const dedupedGlobalRoots = dedupeRootInstances(globalInstances);
  const hasRouteHeader = routeInstances.some((instance) => instance.parentId == null && instance.componentType === 'header');
  const hasRouteFooter = routeInstances.some((instance) => instance.parentId == null && instance.componentType === 'footer');
  const globalHeader = dedupedGlobalRoots.find(
    (instance) => instance.parentId == null && instance.componentType === 'header',
  );
  const globalFooter = dedupedGlobalRoots.find(
    (instance) => instance.parentId == null && instance.componentType === 'footer',
  );

  // Runtime safety net: if shell is missing on route data, inject from global route.
  const effectiveInstances = [
    ...routeInstances,
    ...(!hasRouteHeader && globalHeader ? [{ ...globalHeader, pageRoute: routeKey }] : []),
    ...(!hasRouteFooter && globalFooter ? [{ ...globalFooter, pageRoute: routeKey }] : []),
  ];

  const componentTree = effectiveInstances.length > 0
    ? buildComponentTree(effectiveInstances)
    : [];

  // Generate CSS variables from theme
  const themeStyles = generateCSSVariables(design.theme);

  // Check if we have any components to render
  const hasComponents = componentTree && componentTree.length > 0;

  const useCanvasStage = pageHasCanvasLayout(effectiveInstances);
  const canvasStageMinHeight = useCanvasStage ? computeCanvasStageMinHeight(effectiveInstances) : undefined;

  return (
    <div 
      className={design.theme.darkMode ? 'dark' : ''} 
      style={themeStyles}
      data-project={design.projectName}
      data-route={routeKey}
    >
      <div
        className={`min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
          design.theme.pageBackground ? "" : "bg-white dark:bg-gray-900"
        }`}
        style={{
          ...(design.theme.pageBackground
            ? { backgroundColor: design.theme.pageBackground }
            : {}),
          ...(design.theme.fontFamily
            ? { fontFamily: design.theme.fontFamily }
            : {}),
        }}
      >
        <main
          className={useCanvasStage ? 'relative w-full' : undefined}
          style={useCanvasStage && canvasStageMinHeight !== undefined ? { minHeight: canvasStageMinHeight } : undefined}
        >
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
                canvasAnchorGlobal={null}
                liveEdit={liveEdit}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
