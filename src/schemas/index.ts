import { z } from 'zod';

// ==========================================
// 1. Core Tokens & Shared Schemas
// ==========================================

export const ThemeSchema = z.enum(["light", "dark", "primary", "secondary"]);
export const AlignSchema = z.enum(["left", "center", "right"]);
export const SpacingSchema = z.enum(["none", "sm", "md", "lg", "xl"]);

// Links (e.g. for navigation)
export const LinkSchema = z.object({
  href: z.string(),
  label: z.string(),
  isExternal: z.boolean().optional(),
});

// Buttons
export const ButtonSchema = z.object({
  text: z.string(),
  href: z.string().optional(),
  variant: z.enum(["primary", "secondary", "outline", "ghost"]).default("primary"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
});

// Images
export const ImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
});

// ==========================================
// 2. Component-Specific Schemas
// ==========================================

export const HeaderSchema = z.object({
  title: z.string(),
  theme: ThemeSchema.default("light"),
  links: z.array(LinkSchema).optional(),
  button: ButtonSchema.optional(), // Optional CTA in Header
});

export const HeroSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  align: AlignSchema.default("center"),
  theme: ThemeSchema.default("light"),
  spacing: SpacingSchema.default("lg"),
  buttons: z.array(ButtonSchema).optional(), // Multiple buttons possible
  images: z.array(ImageSchema).optional(),
});

export const AboutSchema = z.object({
  title: z.string().optional(),
  description: z.string(),
  align: AlignSchema.default("left"),
  theme: ThemeSchema.default("light"),
  images: z.array(ImageSchema).optional(),
  button: ButtonSchema.optional(),
});

export const FooterSchema = z.object({
  title: z.string(),
  copyright: z.string(),
  theme: ThemeSchema.default("dark"),
  footerLinks: z.record(z.string(), z.string()).optional(),
  button: ButtonSchema.optional(),
});

export const PaginationSchema = z.object({
  theme: ThemeSchema.default("light"),
});

// ==========================================
// 3. Types Inference
// ==========================================

export type ThemeToken = z.infer<typeof ThemeSchema>;
export type AlignToken = z.infer<typeof AlignSchema>;
export type SpacingToken = z.infer<typeof SpacingSchema>;
export type ButtonToken = z.infer<typeof ButtonSchema>;

export type HeaderProps = z.infer<typeof HeaderSchema>;
export type HeroProps = z.infer<typeof HeroSchema>;
export type AboutProps = z.infer<typeof AboutSchema>;
export type FooterProps = z.infer<typeof FooterSchema>;
export type PaginationProps = z.infer<typeof PaginationSchema>;

// ==========================================
// 4. Schema Map Registry
// ==========================================

export const ComponentSchemas: Record<string, z.ZodTypeAny> = {
  header: HeaderSchema,
  hero: HeroSchema,
  about: AboutSchema,
  footer: FooterSchema,
  pagination: PaginationSchema,
};

// ==========================================
// 5. Layout Component Schemas (Phase 2)
// ==========================================

export const TwoColumnSchema = z.object({
  ratio: z.enum(["50/50", "60/40", "40/60", "70/30", "30/70"]).default("50/50"),
  gap: SpacingSchema.default("md"),
  verticalAlign: z.enum(["top", "center", "bottom"]).default("top"),
  theme: ThemeSchema.default("light"),
});

export const GridSchema = z.object({
  columns: z.number().int().min(1).max(12).default(3),
  gap: SpacingSchema.default("md"),
  theme: ThemeSchema.default("light"),
});

export const CardSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  border: z.boolean().default(true),
  shadow: z.enum(["none", "sm", "md", "lg"]).default("md"),
  padding: SpacingSchema.default("md"),
  theme: ThemeSchema.default("light"),
});

export const ContainerSchema = z.object({
  maxWidth: z.enum(["sm", "md", "lg", "xl", "full"]).default("xl"),
  padding: SpacingSchema.default("lg"),
  theme: ThemeSchema.default("light"),
});

// Add to registry
ComponentSchemas["twocolumn"] = TwoColumnSchema;
ComponentSchemas["grid"] = GridSchema;
ComponentSchemas["card"] = CardSchema;
ComponentSchemas["container"] = ContainerSchema;

// ==========================================
// 6. Component Instance Schemas (Hybrid Architecture)
// ==========================================

export const ComponentTypeSchema = z.string().min(1);

export const ComponentInstanceSchema = z.object({
  _id: z.string().optional(),
  instanceId: z.string().min(1),           // e.g., "hdr-001"
  projectName: z.string().min(1),
  pageRoute: z.string().min(1),            // e.g., "/about"
  componentType: ComponentTypeSchema,    // Must exist in ComponentRegistry
  parentId: z.string().nullable(),         // null = root, else parent's instanceId
  slot: z.string().nullable(),             // null for root, slot name for children
  order: z.number().int().min(0),        // Sort order
  props: z.record(z.any(), z.any()),                // Component-specific props
  updatedAt: z.string().datetime().or(z.string()),
});

// Slot definition for tree building (recursive type needs interface first)
export interface SlotNodeType {
  slot: string;
  components: ComponentNodeType[];
}

export interface ComponentNodeType extends z.infer<typeof ComponentInstanceSchema> {
  children: SlotNodeType[];
}

export const SlotNodeSchema: z.ZodType<SlotNodeType> = z.object({
  slot: z.string(),
  components: z.array(z.lazy(() => ComponentNodeSchema as any)),
});

// Component node with children (runtime tree structure)
export const ComponentNodeSchema: z.ZodType<ComponentNodeType> = ComponentInstanceSchema.extend({
  children: z.array(SlotNodeSchema).default([]),
});

// ==========================================
// 7. Project Theme Schema
// ==========================================

export const ProjectThemeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#3b82f6"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#1f2937"),
  fontFamily: z.string().default("Inter"),
  darkMode: z.boolean().default(false),
  customTokens: z.record(z.string(), z.string()).optional(),
});

// ==========================================
// 8. Validation Helpers
// ==========================================

export const validateComponentInstance = (data: unknown): {
  valid: boolean;
  errors: string[];
  data?: any;
} => {
  const result = ComponentInstanceSchema.safeParse(data);
  
  if (result.success) {
    return { valid: true, errors: [], data: result.data };
  }
  
  const errors = result.error.issues.map((issue: z.ZodIssue) => 
    `${issue.path.join('.')}: ${issue.message}`
  );
  
  return { valid: false, errors, data: undefined };
};

export const validateProps = (
  componentType: string, 
  props: unknown
): { valid: boolean; errors: string[]; data?: any } => {
  const schema = ComponentSchemas[componentType.toLowerCase()];
  
  if (!schema) {
    return { 
      valid: false, 
      errors: [`Unknown component type: ${componentType}`],
      data: undefined 
    };
  }
  
  const result = schema.safeParse(props);
  
  if (result.success) {
    return { valid: true, errors: [], data: result.data };
  }
  
  const errors = result.error.issues.map((issue: z.ZodIssue) => 
    `${issue.path.join('.')}: ${issue.message}`
  );
  
  return { valid: false, errors, data: undefined };
};

// ==========================================
// 9. Type Inference for Layouts
// ==========================================

export type TwoColumnProps = z.infer<typeof TwoColumnSchema>;
export type GridProps = z.infer<typeof GridSchema>;
export type CardProps = z.infer<typeof CardSchema>;
export type ContainerProps = z.infer<typeof ContainerSchema>;
export type ProjectTheme = z.infer<typeof ProjectThemeSchema>;
