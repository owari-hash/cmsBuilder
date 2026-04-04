/**
 * ComponentRegistry - Type-safe component registry for hybrid architecture
 * 
 * Layouts: Accept children via slots
 * Sections: Page-level blocks (no children)
 * Primitives: Atomic UI elements (no children)
 */

import React from 'react';
import { RegisteredComponent, ComponentMeta, ComponentCategory } from '../types';

// Import existing components
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Footer } from '../components/Footer';
import { Pagination } from '../components/Pagination';
import { Button } from '../components/Button';

// Layout components
import { TwoColumn } from '../components/layouts/TwoColumn';
import { Grid } from '../components/layouts/Grid';
import { Card } from '../components/layouts/Card';
import { Container } from '../components/layouts/Container';

// ==========================================
// Component Registry Definition
// ==========================================

export const ComponentRegistry: Record<string, RegisteredComponent> = {
  // ==========================================
  // SECTIONS - Page-level blocks (no children)
  // ==========================================
  
  header: {
    component: Header,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Sticky navigation header with logo, links, and CTA'
    }
  },
  
  hero: {
    component: Hero,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Hero section with title, subtitle, buttons, and images'
    }
  },
  
  about: {
    component: About,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Content section with title, description, and images'
    }
  },
  
  footer: {
    component: Footer,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Site footer with links and copyright'
    }
  },
  
  // ==========================================
  // LAYOUTS - Container components with slots
  // ==========================================
  
  twocolumn: {
    component: TwoColumn,
    meta: {
      category: 'layout' as ComponentCategory,
      acceptsChildren: true,
      slots: ['left', 'right'],
      description: 'Two-column layout with configurable ratio'
    }
  },
  
  grid: {
    component: Grid,
    meta: {
      category: 'layout' as ComponentCategory,
      acceptsChildren: true,
      slots: ['items'],
      description: 'CSS Grid container for multiple items'
    }
  },
  
  card: {
    component: Card,
    meta: {
      category: 'layout' as ComponentCategory,
      acceptsChildren: true,
      slots: ['header', 'content', 'footer'],
      description: 'Card container with header, content, and footer slots'
    }
  },
  
  container: {
    component: Container,
    meta: {
      category: 'layout' as ComponentCategory,
      acceptsChildren: true,
      slots: ['default'],
      description: 'Max-width container with padding options'
    }
  },
  
  // ==========================================
  // PRIMITIVES - Atomic UI elements (Phase 2)
  // ==========================================
  
  pagination: {
    component: Pagination,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Page navigation with prev/next and numbered links'
    }
  },
  
  button: {
    component: Button,
    meta: {
      category: 'primitive' as ComponentCategory,
      acceptsChildren: false,
      description: 'Clickable button with multiple variants and sizes'
    }
  },
  
  // typography: {
  //   component: Typography,
  //   meta: {
  //     category: 'primitive' as ComponentCategory,
  //     acceptsChildren: false,
  //     description: 'Text component with heading/paragraph variants'
  //   }
  // },
  
  // image: {
  //   component: Image,
  //   meta: {
  //     category: 'primitive' as ComponentCategory,
  //     acceptsChildren: false,
  //     description: 'Responsive image with lazy loading'
  //   }
  // },
};

// ==========================================
// Helper Functions
// ==========================================

/**
 * Check if a component type is registered
 */
export const isValidComponent = (type: string): boolean => {
  return type.toLowerCase() in ComponentRegistry;
};

/**
 * Get a registered component by type
 */
export const getComponent = (type: string): RegisteredComponent | undefined => {
  return ComponentRegistry[type.toLowerCase()];
};

/**
 * Get component metadata
 */
export const getComponentMeta = (type: string): ComponentMeta | undefined => {
  return ComponentRegistry[type.toLowerCase()]?.meta;
};

/**
 * Get all registered component types
 */
export const getAllComponentTypes = (): string[] => {
  return Object.keys(ComponentRegistry);
};

/**
 * Get components by category
 */
export const getComponentsByCategory = (category: ComponentCategory): string[] => {
  return Object.entries(ComponentRegistry)
    .filter(([_, config]) => config.meta.category === category)
    .map(([type, _]) => type);
};

/**
 * Check if component accepts children
 */
export const acceptsChildren = (type: string): boolean => {
  return ComponentRegistry[type.toLowerCase()]?.meta.acceptsChildren || false;
};

/**
 * Get valid slots for a layout component
 */
export const getValidSlots = (type: string): string[] => {
  return ComponentRegistry[type.toLowerCase()]?.meta.slots || [];
};

/**
 * Validate a slot name for a component
 */
export const isValidSlot = (componentType: string, slot: string): boolean => {
  const slots = getValidSlots(componentType);
  return slots.length === 0 || slots.includes(slot);
};

// ==========================================
// Base Components Export (for CMSPage)
// ==========================================

export const BaseComponents: Record<string, React.FC<any>> = Object.fromEntries(
  Object.entries(ComponentRegistry).map(([type, config]) => [
    type.toLowerCase(),
    config.component
  ])
);
