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
  type: z.enum(["button", "submit", "reset"]).default("button"),
  fullWidth: z.boolean().default(false),
  centered: z.boolean().default(false),
  centerMode: z.enum(["viewport", "container"]).default("container"),
  align: z.enum(["left", "center", "right"]).default("left"),
  className: z.string().optional(),
  containerClassName: z.string().optional(),
  style: z.record(z.any(), z.any()).optional(),
  target: z.string().optional(),
  rel: z.string().optional(),
  ariaLabel: z.string().optional(),
  id: z.string().optional(),
  disabled: z.boolean().default(false),
  action: z.object({
    type: z.enum(["openModal", "closeModal", "toggleModal"]),
    targetId: z.string().min(1),
    preventDefault: z.boolean().default(true)
  }).optional(),
  api: z.object({
    type: z.string().min(1), // e.g. "login", "register", "custom-action"
    url: z.string().min(1),
    method: z.enum(["POST", "PUT", "PATCH", "GET"]).default("POST"),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.record(z.any(), z.any()).optional(),
    bodyType: z.enum(["json", "form"]).default("json"),
    credentials: z.enum(["omit", "same-origin", "include"]).default("same-origin"),
    tokenPath: z.string().optional(),
    tokenStorageKey: z.string().default("auth_token"),
    redirectTo: z.string().optional(),
    onSuccess: z.object({
      strategy: z.enum(["redirect", "reload", "none"]).default("redirect"),
      message: z.string().optional()
    }).optional(),
    onError: z.object({
      strategy: z.enum(["toast", "alert", "none"]).default("alert"),
      message: z.string().optional()
    }).optional()
  }).optional(),
  loadingText: z.string().optional(),
});

// Images
export const ImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
});

const ChatPositionSchema = z.enum(["bottom-right", "bottom-left"]);
const ChatStatusSchema = z.enum(["online", "away", "offline"]);
const ChatMessageSchema = z.object({
  sender: z.enum(["bot", "agent", "user"]),
  text: z.string().min(1)
});

// ==========================================
// 2. Component-Specific Schemas
// ==========================================

export const HeaderSchema = z.object({
  title: z.string().default("Site"),
  theme: ThemeSchema.default("light"),
  links: z.array(LinkSchema).optional(),
  button: ButtonSchema.optional(), // Optional CTA in Header
  sticky: z.boolean().default(true),
  topOffset: z.string().default("0px"),
  className: z.string().optional(),
  containerClassName: z.string().optional(),
  innerClassName: z.string().optional(),
  brandClassName: z.string().optional(),
  navClassName: z.string().optional(),
  linkClassName: z.string().optional(),
  mobileMenuButtonClassName: z.string().optional(),
  borderClassName: z.string().optional(),
  shadowClassName: z.string().optional(),
  style: z.record(z.any(), z.any()).optional(),
}).passthrough();

export const HeroSchema = z.object({
  title: z.string().default("Welcome"),
  subtitle: z.string().optional(),
  align: AlignSchema.default("center"),
  theme: ThemeSchema.default("light"),
  spacing: SpacingSchema.default("lg"),
  buttons: z.array(ButtonSchema).optional(), // Multiple buttons possible
  images: z.array(ImageSchema).optional(),
}).passthrough();

export const AboutSchema = z.object({
  title: z.string().optional(),
  description: z.string().default(""),
  align: AlignSchema.default("left"),
  theme: ThemeSchema.default("light"),
  images: z.array(ImageSchema).optional(),
  button: ButtonSchema.optional(),
}).passthrough();

export const FooterSchema = z.object({
  title: z.string().default("Site"),
  copyright: z.string().default("© All rights reserved"),
  theme: ThemeSchema.default("dark"),
  footerLinks: z.record(z.string(), z.string()).optional(),
  button: ButtonSchema.optional(),
  className: z.string().optional(),
  containerClassName: z.string().optional(),
  gridClassName: z.string().optional(),
  brandClassName: z.string().optional(),
  linksSectionClassName: z.string().optional(),
  linkClassName: z.string().optional(),
  borderClassName: z.string().optional(),
  shadowClassName: z.string().optional(),
  style: z.record(z.any(), z.any()).optional(),
}).passthrough();

export const PaginationSchema = z.object({
  theme: ThemeSchema.default("light"),
});

export const ChatbotSchema = z.object({
  title: z.string().default("Assistant"),
  welcomeMessage: z.string().default("Hi! How can I help you today?"),
  placeholder: z.string().default("Type your message..."),
  sendButtonText: z.string().default("Send"),
  launcherLabel: z.string().default("Chat"),
  position: ChatPositionSchema.default("bottom-right"),
  theme: ThemeSchema.default("primary"),
  defaultOpen: z.boolean().default(false),
  showTimestamp: z.boolean().default(false),
  quickReplies: z.array(z.string().min(1)).default([]),
  botReplies: z.array(z.string().min(1)).default([
    "Thanks for your message! Our team will follow up shortly."
  ]),
  initialMessages: z.array(ChatMessageSchema).default([]),
  className: z.string().optional(),
  panelClassName: z.string().optional(),
  launcherClassName: z.string().optional()
});

export const LivechatSchema = z.object({
  title: z.string().default("Live Support"),
  subtitle: z.string().default("Typically replies in a few minutes"),
  agentName: z.string().default("Support Team"),
  agentAvatarUrl: z.string().optional(),
  agentStatus: ChatStatusSchema.default("online"),
  welcomeMessage: z.string().default("Hi! A live agent is ready to help."),
  placeholder: z.string().default("Write a message..."),
  sendButtonText: z.string().default("Send"),
  launcherLabel: z.string().default("Live Chat"),
  position: ChatPositionSchema.default("bottom-right"),
  theme: ThemeSchema.default("secondary"),
  defaultOpen: z.boolean().default(false),
  showTimestamp: z.boolean().default(true),
  offlineMessage: z.string().default("We are currently offline. Leave a message and we will get back to you."),
  initialMessages: z.array(ChatMessageSchema).default([]),
  className: z.string().optional(),
  panelClassName: z.string().optional(),
  launcherClassName: z.string().optional()
});

/** Shared list-style item (services, rental, etc.) */
const LegacyListItemSchema = z
  .object({
    title: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    href: z.string().optional(),
    price: z.string().optional(),
    iconUrl: z.string().optional(),
    icon: z.string().optional(),
    imageUrl: z.string().optional(),
    image: ImageSchema.optional(),
  })
  .passthrough();

/** One row: object from CMS, plain title string, or JSON object string */
const ServiceListItemSchema = z.union([
  LegacyListItemSchema,
  z.string().transform((s) => {
    const t = s.trim();
    if (t.startsWith("{") && t.endsWith("}")) {
      try {
        const parsed = JSON.parse(t) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as z.infer<typeof LegacyListItemSchema>;
        }
      } catch {
        /* fall through */
      }
    }
    return { title: s };
  }),
]);

/** API / DB may send arrays, JSON strings, or pseudo-arrays { "0": … } */
function normalizeServicesItemsInput(val: unknown): unknown {
  if (val == null || val === "") return [];
  if (typeof val === "string") {
    const t = val.trim();
    if (t.startsWith("[")) {
      try {
        const parsed = JSON.parse(t) as unknown;
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  }
  if (Array.isArray(val)) return val;
  if (typeof val === "object" && val !== null) {
    const o = val as Record<string, unknown>;
    const keys = Object.keys(o)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b));
    if (keys.length > 0) return keys.map((k) => o[k]);
  }
  return val;
}

export const ServicesSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    items: z.preprocess(
      normalizeServicesItemsInput,
      z.array(ServiceListItemSchema).default([])
    ),
    align: AlignSchema.default("left"),
    theme: ThemeSchema.default("light"),
    spacing: SpacingSchema.default("md"),
  })
  .passthrough();

export const RentalSchema = ServicesSchema;

export const ContactSectionSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    hours: z.string().optional(),
    mapUrl: z.string().optional(),
    align: AlignSchema.default("left"),
    theme: ThemeSchema.default("light"),
  })
  .passthrough();

/** Plain text / WYSIWYG body — legacy may use `content`, `body`, or `text` */
export const TextSectionSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    body: z.string().optional(),
    text: z.string().optional(),
    align: AlignSchema.default("left"),
    theme: ThemeSchema.default("light"),
    spacing: SpacingSchema.default("md"),
  })
  .passthrough();

const NewsItemSchema = z
  .object({
    title: z.string().optional(),
    excerpt: z.string().optional(),
    summary: z.string().optional(),
    href: z.string().optional(),
    date: z.string().optional(),
    publishedAt: z.string().optional(),
    image: ImageSchema.optional(),
    imageUrl: z.string().optional(),
  })
  .passthrough();

export const NewsSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    items: z.array(NewsItemSchema).optional().default([]),
    align: AlignSchema.default("left"),
    theme: ThemeSchema.default("light"),
    spacing: SpacingSchema.default("md"),
  })
  .passthrough();

const JobItemSchema = z
  .object({
    title: z.string().optional(),
    department: z.string().optional(),
    location: z.string().optional(),
    employmentType: z.string().optional(),
    type: z.string().optional(),
    href: z.string().optional(),
    postedAt: z.string().optional(),
    date: z.string().optional(),
  })
  .passthrough();

export const JobsSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    items: z.array(JobItemSchema).optional().default([]),
    align: AlignSchema.default("left"),
    theme: ThemeSchema.default("light"),
    spacing: SpacingSchema.default("md"),
  })
  .passthrough();

const ContactFormFieldSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  label: z.string().optional(),
  type: z.enum(["text", "email", "password", "number", "tel", "url", "textarea"]).default("text"),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  defaultValue: z.any().optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  wrapperClassName: z.string().optional(),
  inputClassName: z.string().optional(),
  style: z.record(z.any(), z.any()).optional(),
});

export const ContactFormSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    submitButtonText: z.string().default("Send"),
    theme: ThemeSchema.default("light"),
    fields: z.array(ContactFormFieldSchema).default([]),
    api: z
      .object({
        type: z.string().min(1),
        url: z.string().min(1),
        method: z.enum(["POST", "PUT", "PATCH", "GET"]).default("POST"),
        headers: z.record(z.string(), z.string()).optional(),
        bodyType: z.enum(["json", "form"]).default("json"),
        credentials: z.enum(["omit", "same-origin", "include"]).default("same-origin"),
        staticBody: z.record(z.any(), z.any()).optional(),
        tokenPath: z.string().optional(),
        tokenStorageKey: z.string().default("auth_token"),
        redirectTo: z.string().optional(),
      })
      .optional(),
  })
  .passthrough();

export const ModalSchema = z.object({
  id: z.string().optional(),
  modalType: z.enum(["basic", "formModal"]).default("basic"),
  title: z.string().default("Modal Title"),
  content: z.string().default("Modal content"),
  openButtonText: z.string().default("Open Modal"),
  closeButtonText: z.string().default("Close"),
  confirmButtonText: z.string().optional(),
  confirmHref: z.string().optional(),
  theme: ThemeSchema.default("light"),
  size: z.enum(["sm", "md", "lg", "xl", "full"]).default("md"),
  centered: z.boolean().default(true),
  closable: z.boolean().default(true),
  closeOnBackdrop: z.boolean().default(true),
  defaultOpen: z.boolean().default(false),
  showTrigger: z.boolean().default(true),
  showFooter: z.boolean().default(true),
  className: z.string().optional(),
  overlayClassName: z.string().optional(),
  zIndex: z.number().int().min(1).max(9999).default(50),
  formLayoutClassName: z.string().default("grid grid-cols-1 gap-4"),
  formClassName: z.string().optional(),
  submitButtonText: z.string().default("Submit"),
  cancelButtonText: z.string().default("Cancel"),
  closeOnSuccess: z.boolean().default(true),
  fields: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    label: z.string().optional(),
    type: z.enum(["text", "email", "password", "number", "tel", "url", "textarea"]).default("text"),
    placeholder: z.string().optional(),
    required: z.boolean().default(false),
    defaultValue: z.any().optional(),
    options: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional(),
    wrapperClassName: z.string().optional(),
    inputClassName: z.string().optional(),
    style: z.record(z.any(), z.any()).optional()
  })).default([]),
  api: z.object({
    type: z.string().min(1), // e.g. login/register/custom
    url: z.string().min(1),
    method: z.enum(["POST", "PUT", "PATCH", "GET"]).default("POST"),
    headers: z.record(z.string(), z.string()).optional(),
    bodyType: z.enum(["json", "form"]).default("json"),
    credentials: z.enum(["omit", "same-origin", "include"]).default("same-origin"),
    staticBody: z.record(z.any(), z.any()).optional(),
    tokenPath: z.string().optional(),
    tokenStorageKey: z.string().default("auth_token"),
    redirectTo: z.string().optional()
  }).optional()
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
export type ChatbotProps = z.infer<typeof ChatbotSchema>;
export type LivechatProps = z.infer<typeof LivechatSchema>;
export type ModalProps = z.infer<typeof ModalSchema>;
export type ServicesProps = z.infer<typeof ServicesSchema>;
export type RentalProps = z.infer<typeof RentalSchema>;
export type ContactSectionProps = z.infer<typeof ContactSectionSchema>;
export type TextSectionProps = z.infer<typeof TextSectionSchema>;
export type NewsProps = z.infer<typeof NewsSchema>;
export type JobsProps = z.infer<typeof JobsSchema>;
export type ContactFormProps = z.infer<typeof ContactFormSchema>;

// ==========================================
// 4. Schema Map Registry
// ==========================================

export const ComponentSchemas: Record<string, z.ZodTypeAny> = {
  header: HeaderSchema,
  hero: HeroSchema,
  about: AboutSchema,
  footer: FooterSchema,
  pagination: PaginationSchema,
  chatbot: ChatbotSchema,
  livechat: LivechatSchema,
  modal: ModalSchema,
  services: ServicesSchema,
  features: ServicesSchema,
  promo: HeroSchema,
  clients: ServicesSchema,
  contact: ContactSectionSchema,
  text: TextSectionSchema,
  news: NewsSchema,
  rental: RentalSchema,
  jobs: JobsSchema,
  "contact-form": ContactFormSchema,
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
  columns: z.number().int().min(1).max(12).default(12),
  gap: SpacingSchema.default("md"),
  minChildWidth: z.number().int().min(100).max(1440).default(100),
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
  maxWidthPx: z.number().int().min(320).max(1440).default(1200),
  padding: SpacingSchema.default("lg"),
  theme: ThemeSchema.default("light"),
});

export const SectionSchema = z.object({
  width: z.enum(["full"]).default("full"),
  minHeight: z.number().int().min(80).max(2000).default(500),
  paddingY: z.number().int().min(0).max(200).default(80),
  backgroundColor: z.string().optional().default("#ffffff"),
  theme: ThemeSchema.default("light"),
});

// Add to registry
ComponentSchemas["twocolumn"] = TwoColumnSchema;
ComponentSchemas["grid"] = GridSchema;
ComponentSchemas["card"] = CardSchema;
ComponentSchemas["container"] = ContainerSchema;
ComponentSchemas["section"] = SectionSchema;

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
  tokens: z.record(z.string(), z.string()).optional(),
  customTokens: z.record(z.string(), z.string()).optional(),
});

export const WebsiteDesignSchema = z.object({
  projectName: z.string().min(1),
  domain: z.string().optional(),
  theme: ProjectThemeSchema,
  pages: z.array(z.object({
    route: z.string(),
    title: z.string().optional().default('Untitled'),
    description: z.string().optional(),
    components: z.array(ComponentNodeSchema).optional().default([])
  })).optional().default([]),
  updatedAt: z.string().optional().default(new Date().toISOString())
});

export const ComponentTypeRegistryItemSchema = z.object({
  type: z.string().min(1),
  category: z.enum(['primitive', 'layout', 'section']),
  description: z.string(),
  slots: z.array(z.string()).optional(),
  version: z.string().default('1.0.0'),
  capabilities: z.array(z.string()).default([]),
  requiredProps: z.array(z.string()).default([]),
  deprecations: z.array(z.string()).default([])
});

export const ApiEnvelopeSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    version: z.string().default('1.0.0'),
    data: dataSchema
  });

export const WebsiteDesignEnvelopeSchema = ApiEnvelopeSchema(WebsiteDesignSchema);
export const ComponentInstancesEnvelopeSchema = ApiEnvelopeSchema(z.array(ComponentInstanceSchema));
export const ComponentTypesEnvelopeSchema = ApiEnvelopeSchema(z.array(ComponentTypeRegistryItemSchema));

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

export const parseApiEnvelope = <T>(
  schema: z.ZodType<T>,
  raw: unknown
): T => {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`API schema validation failed: ${message}`);
  }
  return parsed.data;
};

// ==========================================
// 9. Type Inference for Layouts
// ==========================================

export type TwoColumnProps = z.infer<typeof TwoColumnSchema>;
export type GridProps = z.infer<typeof GridSchema>;
export type CardProps = z.infer<typeof CardSchema>;
export type ContainerProps = z.infer<typeof ContainerSchema>;
export type SectionProps = z.infer<typeof SectionSchema>;
export type ProjectThemeType = z.infer<typeof ProjectThemeSchema>;
