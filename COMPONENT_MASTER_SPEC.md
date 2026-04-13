# Component Master Spec (Exhaustive)

This file is the full frontend-agent contract for component-driven CMS rendering in `@cms-builder/core`.

It is derived from:
- `src/schemas/index.ts`
- `src/engine/ComponentRegistry.ts`
- `src/engine/RecursiveRenderer.tsx`
- `src/engine/Tokens.ts`
- `src/types/index.ts`
- `src/components/*.tsx`
- `src/components/layouts/*.tsx`

Use this as the authoritative source for:
- form generation
- payload construction
- validation
- slot nesting
- rendering behavior
- failure fallback rules

---

## 1) Registry: All Supported Component Types

## 1.1 Section components
- `header`
- `hero`
- `about`
- `footer`
- `pagination`

## 1.2 Primitive components
- `button`
- `modal`

## 1.3 Layout components (slot containers)
- `twocolumn`
- `grid`
- `card`
- `container`

---

## 2) Registry Metadata (for Builder UI)

Each component type has:
- `category`: `primitive` | `layout` | `section`
- `acceptsChildren`: boolean
- `slots`: string[] (only layouts)
- `description`: text
- `version`: currently `1.0.0`
- `capabilities`: tags
- `requiredProps`: required semantic keys
- `deprecations`: list

### 2.1 Metadata map
- `header`: section, no children, capabilities `navigation`, `branding`, required `title`
- `hero`: section, no children, capabilities `marketing`, `cta`, required `title`
- `about`: section, no children, capabilities `content`, required none
- `footer`: section, no children, capabilities `navigation`, `legal`, required `copyright`
- `pagination`: section, no children, capabilities `navigation`
- `button`: primitive, no children, capabilities `interaction`
- `modal`: primitive, no children, capabilities `interaction`, `overlay`, `dialog`
- `twocolumn`: layout, children yes, slots `left`, `right`
- `grid`: layout, children yes, slots `items`
- `card`: layout, children yes, slots `header`, `content`, `footer`
- `container`: layout, children yes, slots `default`

---

## 3) Shared Token Contracts

## 3.1 Theme token enum
- `light`
- `dark`
- `primary`
- `secondary`

## 3.2 Align token enum
- `left`
- `center`
- `right`

## 3.3 Spacing token enum
- `none`
- `sm`
- `md`
- `lg`
- `xl`

## 3.4 Base token maps (class outputs)

### `bgMap`
- `light` -> `bg-white text-gray-900 border-gray-200`
- `dark` -> `bg-gray-900 text-white border-gray-800`
- `primary` -> `bg-blue-600 text-white border-blue-700`
- `secondary` -> `bg-gray-100 text-gray-800 border-gray-300`

### `alignMap`
- `left` -> `text-left items-start`
- `center` -> `text-center items-center`
- `right` -> `text-right items-end`

### `spacingMap`
- `none` -> `py-0`
- `sm` -> `py-8`
- `md` -> `py-16`
- `lg` -> `py-24`
- `xl` -> `py-32`

### `containerPaddingMap`
- `none` -> `px-0`
- `sm` -> `px-4`
- `md` -> `px-8`
- `lg` -> `px-12`
- `xl` -> `px-16`

## 3.5 Project theme merge behavior

From `mergeProjectTokens(projectTheme)`:
- overrides `primary` and `secondary` using `projectTheme.primaryColor` and `projectTheme.secondaryColor`
- supports custom token keys
  - `bg-brand`
  - `bg-accent`
  - `spacing-*` custom entries

## 3.6 CSS variable generation

From `generateCSSVariables(theme)`:
- `--primary-color`
- `--secondary-color`
- `--font-family`

---

## 4) Shared Sub-Schemas

## 4.1 Link
```ts
{
  href: string;
  label: string;
  isExternal?: boolean;
}
```

## 4.2 Image
```ts
{
  url: string;
  alt?: string;
}
```

## 4.3 Button (global reusable schema)
```ts
{
  text: string;
  href?: string;
  variant: "primary"|"secondary"|"outline"|"ghost" = "primary";
  size: "sm"|"md"|"lg" = "md";
  type: "button"|"submit"|"reset" = "button";
  fullWidth: boolean = false;
  centered: boolean = false;
  centerMode: "viewport"|"container" = "container";
  align: "left"|"center"|"right" = "left";
  className?: string;
  containerClassName?: string;
  style?: Record<any, any>;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  id?: string;
  disabled: boolean = false;
  action?: {
    type: "openModal"|"closeModal"|"toggleModal";
    targetId: string;
    preventDefault: boolean = true;
  };
  api?: {
    type: string;
    url: string;
    method: "POST"|"PUT"|"PATCH"|"GET" = "POST";
    headers?: Record<string,string>;
    body?: Record<any,any>;
    bodyType: "json"|"form" = "json";
    credentials: "omit"|"same-origin"|"include" = "same-origin";
    tokenPath?: string;
    tokenStorageKey: string = "auth_token";
    redirectTo?: string;
    onSuccess?: {
      strategy: "redirect"|"reload"|"none" = "redirect";
      message?: string;
    };
    onError?: {
      strategy: "toast"|"alert"|"none" = "alert";
      message?: string;
    };
  };
  loadingText?: string;
}
```

---

## 5) Component Prop Contracts (All Props)

## 5.1 Header props
```ts
{
  title: string;                           // required
  theme: Theme = "light";
  links?: Link[];
  button?: Button;
  sticky: boolean = true;
  topOffset: string = "0px";
  className?: string;
  containerClassName?: string;
  innerClassName?: string;
  brandClassName?: string;
  navClassName?: string;
  linkClassName?: string;
  mobileMenuButtonClassName?: string;
  borderClassName?: string;
  shadowClassName?: string;
  style?: Record<any,any>;
}
```

Rendered behavior:
- sticky header when `sticky=true` with `top` style from `topOffset`
- nav links rendered from `links[]`
- mobile menu button placeholder always shown on small screens

## 5.2 Hero props
```ts
{
  title: string;                           // required
  subtitle?: string;
  align: Align = "center";
  theme: Theme = "light";
  spacing: Spacing = "lg";
  buttons?: Button[];
  images?: Image[];
}
```

Rendered behavior:
- uses `bgMap`, `alignMap`, `spacingMap`
- image cards are rendered if `images.length > 0`

## 5.3 About props
```ts
{
  title?: string;
  description: string;                     // required
  align: Align = "left";
  theme: Theme = "light";
  images?: Image[];
  button?: Button;
}
```

Important:
- schema includes optional `button`, but current component render does not output button yet.

## 5.4 Footer props
```ts
{
  title: string;                           // required
  copyright: string;                       // required
  theme: Theme = "dark";
  footerLinks?: Record<string,string>;
  button?: Button;
  className?: string;
  containerClassName?: string;
  gridClassName?: string;
  brandClassName?: string;
  linksSectionClassName?: string;
  linkClassName?: string;
  borderClassName?: string;
  shadowClassName?: string;
  style?: Record<any,any>;
}
```

Important:
- `footerLinks` are rendered as `Object.entries`, key used in `href` as `/${key}`, value shown as label.

## 5.5 Pagination props
```ts
{
  theme: Theme = "light";
}
```

Runtime extras expected from parent/context:
- `pages: Array<{route:string,title:string}>`
- `currentRoute: string`

If these aren’t provided, pagination can render with empty nav.

## 5.6 Modal props
```ts
{
  id?: string;
  modalType: "basic"|"formModal" = "basic";
  title: string = "Modal Title";
  content: string = "Modal content";
  openButtonText: string = "Open Modal";
  closeButtonText: string = "Close";
  confirmButtonText?: string;
  confirmHref?: string;
  theme: Theme = "light";
  size: "sm"|"md"|"lg"|"xl"|"full" = "md";
  centered: boolean = true;
  closable: boolean = true;
  closeOnBackdrop: boolean = true;
  defaultOpen: boolean = false;
  showTrigger: boolean = true;
  showFooter: boolean = true;
  className?: string;
  overlayClassName?: string;
  zIndex: number(1..9999) = 50;
  formLayoutClassName: string = "grid grid-cols-1 gap-4";
  formClassName?: string;
  submitButtonText: string = "Submit";
  cancelButtonText: string = "Cancel";
  closeOnSuccess: boolean = true;
  fields: Array<{
    id?: string;
    name: string;
    label?: string;
    type: "text"|"email"|"password"|"number"|"tel"|"url"|"textarea" = "text";
    placeholder?: string;
    required: boolean = false;
    defaultValue?: any;
    options?: Array<{label:string,value:string}>;
    wrapperClassName?: string;
    inputClassName?: string;
    style?: Record<any,any>;
  }> = [];
  api?: {
    type: string;
    url: string;
    method: "POST"|"PUT"|"PATCH"|"GET" = "POST";
    headers?: Record<string,string>;
    bodyType: "json"|"form" = "json";
    credentials: "omit"|"same-origin"|"include" = "same-origin";
    staticBody?: Record<any,any>;
    tokenPath?: string;
    tokenStorageKey: string = "auth_token";
    redirectTo?: string;
  };
}
```

Modal runtime behaviors:
- listens for `window` custom event `cms:modal`
- event detail shape:
  - `{ type: "openModal"|"closeModal"|"toggleModal", targetId: string }`
- reacts only when `props.id === targetId`

## 5.7 TwoColumn layout props
```ts
{
  ratio: "50/50"|"60/40"|"40/60"|"70/30"|"30/70" = "50/50";
  gap: "none"|"sm"|"md"|"lg"|"xl" = "md";
  verticalAlign: "top"|"center"|"bottom" = "top";
  theme: Theme = "light";
  slots?: {
    left?: ReactNode;
    right?: ReactNode;
  };
}
```

## 5.8 Grid layout props
```ts
{
  columns: number(1..12) = 3;
  gap: "none"|"sm"|"md"|"lg"|"xl" = "md";
  theme: Theme = "light";
  minItemWidth?: string;
  slots?: {
    items?: ReactNode;
  };
}
```

## 5.9 Card layout props
```ts
{
  title?: string;
  subtitle?: string;
  border: boolean = true;
  shadow: "none"|"sm"|"md"|"lg" = "md";
  padding: "none"|"sm"|"md"|"lg" = "md";
  theme: Theme = "light";
  slots?: {
    header?: ReactNode;
    content?: ReactNode;
    footer?: ReactNode;
  };
}
```

## 5.10 Container layout props
```ts
{
  maxWidth: "sm"|"md"|"lg"|"xl"|"full" = "xl";
  padding: "none"|"sm"|"md"|"lg"|"xl" = "lg";
  theme: Theme = "light";
  slots?: {
    default?: ReactNode;
  };
}
```

---

## 6) Component Instance Storage Contract (CMS API/DB)

```ts
{
  _id?: string;
  instanceId: string;               // unique in project
  projectName: string;
  pageRoute: string;
  componentType: string;            // normalized lowercase
  parentId: string | null;
  slot: string | null;
  order: number;                    // non-negative int
  props: Record<string, any>;
  updatedAt: string;
}
```

Validation requirements:
- `componentType` non-empty string
- `pageRoute` non-empty
- `order >= 0`

---

## 7) Tree/Nesting Rules

From `buildComponentTree(instances)`:

1. Create map by `instanceId`
2. Root nodes:
   - `parentId === null` or `undefined`
3. Child nodes:
   - append to parent’s slot bucket (`slot || "default"`)
4. Sort:
   - root by `order`
   - each slot’s children by `order`

From `flattenComponentTree(nodes)`:
- preserves `parentId`, `slot`, and `order`

Safety:
- recursive render max depth is 10 (`RecursiveRenderer`)

---

## 8) Rendering and Failure Behavior

## 8.1 Unknown component type
- `UnknownComponent` rendered
- does not crash page

## 8.2 Schema validation failure in component
- component shows red error block with parsed zod issues

## 8.3 Missing design in CMSPage
- shows configuration error message

## 8.4 Empty page components
- shows “Empty Page” placeholder

---

## 9) Frontend Agent Rules (Must Follow)

1. Normalize `componentType` to lowercase before schema lookup.
2. Validate `props` with matching schema before save.
3. Preserve unknown keys in `props` to avoid data loss.
4. Do not send `_id` and other server-managed fields on create.
5. For layouts, enforce valid slot names:
   - `twocolumn`: `left`, `right`
   - `grid`: `items`
   - `card`: `header`, `content`, `footer`
   - `container`: `default`
6. Reorder payload should only contain:
   - `[{ instanceId, order }]`
7. If type is unknown, show JSON fallback editor instead of blocking user.
8. Add optimistic UI but always re-fetch on successful save to avoid order drift.

---

## 10) Industry Module Hints (Registry)

These are feature presets, not hard restrictions:

- `service`:
  - feature flags: `leadCapture`, `appointments`
  - components: `header`, `hero`, `about`, `footer`, `button`
- `ecommerce`:
  - feature flags: `catalog`, `cart`, `checkout`
  - components: `header`, `grid`, `card`, `pagination`, `footer`, `button`
- `booking`:
  - feature flags: `scheduling`, `availability`
  - components: `header`, `hero`, `container`, `footer`, `button`
- `blog`:
  - feature flags: `articles`, `authors`, `taxonomy`
  - components: `header`, `about`, `pagination`, `footer`

---

## 11) API Envelope Contract (for component endpoints)

Expected envelope:
```json
{
  "version": "2.0.0",
  "data": {
    "success": true,
    "...": "payload"
  }
}
```

Common payload keys:
- list: `components`
- single: `component`
- reorder: `success`

---

## 12) High-Fidelity Payload Templates

## 12.1 Hero template
```json
{
  "componentType": "hero",
  "pageRoute": "/",
  "order": 0,
  "props": {
    "title": "Welcome to Project",
    "subtitle": "Production ready CMS",
    "align": "center",
    "theme": "primary",
    "spacing": "xl",
    "buttons": [
      {
        "text": "Get Started",
        "href": "/contact",
        "variant": "primary",
        "size": "lg",
        "centered": false
      }
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1557804506-669a67965ba0",
        "alt": "Hero image"
      }
    ]
  }
}
```

## 12.2 Modal form template
```json
{
  "componentType": "modal",
  "pageRoute": "/booking",
  "order": 2,
  "props": {
    "id": "bookingModal",
    "modalType": "formModal",
    "title": "Book consultation",
    "content": "Please submit your details.",
    "openButtonText": "Open booking form",
    "submitButtonText": "Submit",
    "cancelButtonText": "Cancel",
    "size": "md",
    "theme": "light",
    "fields": [
      { "name": "fullName", "label": "Full name", "type": "text", "required": true },
      { "name": "email", "label": "Email", "type": "email", "required": true },
      { "name": "message", "label": "Message", "type": "textarea", "required": true }
    ],
    "api": {
      "type": "lead-submit",
      "url": "https://httpbin.org/post",
      "method": "POST",
      "bodyType": "json",
      "credentials": "same-origin"
    }
  }
}
```

## 12.3 Layout nesting template
Parent:
```json
{
  "componentType": "twocolumn",
  "pageRoute": "/about",
  "order": 1,
  "props": {
    "ratio": "60/40",
    "gap": "lg",
    "verticalAlign": "top",
    "theme": "light"
  }
}
```

Child in `left`:
```json
{
  "componentType": "about",
  "pageRoute": "/about",
  "parentId": "twocolumn-main",
  "slot": "left",
  "order": 0,
  "props": {
    "title": "About us",
    "description": "Left slot content",
    "align": "left",
    "theme": "light"
  }
}
```

---

## 13) Do-Not-Miss Checklist for Frontend Agent

- [ ] Use lowercase `componentType`
- [ ] Validate every `props` payload with Zod schema
- [ ] Preserve unknown props on edit
- [ ] Enforce slot validity for layout children
- [ ] Handle unknown types with JSON fallback
- [ ] Always sort by `order` in UI preview mode
- [ ] Respect envelope parsing (`version`, `data`)
- [ ] Render safety: unknown component and invalid schema must not crash page

