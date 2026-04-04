/**
 * CMS Builder Types - Hybrid Architecture
 * Component code in TypeScript files, structure stored in MongoDB
 */

// ==========================================
// 1. Component Metadata (from DB)
// ==========================================

export interface ComponentInstance {
  _id?: string;
  instanceId: string;           // Unique per project (e.g., "hdr-001", "hero-main")
  projectName: string;          // Links to project
  pageRoute: string;            // Which page this belongs to
  componentType: string;        // Must exist in ComponentRegistry
  parentId: string | null;      // null = root level, otherwise parent's instanceId
  slot: string | null;          // null for root, "left"/"right"/"content" for children
  order: number;                // Sort order within parent/slot
  props: Record<string, any>;    // Component-specific props (validated by Zod)
  updatedAt: string;
}

export interface SlotDefinition {
  slot: string;
  components: ComponentInstance[];
}

// ==========================================
// 2. Component Tree (built at runtime)
// ==========================================

export interface ComponentNode extends ComponentInstance {
  children: SlotNode[];         // Populated by buildComponentTree()
}

export interface SlotNode {
  slot: string;
  components: ComponentNode[];
}

// ==========================================
// 3. Page & Site Design
// ==========================================

export interface PageDesign {
  route: string;
  title: string;
  description?: string;
  components: ComponentNode[];  // Tree structure (built from flat instances)
}

export interface ProjectTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  darkMode: boolean;
  customTokens?: Record<string, string>;  // Project-specific Tailwind classes
}

export interface WebsiteDesign {
  projectName: string;
  domain?: string;
  theme: ProjectTheme;
  pages: PageDesign[];
  updatedAt: string;
}

// ==========================================
// 4. Component Registry Types
// ==========================================

export type ComponentCategory = 'primitive' | 'layout' | 'section';

export interface ComponentMeta {
  category: ComponentCategory;
  acceptsChildren: boolean;
  slots?: string[];  // Defined slot names for layout components
  description?: string;
}

export interface RegisteredComponent {
  component: React.FC<any>;
  meta: ComponentMeta;
}

// ==========================================
// 5. API Response Types
// ==========================================

export interface PageContentResponse {
  design: WebsiteDesign;
  page: {
    route: string;
    title: string;
    description?: string;
    componentInstances: ComponentInstance[];  // Flat from DB
  };
}

export interface ComponentUpdatePayload {
  props?: Record<string, any>;
  parentId?: string | null;
  slot?: string | null;
  order?: number;
}

// ==========================================
// 6. Token System Types
// ==========================================

export interface TokenMap {
  bg: (token: string) => string;
  align: (token: string) => string;
  spacing: (token: string) => string;
  containerPadding: (token: string) => string;
  custom: (key: string) => string;
}

export interface MergedTokens {
  bg: Record<string, string>;
  align: Record<string, string>;
  spacing: Record<string, string>;
  containerPadding: Record<string, string>;
  custom: Record<string, string>;
}

// ==========================================
// 7. Validation Types
// ==========================================

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ComponentValidationResult {
  valid: boolean;
  errors: ValidationError[];
  sanitizedProps?: Record<string, any>;
}

// React import for component types
import React from 'react';
