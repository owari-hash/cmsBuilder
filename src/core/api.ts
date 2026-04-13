import { WebsiteDesign, ComponentInstance, ComponentNode } from '../types';
import {
  ComponentSchemas
} from '../schemas';

class CMSApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:4000/api/v2';
  }

  private async parseEnvelope<T = any>(res: Response): Promise<T> {
    const raw = await res.json();
    if (raw && typeof raw === 'object' && 'version' in raw && 'data' in raw) {
      return (raw as any).data as T;
    }
    return raw as T;
  }

  private async handleError(res: Response, context: string): Promise<never> {
    const text = await res.text().catch(() => 'No error body');
    throw new Error(`${context}. Status: ${res.status}. Response: ${text}`);
  }

  private projectHeaders(projectName: string, headers?: Record<string, string>) {
    return {
      'x-project-id': projectName,
      ...headers
    };
  }

  private contentAdminHeaders(
    projectName: string,
    bearerToken: string,
    extra?: Record<string, string>
  ): Record<string, string> {
    return this.projectHeaders(projectName, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
      ...extra
    });
  }

  private contentAdminReadHeaders(
    projectName: string,
    bearerToken: string
  ): Record<string, string> {
    return this.projectHeaders(projectName, {
      Authorization: `Bearer ${bearerToken}`
    });
  }

  /** List component instances for editing (content-admin API). */
  async getContentAdminBlocks(
    projectName: string,
    bearerToken: string,
    pageRoute?: string
  ): Promise<ComponentInstance[]> {
    const q =
      pageRoute !== undefined && pageRoute !== ''
        ? `?pageRoute=${encodeURIComponent(pageRoute)}`
        : '';
    const res = await fetch(`${this.baseUrl}/content-admin/blocks${q}`, {
      cache: 'no-store',
      headers: this.contentAdminReadHeaders(projectName, bearerToken)
    });
    if (!res.ok) {
      return this.handleError(res, 'Content-admin blocks list failed');
    }
    const data = await this.parseEnvelope<any>(res);
    return (data.components || data || []) as ComponentInstance[];
  }

  /** Page component tree for editing (content-admin API). */
  async getContentAdminTree(
    projectName: string,
    pageRoute: string,
    bearerToken: string
  ): Promise<ComponentNode[]> {
    const encodedRoute = encodeURIComponent(pageRoute);
    const res = await fetch(
      `${this.baseUrl}/content-admin/blocks/tree?pageRoute=${encodedRoute}`,
      {
        cache: 'no-store',
        headers: this.contentAdminReadHeaders(projectName, bearerToken)
      }
    );
    if (!res.ok) {
      return this.handleError(res, `Content-admin tree failed for ${pageRoute}`);
    }
    const data = await this.parseEnvelope<any>(res);
    return (data.components || data || []) as ComponentNode[];
  }

  /**
   * Content-only updates (client-admin / editor). Merges whitelisted text fields into `props`.
   */
  async postContentAdminText(
    projectName: string,
    instanceId: string,
    fields: Record<string, string>,
    bearerToken: string
  ): Promise<ComponentInstance> {
    const res = await fetch(
      `${this.baseUrl}/content-admin/blocks/${encodeURIComponent(instanceId)}/text`,
      {
        method: 'POST',
        headers: this.contentAdminHeaders(projectName, bearerToken),
        body: JSON.stringify({ fields })
      }
    );
    if (!res.ok) {
      return this.handleError(res, `Content-admin text update failed for ${instanceId}`);
    }
    const parsed = await this.parseEnvelope<any>(res);
    return (parsed.component || parsed) as ComponentInstance;
  }

  /**
   * Set or append `props.images` from URLs (no file upload).
   */
  async postContentAdminImages(
    projectName: string,
    instanceId: string,
    payload: { images: Array<{ url: string; alt?: string }>; mode?: 'replace' | 'append' },
    bearerToken: string
  ): Promise<ComponentInstance> {
    const res = await fetch(
      `${this.baseUrl}/content-admin/blocks/${encodeURIComponent(instanceId)}/images`,
      {
        method: 'POST',
        headers: this.contentAdminHeaders(projectName, bearerToken),
        body: JSON.stringify({
          images: payload.images,
          mode: payload.mode === 'append' ? 'append' : 'replace'
        })
      }
    );
    if (!res.ok) {
      return this.handleError(res, `Content-admin images update failed for ${instanceId}`);
    }
    const parsed = await this.parseEnvelope<any>(res);
    return (parsed.component || parsed) as ComponentInstance;
  }

  /**
   * Media URLs (`kind: "image"` only for now); merges into `props.images`.
   */
  async postContentAdminMedia(
    projectName: string,
    instanceId: string,
    payload: {
      items: Array<{ kind: 'image'; url: string; alt?: string }>;
      mode?: 'replace' | 'append';
    },
    bearerToken: string
  ): Promise<ComponentInstance> {
    const res = await fetch(
      `${this.baseUrl}/content-admin/blocks/${encodeURIComponent(instanceId)}/media`,
      {
        method: 'POST',
        headers: this.contentAdminHeaders(projectName, bearerToken),
        body: JSON.stringify({
          items: payload.items,
          mode: payload.mode === 'replace' ? 'replace' : 'append'
        })
      }
    );
    if (!res.ok) {
      return this.handleError(res, `Content-admin media update failed for ${instanceId}`);
    }
    const parsed = await this.parseEnvelope<any>(res);
    return (parsed.component || parsed) as ComponentInstance;
  }

  async getSiteContent(projectName: string, options?: RequestInit): Promise<WebsiteDesign> {
    const res = await fetch(`${this.baseUrl}/core/designs/${projectName}`, {
      cache: options?.cache || 'default',
      ...({ next: (options as any)?.next || { revalidate: 3600 } } as any),
      ...options
    });

    if (!res.ok) {
      return this.handleError(res, `Failed to load project "${projectName}" design`);
    }

    const data = await this.parseEnvelope<any>(res);
    if (data && data.design) return data.design as WebsiteDesign;
    if (data && data.projectName) return data as WebsiteDesign;
    throw new Error(`Invalid design payload for "${projectName}"`);
  }

  // ==========================================
  // Hybrid Architecture - Component Instances
  // ==========================================

  private async fetchComponentsByRoute(projectName: string, pageRoute: string): Promise<ComponentInstance[]> {
    const encodedRoute = encodeURIComponent(pageRoute);
    const res = await fetch(`${this.baseUrl}/core/components?pageRoute=${encodedRoute}`, {
      cache: 'no-store',
      headers: this.projectHeaders(projectName)
    });

    if (!res.ok) {
      return this.handleError(res, `Failed to fetch components for ${pageRoute}`);
    }

    const data = await this.parseEnvelope<any>(res);
    return (data.components || data || []) as ComponentInstance[];
  }

  async getPageComponents(projectName: string, pageRoute: string): Promise<ComponentInstance[]> {
    const [routeComponents, rootComponents] = await Promise.all([
      this.fetchComponentsByRoute(projectName, pageRoute),
      pageRoute === '/' ? Promise.resolve([] as ComponentInstance[]) : this.fetchComponentsByRoute(projectName, '/')
    ]);

    const rootShell = rootComponents.filter((component) => {
      const type = String((component as any).componentType || '').toLowerCase();
      const isRoot = component.parentId === null || component.parentId === undefined;
      return isRoot && (type === 'header' || type === 'footer');
    });

    const routeRootTypes = new Set(
      routeComponents
        .filter((component) => component.parentId === null || component.parentId === undefined)
        .map((component) => String((component as any).componentType || '').toLowerCase())
    );

    // Fallback to "/" shell components only when the current route does not define its own.
    const fallbackShell = rootShell.filter((component) => {
      const type = String((component as any).componentType || '').toLowerCase();
      return !routeRootTypes.has(type);
    });

    const merged = [...routeComponents, ...fallbackShell].map((component) => ({ ...component }));
    const rootNodes = merged.filter((component) => component.parentId === null || component.parentId === undefined);
    const maxRootOrder = rootNodes.reduce((max, component) => Math.max(max, Number(component.order ?? 0)), 0);

    // Always pin header first and footer last across every route.
    merged.forEach((component) => {
      if (!(component.parentId === null || component.parentId === undefined)) return;
      const type = String((component as any).componentType || '').toLowerCase();
      if (type === 'header') component.order = -10000;
      if (type === 'footer') component.order = maxRootOrder + 10000;
    });

    return merged;
  }

  async getComponentTree(projectName: string, pageRoute: string): Promise<ComponentNode[]> {
    const encodedRoute = encodeURIComponent(pageRoute);
    const res = await fetch(`${this.baseUrl}/core/components/tree?pageRoute=${encodedRoute}`, {
      cache: 'no-store',
      headers: this.projectHeaders(projectName)
    });

    if (!res.ok) {
      return this.handleError(res, `Failed to fetch component tree for ${pageRoute}`);
    }

    const data = await this.parseEnvelope<any>(res);
    return (data.components || data || []) as ComponentNode[];
  }

  async createComponentInstance(
    projectName: string, 
    data: Omit<ComponentInstance, '_id' | 'instanceId' | 'updatedAt'>
  ): Promise<ComponentInstance> {
    const res = await fetch(`${this.baseUrl}/core/components`, {
      method: 'POST',
      headers: this.projectHeaders(projectName, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      return this.handleError(res, 'Failed to create component');
    }

    const parsed = await this.parseEnvelope<any>(res);
    return (parsed.component || parsed) as ComponentInstance;
  }

  async updateComponentInstance(
    projectName: string,
    instanceId: string,
    updates: Partial<ComponentInstance>
  ): Promise<ComponentInstance> {
    const res = await fetch(`${this.baseUrl}/core/components/${instanceId}`, {
      method: 'PATCH',
      headers: this.projectHeaders(projectName, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      return this.handleError(res, `Failed to update component ${instanceId}`);
    }

    const parsed = await this.parseEnvelope<any>(res);
    return (parsed.component || parsed) as ComponentInstance;
  }

  async deleteComponentInstance(projectName: string, instanceId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/core/components/${instanceId}`, {
      method: 'DELETE',
      headers: this.projectHeaders(projectName)
    });

    if (!res.ok) {
      return this.handleError(res, `Failed to delete component ${instanceId}`);
    }
  }

  async reorderComponents(
    projectName: string,
    componentOrders: { instanceId: string; order: number }[]
  ): Promise<{ success: boolean; updated: number }> {
    const res = await fetch(`${this.baseUrl}/core/components/reorder`, {
      method: 'POST',
      headers: this.projectHeaders(projectName, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ instances: componentOrders })
    });

    if (!res.ok) {
      return this.handleError(res, 'Failed to reorder components');
    }

    const parsed = await this.parseEnvelope<any>(res);
    return {
      success: Boolean(parsed.success),
      updated: componentOrders.length
    };
  }

  async getComponentTypes(): Promise<Array<{
    type: string;
    category: string;
    description: string;
    slots?: string[];
  }>> {
    return Object.keys(ComponentSchemas).map((key) => ({
      type: key,
      category: ['twocolumn', 'grid', 'card', 'container'].includes(key) ? 'layout' : 'section',
      description: `${key} component`,
      slots: []
    }));
  }
}

export const cmsApi = new CMSApiClient();
