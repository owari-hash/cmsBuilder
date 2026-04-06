/**
 * RecursiveRenderer - Renders nested component trees
 * Processes ComponentNode tree and outputs React elements
 */

import React from 'react';
import { ComponentNode, ProjectTheme, SlotNode } from '../types';
import { ComponentRegistry, isValidComponent } from './ComponentRegistry';
import { createTokenMap, mergeProjectTokens } from './Tokens';
import { UnknownComponent } from '../components/UnknownComponent';

interface RecursiveRendererProps {
  node: ComponentNode;
  projectTheme: ProjectTheme;
  depth?: number;
  maxDepth?: number;
}

/**
 * Recursively renders a component node and its children
 */
export const RecursiveRenderer: React.FC<RecursiveRendererProps> = ({
  node,
  projectTheme,
  depth = 0,
  maxDepth = 10
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
  
  // Build tokens from project theme
  const mergedTokens = mergeProjectTokens(projectTheme);
  const tokens = createTokenMap(mergedTokens);
  
  // Build props with tokens injected
  const props: Record<string, any> = {
    ...node.props,
    __tokens: tokens,       // Available if component needs direct token access
    __depth: depth,         // For debugging
    __instanceId: node.instanceId // For debugging/editing
  };

  if (!props.children && props.slots && typeof props.slots === 'object') {
    props.children = props.slots.default || null;
  }

  // Build slot children recursively
  const slots: Record<string, React.ReactNode> = {};
  
  if (meta.acceptsChildren && node.children && node.children.length > 0) {
    node.children.forEach((slotNode: SlotNode) => {
      slots[slotNode.slot] = slotNode.components.map((childNode: ComponentNode, index: number) => (
        <RecursiveRenderer
          key={`${childNode.instanceId}-${index}`}
          node={childNode}
          projectTheme={projectTheme}
          depth={depth + 1}
          maxDepth={maxDepth}
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
    return <Component {...props} />;
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
