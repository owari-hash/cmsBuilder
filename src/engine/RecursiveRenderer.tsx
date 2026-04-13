/**
 * RecursiveRenderer - Renders nested component trees
 * Processes ComponentNode tree and outputs React elements
 */

import React from 'react';
import { ComponentNode, ProjectTheme, SlotNode } from '../types';
import { ComponentRegistry, isValidComponent } from './ComponentRegistry';
import { mergeProjectTokens } from './Tokens';
import { UnknownComponent } from '../components/UnknownComponent';
import { omitCanvasLayout, parseCanvasLayout } from './canvasLayout';

interface RecursiveRendererProps {
  node: ComponentNode;
  projectTheme: ProjectTheme;
  depth?: number;
  maxDepth?: number;
  /**
   * Global `_canvas` (x,y) of the nearest ancestor that uses canvas positioning.
   * Used so nested nodes share the same coordinate space as the superadmin canvas.
   */
  canvasAnchorGlobal?: { x: number; y: number } | null;
}

/**
 * Recursively renders a component node and its children
 */
export const RecursiveRenderer: React.FC<RecursiveRendererProps> = ({
  node,
  projectTheme,
  depth = 0,
  maxDepth = 10,
  canvasAnchorGlobal = null,
}) => {
  // Safety: prevent infinite recursion
  if (depth > maxDepth) {
    return (
      <div className="p-4 border-2 border-red-500 bg-red-50 text-red-600 rounded">
        <strong>Maximum nesting depth exceeded</strong>
        <p className="text-sm mt-1">Depth: {depth}, Limit: {maxDepth}</p>
        <p className="text-xs mt-2 opacity-70">Component: {node.componentType} ({node.instanceId})</p>
      </div>
    );
  }

  // Validate component exists
  if (!isValidComponent(node.componentType)) {
    return (
      <UnknownComponent
        componentType={node.componentType}
        instanceId={node.instanceId}
        reason="Component type is not registered in the current framework build."
      />
    );
  }

  const { component: Component, meta } = ComponentRegistry[node.componentType.toLowerCase()];

  const canvasLayout = parseCanvasLayout(node.props as Record<string, unknown>);

  // Build merged token values from project theme (serializable only)
  const mergedTokens = mergeProjectTokens(projectTheme);

  const propsWithoutCanvas = omitCanvasLayout({ ...(node.props || {}) } as Record<string, unknown>);

  // Build props with tokens injected (`_canvas` is layout-only, not passed to section components)
  const props: Record<string, any> = {
    ...propsWithoutCanvas,
    __tokens: mergedTokens, // Keep serializable token map only
    __depth: depth, // For debugging
    __instanceId: node.instanceId, // For debugging/editing
  };

  if (!props.children && props.slots && typeof props.slots === 'object') {
    props.children = props.slots.default || null;
  }

  // Build slot children recursively
  const slots: Record<string, React.ReactNode> = {};
  
  const anchorForChildren =
    canvasLayout !== null
      ? { x: canvasLayout.x, y: canvasLayout.y }
      : canvasAnchorGlobal;

  if (meta.acceptsChildren && node.children && node.children.length > 0) {
    node.children.forEach((slotNode: SlotNode) => {
      slots[slotNode.slot] = slotNode.components.map((childNode: ComponentNode, index: number) => (
        <RecursiveRenderer
          key={`${childNode.instanceId}-${index}`}
          node={childNode}
          projectTheme={projectTheme}
          depth={depth + 1}
          maxDepth={maxDepth}
          canvasAnchorGlobal={anchorForChildren}
        />
      ));
    });
  }

  // Merge slots into props if any exist
  if (Object.keys(slots).length > 0) {
    props.slots = slots;
  }

  // Render with error boundary
  try {
    const inner = <Component {...props} />;
    if (!canvasLayout) {
      return inner;
    }
    const left = canvasAnchorGlobal
      ? canvasLayout.x - canvasAnchorGlobal.x
      : canvasLayout.x;
    const top = canvasAnchorGlobal
      ? canvasLayout.y - canvasAnchorGlobal.y
      : canvasLayout.y;
    const style: React.CSSProperties = {
      position: 'absolute',
      left,
      top,
      zIndex: canvasLayout.z ?? 1,
    };
    if (canvasLayout.w !== undefined) style.width = canvasLayout.w;
    if (canvasLayout.h !== undefined) style.height = canvasLayout.h;
    return (
      <div
        className="cms-builder-canvas-node"
        style={style}
        data-instance-id={node.instanceId}
        data-canvas-layout="1"
      >
        {inner}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 border-2 border-red-500 bg-red-50 text-red-700 rounded">
        <strong>Render Error</strong>
        <p className="text-sm mt-1">Component: {node.componentType}</p>
        <p className="text-xs mt-2 font-mono">{String(error)}</p>
      </div>
    );
  }
};

/**
 * Build component tree from flat instances
 * Converts flat parentId references to nested tree structure
 */
export const buildComponentTree = (instances: any[]): ComponentNode[] => {
  const map = new Map<string, ComponentNode>();
  const roots: ComponentNode[] = [];

  // First pass: create nodes with empty children
  instances.forEach((inst: any) => {
    map.set(inst.instanceId, {
      ...inst,
      children: []
    } as ComponentNode);
  });

  // Second pass: link parents and build slot structure
  instances.forEach((inst: any) => {
    const node = map.get(inst.instanceId)!;
    
    if (inst.parentId === null || inst.parentId === undefined) {
      // Root level component
      roots.push(node);
    } else {
      // Child component - find parent
      const parent = map.get(inst.parentId);
      if (parent) {
        // Find or create slot node
        const slotName = inst.slot || 'default';
        let slotNode = parent.children.find(s => s.slot === slotName);
        
        if (!slotNode) {
          slotNode = { slot: slotName, components: [] };
          parent.children.push(slotNode);
        }
        
        slotNode.components.push(node);
      }
    }
  });

  // Sort by order at each level
  roots.sort((a, b) => a.order - b.order);
  
  roots.forEach(root => {
    // Sort slots (optional: custom slot order)
    root.children.forEach(slot => {
      // Sort components within each slot
      slot.components.sort((a, b) => a.order - b.order);
    });
  });

  return roots;
};

/**
 * Flatten tree back to instances (for saving to DB)
 */
export const flattenComponentTree = (nodes: ComponentNode[]): any[] => {
  const instances: any[] = [];

  const flattenNode = (node: ComponentNode, parentId: string | null = null, slot: string | null = null) => {
    const instance = {
      instanceId: node.instanceId,
      projectName: node.projectName,
      pageRoute: node.pageRoute,
      componentType: node.componentType,
      parentId,
      slot,
      order: node.order,
      props: node.props,
      updatedAt: node.updatedAt
    };
    
    instances.push(instance);

    // Recursively flatten children
    if (node.children) {
      node.children.forEach(slotNode => {
        slotNode.components.forEach(child => {
          flattenNode(child, node.instanceId, slotNode.slot);
        });
      });
    }
  };

  nodes.forEach(node => flattenNode(node, null, null));
  
  return instances;
};

export default RecursiveRenderer;
