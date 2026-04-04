import { WebsiteDesign } from '../types';

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

    return res.json();
  }
}

export const cmsApi = new CMSApiClient();
