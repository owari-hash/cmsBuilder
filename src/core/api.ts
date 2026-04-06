import { WebsiteDesign, ComponentInstance, ComponentNode } from '../types';
import {
  WebsiteDesignEnvelopeSchema,
  ComponentInstancesEnvelopeSchema,
  ComponentTypesEnvelopeSchema,
  parseApiEnvelope
} from '../schemas';

class CMSApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:4000/api';
  }

  async getSiteContent(projectName: string, options?: RequestInit): Promise<WebsiteDesign> {
    const res = await fetch(`${this.baseUrl}/sites/${projectName}/content`, {
      cache: options?.cache || 'default',
      ...({ next: (options as any)?.next || { revalidate: 3600 } } as any),
      ...options
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No error body');
      throw new Error(`Framework Fetch Error: Failed to load project "${projectName}". 
        URL: ${this.baseUrl}/sites/${projectName}/content 
        Status: ${res.status}
        Response: ${errorText}`);
    }

    const raw = await res.json();
    if (raw && typeof raw === 'object' && 'data' in raw && 'version' in raw) {
      const parsed = parseApiEnvelope(WebsiteDesignEnvelopeSchema, raw);
      return parsed.data;
    }
    const parsedLegacy = parseApiEnvelope(WebsiteDesignEnvelopeSchema, { version: 'legacy', data: raw });
    return parsedLegacy.data;
  }

  // ==========================================
  // Hybrid Architecture - Component Instances
  // ==========================================

  async getPageComponents(projectName: string, pageRoute: string): Promise<ComponentInstance[]> {
    const encodedRoute = encodeURIComponent(pageRoute);
    const res = await fetch(
      `${this.baseUrl}/components/instances/${projectName}/${encodedRoute}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch components for ${pageRoute}: ${res.status}`);
    }

    const raw = await res.json();
    if (raw && typeof raw === 'object' && 'data' in raw && 'version' in raw) {
      const parsed = parseApiEnvelope(ComponentInstancesEnvelopeSchema, raw);
      return parsed.data;
    }
    const parsedLegacy = parseApiEnvelope(ComponentInstancesEnvelopeSchema, { version: 'legacy', data: raw });
    return parsedLegacy.data;
  }

  async getComponentTree(projectName: string, pageRoute: string): Promise<ComponentNode[]> {
    const encodedRoute = encodeURIComponent(pageRoute);
    const res = await fetch(
      `${this.baseUrl}/components/tree/${projectName}/${encodedRoute}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch component tree for ${pageRoute}: ${res.status}`);
    }

    return res.json();
  }

  async createComponentInstance(
    projectName: string, 
    data: Omit<ComponentInstance, '_id' | 'instanceId' | 'updatedAt'>
  ): Promise<ComponentInstance> {
    const res = await fetch(
      `${this.baseUrl}/components/instances/${projectName}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to create component: ${error}`);
    }

    return res.json();
  }

  async updateComponentInstance(
    projectName: string,
    instanceId: string,
    updates: Partial<ComponentInstance>
  ): Promise<ComponentInstance> {
    const res = await fetch(
      `${this.baseUrl}/components/instances/${projectName}/${instanceId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update component ${instanceId}: ${res.status}`);
    }

    return res.json();
  }

  async deleteComponentInstance(projectName: string, instanceId: string): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/components/instances/${projectName}/${instanceId}`,
      { method: 'DELETE' }
    );

    if (!res.ok) {
      throw new Error(`Failed to delete component ${instanceId}: ${res.status}`);
    }
  }

  async reorderComponents(
    projectName: string,
    componentOrders: { instanceId: string; order: number }[]
  ): Promise<{ success: boolean; updated: number }> {
    const res = await fetch(
      `${this.baseUrl}/components/reorder/${projectName}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentOrders })
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to reorder components: ${res.status}`);
    }

    return res.json();
  }

  async getComponentTypes(): Promise<Array<{
    type: string;
    category: string;
    description: string;
    slots?: string[];
  }>> {
    const res = await fetch(`${this.baseUrl}/components/types/registry`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch component types: ${res.status}`);
    }

    const raw = await res.json();
    if (raw && typeof raw === 'object' && 'data' in raw && 'version' in raw) {
      const parsed = parseApiEnvelope(ComponentTypesEnvelopeSchema, raw);
      return parsed.data;
    }
    const parsedLegacy = parseApiEnvelope(ComponentTypesEnvelopeSchema, { version: 'legacy', data: raw });
    return parsedLegacy.data;
  }
}

export const cmsApi = new CMSApiClient();
