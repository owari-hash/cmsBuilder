import { WebsiteDesign } from '../types';

class CMSApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:4000/api';
  }

  async getSiteContent(projectName: string): Promise<WebsiteDesign> {
    const res = await fetch(`${this.baseUrl}/sites/${projectName}/content`, {
      cache: 'no-store', // Always fetch fresh design in dev/preview
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch content for project: ${projectName}`);
    }

    return res.json();
  }
}

export const cmsApi = new CMSApiClient();
