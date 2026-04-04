/**
 * Tokens System - Hybrid Architecture
 * Base tokens + project-specific overrides
 */

import { ThemeToken, AlignToken, SpacingToken } from '../schemas';
import { ProjectTheme, MergedTokens, TokenMap } from '../types';

// ==========================================
// 1. Base Tokens (always available)
// ==========================================

export const bgMap: Record<ThemeToken, string> = {
  light: "bg-white text-gray-900 border-gray-200",
  dark: "bg-gray-900 text-white border-gray-800",
  primary: "bg-blue-600 text-white border-blue-700",
  secondary: "bg-gray-100 text-gray-800 border-gray-300"
};

export const alignMap: Record<AlignToken, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end"
};

export const spacingMap: Record<SpacingToken, string> = {
  none: "py-0",
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
  xl: "py-32"
};

export const containerPaddingMap: Record<SpacingToken, string> = {
  none: "px-0",
  sm: "px-4",
  md: "px-8",
  lg: "px-12",
  xl: "px-16"
};

export const baseTokens = {
  bg: bgMap,
  align: alignMap,
  spacing: spacingMap,
  containerPadding: containerPaddingMap
};

// ==========================================
// 2. Project Token Merge
// ==========================================

/**
 * Merge project custom tokens with base tokens
 * Project primaryColor overrides base primary
 */
export const mergeProjectTokens = (projectTheme?: ProjectTheme): MergedTokens => {
  const custom = projectTheme?.customTokens || {};
  
  // Build primary color class from hex
  const primaryColorClass = projectTheme?.primaryColor
    ? `bg-[${projectTheme.primaryColor}] text-white border-[${projectTheme.primaryColor}]`
    : bgMap.primary;
    
  const secondaryColorClass = projectTheme?.secondaryColor
    ? `bg-[${projectTheme.secondaryColor}] text-white border-[${projectTheme.secondaryColor}]`
    : bgMap.secondary;

  return {
    bg: {
      ...bgMap,
      primary: primaryColorClass,
      secondary: secondaryColorClass,
      brand: custom['bg-brand'] || primaryColorClass,
      accent: custom['bg-accent'] || bgMap.secondary
    },
    align: alignMap,
    spacing: {
      ...spacingMap,
      ...Object.fromEntries(
        Object.entries(custom)
          .filter(([k]) => k.startsWith('spacing-'))
          .map(([k, v]) => [k.replace('spacing-', ''), v])
      )
    },
    containerPadding: containerPaddingMap,
    custom
  };
};

// ==========================================
// 3. Token Map Functions
// ==========================================

/**
 * Create callable token map for components
 * Usage: tokens.bg('primary') → Tailwind classes
 */
export const createTokenMap = (mergedTokens: MergedTokens): TokenMap => ({
  bg: (token: string) => mergedTokens.bg[token as ThemeToken] || mergedTokens.bg.light,
  align: (token: string) => mergedTokens.align[token as AlignToken] || mergedTokens.align.center,
  spacing: (token: string) => mergedTokens.spacing[token as SpacingToken] || mergedTokens.spacing.md,
  containerPadding: (token: string) => mergedTokens.containerPadding[token as SpacingToken] || mergedTokens.containerPadding.md,
  custom: (key: string) => mergedTokens.custom?.[key] || ''
});

// ==========================================
// 4. Utility Functions
// ==========================================

/**
 * Generate CSS custom properties from project theme
 * Inject into :root or component wrapper
 */
export const generateCSSVariables = (theme: ProjectTheme): Record<string, string> => ({
  '--primary-color': theme.primaryColor,
  '--secondary-color': theme.secondaryColor,
  '--font-family': theme.fontFamily
});

/**
 * Apply theme to document (for dark mode toggle)
 */
export const applyThemeToDocument = (isDark: boolean): void => {
  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};
