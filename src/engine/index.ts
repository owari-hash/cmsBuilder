/**
 * CMS Builder Engine - Hybrid Architecture
 * Exports all engine modules for component rendering and theme management
 */

// Component Registry
export {
  ComponentRegistry,
  BaseComponents,
  isValidComponent,
  getComponent,
  getComponentMeta,
  getAllComponentTypes,
  getComponentsByCategory,
  acceptsChildren,
  getValidSlots,
  isValidSlot
} from './ComponentRegistry';

// Core Engine
export { CMSPage } from './CMSPage';
export { RecursiveRenderer } from './RecursiveRenderer.tsx';
export { ThemeProvider, useTheme } from './ThemeProvider';
export { createTokenMap, mergeProjectTokens, baseTokens } from './Tokens';

// Types
export type {
  ComponentCategory,
  ComponentMeta,
  RegisteredComponent
} from '../types';
