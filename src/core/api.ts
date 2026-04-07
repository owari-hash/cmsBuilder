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

  async getPageComponents(projectName: string, pageRoute: string): Promise<ComponentInstance[]> {
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
