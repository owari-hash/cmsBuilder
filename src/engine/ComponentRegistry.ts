/**
 * ComponentRegistry - Type-safe component registry for hybrid architecture
 * 
 * Layouts: Accept children via slots
 * Sections: Page-level blocks (no children)
 * Primitives: Atomic UI elements (no children)
 */

import React from 'react';
import {
  RegisteredComponent,
  ComponentMeta,
  ComponentCategory,
  RegistryComponentType,
  IndustryModule
} from '../types';

// Import existing components
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Footer } from '../components/Footer';
import { Pagination } from '../components/Pagination';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Chatbot } from '../components/Chatbot';
import { Livechat } from '../components/Livechat';
import { Services } from '../components/Services';
import { Rental } from '../components/Rental';
import { ContactSection } from '../components/ContactSection';
import { TextSection } from '../components/TextSection';
import { NewsSection } from '../components/NewsSection';
import { JobsSection } from '../components/JobsSection';
import { ContactFormSection } from '../components/ContactFormSection';

// Layout components
import { TwoColumn } from '../components/layouts/TwoColumn';
import { Grid } from '../components/layouts/Grid';
import { Card } from '../components/layouts/Card';
import { Container } from '../components/layouts/Container';

// ==========================================
// Component Registry Definition
// ==========================================

const defaultComponentRegistry: Record<string, RegisteredComponent> = {
  // ==========================================
  // SECTIONS - Page-level blocks (no children)
  // ==========================================
  
  header: {
    component: Header,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Sticky navigation header with logo, links, and CTA',
      version: '1.0.0',
      capabilities: ['navigation', 'branding'],
      requiredProps: ['title'],
      deprecations: []
    }
  },
  
  hero: {
    component: Hero,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Hero section with title, subtitle, buttons, and images',
      version: '1.0.0',
      capabilities: ['marketing', 'cta'],
      requiredProps: ['title'],
      deprecations: []
    }
  },
  
  about: {
    component: About,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Content section with title, description, and images',
      version: '1.0.0',
      capabilities: ['content'],
      requiredProps: [],
      deprecations: []
    }
  },
  
  footer: {
    component: Footer,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Site footer with links and copyright',
      version: '1.0.0',
      capabilities: ['navigation', 'legal'],
      requiredProps: ['copyright'],
      deprecations: []
    }
  },

  services: {
    component: Services,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Service or feature grid with title and linkable items',
      version: '1.0.0',
      capabilities: ['content', 'marketing'],
      requiredProps: [],
      deprecations: []
    }
  },

  contact: {
    component: ContactSection,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Contact details block (phone, email, address, hours, optional map iframe URL)',
      version: '1.0.0',
      capabilities: ['content'],
      requiredProps: [],
      deprecations: []
    }
  },

  text: {
    component: TextSection,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Title plus body text or HTML (content, body, or text field)',
      version: '1.0.0',
      capabilities: ['content'],
      requiredProps: [],
      deprecations: []
    }
  },

  news: {
    component: NewsSection,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'News or article teasers with optional image and link',
      version: '1.0.0',
      capabilities: ['content'],
      requiredProps: [],
      deprecations: []
    }
  },

  rental: {
    component: Rental,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Rental or listing cards (same item shape as services, supports images)',
      version: '1.0.0',
      capabilities: ['content', 'marketing'],
      requiredProps: [],
      deprecations: []
    }
  },

  jobs: {
    component: JobsSection,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Job openings list with apply links',
      version: '1.0.0',
      capabilities: ['content'],
      requiredProps: [],
      deprecations: []
    }
  },

  'contact-form': {
    component: ContactFormSection,
    meta: {
      category: 'section' as ComponentCategory,
      acceptsChildren: false,
      description: 'Inline contact form with configurable fields and optional API submit',
      version: '1.0.0',
      capabilities: ['interaction', 'leadCapture'],
      requiredProps: [],
      deprecations: []
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
      description: 'Two-column layout with configurable ratio',
      version: '1.0.0',
      capabilities: ['layout'],
      requiredProps: [],
      deprecations: []
    }
  },
  
  grid: {
    component: Grid,
    meta: {
      category: 'layout' as ComponentCategory,
      acceptsChildren: true,
      slots: ['items'],
      description: 'CSS Grid container for multiple items',
      version: '1.0.0',
      capabilities: ['layout'],
      requiredProps: [],
      deprecations: []
    }
  },
  
  card: {
    component: Card,
    meta: {
      category: 'layout' as ComponentCategory,
      acceptsChildren: true,
      slots: ['header', 'content', 'footer'],
      description: 'Card container with header, content, and footer slots',
      version: '1.0.0',
      capabilities: ['layout'],
      requiredProps: [],
      deprecations: []
    }
  },
  
  container: {
    component: Container,
    meta: {
      category: 'layout' as ComponentCategory,
      acceptsChildren: true,
      slots: ['default'],
      description: 'Max-width container with padding options',
      version: '1.0.0',
      capabilities: ['layout'],
      requiredProps: [],
      deprecations: []
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
      description: 'Page navigation with prev/next and numbered links',
      version: '1.0.0',
      capabilities: ['navigation'],
      requiredProps: [],
      deprecations: []
    }
  },
  
  button: {
    component: Button,
    meta: {
      category: 'primitive' as ComponentCategory,
      acceptsChildren: false,
      description: 'Clickable button with multiple variants and sizes',
      version: '1.0.0',
      capabilities: ['interaction'],
      requiredProps: [],
      deprecations: []
    }
  },

  modal: {
    component: Modal,
    meta: {
      category: 'primitive' as ComponentCategory,
      acceptsChildren: false,
      description: 'Customizable modal dialog with overlay and actions',
      version: '1.0.0',
      capabilities: ['interaction', 'overlay', 'dialog'],
      requiredProps: [],
      deprecations: []
    }
  },

  chatbot: {
    component: Chatbot,
    meta: {
      category: 'primitive' as ComponentCategory,
      acceptsChildren: false,
      description: 'Floating chatbot widget with local UI messages and quick replies',
      version: '1.0.0',
      capabilities: ['interaction', 'support', 'chat'],
      requiredProps: [],
      deprecations: []
    }
  },

  livechat: {
    component: Livechat,
    meta: {
      category: 'primitive' as ComponentCategory,
      acceptsChildren: false,
      description: 'Floating live chat widget with agent status and local message flow',
      version: '1.0.0',
      capabilities: ['interaction', 'support', 'livechat'],
      requiredProps: [],
      deprecations: []
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
// Active registry (empty until you register)
// ==========================================
//
// Nothing renders until components are registered. Use registerCmsComponents() for your
// map, or registerDefaultCmsComponents() once if you want the built-in Header/Hero/… set.

let userRegistry: Record<string, RegisteredComponent> = {};

let cachedActiveRegistry: Record<string, RegisteredComponent> | null = null;

function computeActiveRegistry(): Record<string, RegisteredComponent> {
  return { ...userRegistry };
}

export function getActiveRegistry(): Record<string, RegisteredComponent> {
  if (cachedActiveRegistry === null) {
    cachedActiveRegistry = computeActiveRegistry();
  }
  return cachedActiveRegistry;
}

export function registerCmsComponents(
  map: Record<string, RegisteredComponent>
): void {
  for (const [k, v] of Object.entries(map)) {
    userRegistry[k.toLowerCase()] = v;
  }
  cachedActiveRegistry = null;
}

/** Optional: register the full built-in component set (Header, Hero, layouts, …). */
export function registerDefaultCmsComponents(): void {
  registerCmsComponents(defaultComponentRegistry);
}

/** @internal Reset user registrations (e.g. tests). */
export function resetCmsUserComponents(): void {
  userRegistry = {};
  cachedActiveRegistry = null;
}

export { defaultComponentRegistry };

export const ComponentRegistry = new Proxy(
  {} as Record<string, RegisteredComponent>,
  {
    get(_, prop: string | symbol) {
      if (typeof prop === 'symbol') return undefined;
      return getActiveRegistry()[prop.toLowerCase()];
    },
    has(_, prop: string | symbol) {
      if (typeof prop === 'symbol') return false;
      return prop.toLowerCase() in getActiveRegistry();
    },
    ownKeys() {
      return Object.keys(getActiveRegistry());
    },
    getOwnPropertyDescriptor(_, prop: string | symbol) {
      if (typeof prop === 'symbol') return undefined;
      const reg = getActiveRegistry();
      const key = prop.toLowerCase();
      if (key in reg) {
        return {
          enumerable: true,
          configurable: true,
          value: reg[key],
        };
      }
      return undefined;
    },
  }
);

// ==========================================
// Helper Functions
// ==========================================

/**
 * Check if a component type is registered
 */
export const isValidComponent = (type: string): boolean => {
  return type.toLowerCase() in getActiveRegistry();
};

/**
 * Get a registered component by type
 */
export const getComponent = (type: string): RegisteredComponent | undefined => {
  return getActiveRegistry()[type.toLowerCase()];
};

/**
 * Get component metadata
 */
export const getComponentMeta = (type: string): ComponentMeta | undefined => {
  return getActiveRegistry()[type.toLowerCase()]?.meta;
};

/**
 * Get all registered component types
 */
export const getAllComponentTypes = (): string[] => {
  return Object.keys(getActiveRegistry());
};

export const getVersionedComponentTypes = (): RegistryComponentType[] => {
  return Object.entries(getActiveRegistry()).map(([type, config]) => ({
    type,
    category: config.meta.category,
    description: config.meta.description || '',
    slots: config.meta.slots,
    version: config.meta.version || '1.0.0',
    capabilities: config.meta.capabilities || [],
    requiredProps: config.meta.requiredProps || [],
    deprecations: config.meta.deprecations || [],
  }));
};

/**
 * Get components by category
 */
export const getComponentsByCategory = (category: ComponentCategory): string[] => {
  return Object.entries(getActiveRegistry())
    .filter(([_, config]) => config.meta.category === category)
    .map(([type, _]) => type);
};

/**
 * Check if component accepts children
 */
export const acceptsChildren = (type: string): boolean => {
  return getActiveRegistry()[type.toLowerCase()]?.meta.acceptsChildren || false;
};

/**
 * Get valid slots for a layout component
 */
export const getValidSlots = (type: string): string[] => {
  return getActiveRegistry()[type.toLowerCase()]?.meta.slots || [];
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

export function getBaseComponents(): Record<string, React.FC<any>> {
  return Object.fromEntries(
    Object.entries(getActiveRegistry()).map(([type, config]) => [
      type.toLowerCase(),
      config.component,
    ])
  );
}

export const BaseComponents = new Proxy({} as Record<string, React.FC<any>>, {
  get(_, prop: string | symbol) {
    if (typeof prop === 'symbol') return undefined;
    return getActiveRegistry()[prop.toLowerCase()]?.component;
  },
  has(_, prop: string | symbol) {
    if (typeof prop === 'symbol') return false;
    return prop.toLowerCase() in getActiveRegistry();
  },
  ownKeys() {
    return Object.keys(getActiveRegistry());
  },
  getOwnPropertyDescriptor(_, prop: string | symbol) {
    if (typeof prop === 'symbol') return undefined;
    const reg = getActiveRegistry();
    const key = prop.toLowerCase();
    if (key in reg) {
      return {
        enumerable: true,
        configurable: true,
        value: reg[key].component,
      };
    }
    return undefined;
  },
});

export const IndustryModules: Record<string, IndustryModule> = {
  service: {
    id: 'service',
    name: 'Service Business',
    enabledByDefault: true,
    featureFlags: ['leadCapture', 'appointments'],
    componentTypes: ['header', 'hero', 'about', 'footer', 'button']
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce',
    enabledByDefault: false,
    featureFlags: ['catalog', 'cart', 'checkout'],
    componentTypes: ['header', 'grid', 'card', 'pagination', 'footer', 'button']
  },
  booking: {
    id: 'booking',
    name: 'Booking',
    enabledByDefault: false,
    featureFlags: ['scheduling', 'availability'],
    componentTypes: ['header', 'hero', 'container', 'footer', 'button']
  },
  blog: {
    id: 'blog',
    name: 'Content/Blog',
    enabledByDefault: false,
    featureFlags: ['articles', 'authors', 'taxonomy'],
    componentTypes: ['header', 'about', 'pagination', 'footer']
  }
};

export const getIndustryModule = (moduleId: string): IndustryModule | undefined => {
  return IndustryModules[moduleId];
};

export const getAvailableIndustryModules = (): IndustryModule[] => {
  return Object.values(IndustryModules);
};
