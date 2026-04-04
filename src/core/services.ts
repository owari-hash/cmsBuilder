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

  async getDesign(options?: RequestInit): Promise<WebsiteDesign> {
    return cmsApi.getSiteContent(this.currentProject, options);
  }

  async getAllRoutes(): Promise<{ slug: string[] }[]> {
    const design = await this.getDesign();
    return design.pages.map((p) => ({
      slug: p.route === '/' ? [] : p.route.split('/').filter(Boolean),
    }));
  }

  async getPageByRoute(route: string): Promise<PageDesign | undefined> {
    const design = await this.getDesign();
    return design.pages.find((p) => p.route === route);
  }

  async getStaticProps(slug?: string[]): Promise<{ design: WebsiteDesign; page: PageDesign | undefined; route: string }> {
    const route = slug ? '/' + slug.join('/') : '/';
    const design = await this.getDesign();
    const page = design.pages.find((p) => p.route === route);
    return { design, page, route };
  }
}

export const cms = ContentService.getInstance();
