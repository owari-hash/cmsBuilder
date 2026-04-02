import { cmsApi } from './api';
import { WebsiteDesign, PageDesign } from '../types';

export class ContentService {
  private static instance: ContentService;
  private currentProject: string;

  private constructor() {
    this.currentProject = process.env.NEXT_PUBLIC_PROJECT_NAME || 'default';
  }

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  async getDesign(): Promise<WebsiteDesign> {
    return cmsApi.getSiteContent(this.currentProject);
  }

  async getPageByRoute(route: string): Promise<PageDesign | undefined> {
    const design = await this.getDesign();
    return design.pages.find((p) => p.route === route);
  }
}

export const cms = ContentService.getInstance();
