import { cmsApi } from './api';
import { WebsiteDesign, PageDesign, IndustryModule } from '../types';
import { getAvailableIndustryModules, getIndustryModule } from '../engine/ComponentRegistry';

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
    const pages = Array.isArray(design.pages) ? design.pages : [];
    return pages.map((p) => ({
      slug: p.route === '/' ? [] : p.route.split('/').filter(Boolean),
    }));
  }

  async getPageByRoute(route: string): Promise<PageDesign | undefined> {
    const design = await this.getDesign();
    const pages = Array.isArray(design.pages) ? design.pages : [];
    return pages.find((p) => p.route === route);
  }

  async getStaticProps(slug?: string[]): Promise<{ design: WebsiteDesign; page: PageDesign | undefined; route: string }> {
    const route = slug ? '/' + slug.join('/') : '/';
    const design = await this.getDesign();
    const pages = Array.isArray(design.pages) ? design.pages : [];
    const page = pages.find((p) => p.route === route);
    return { design, page, route };
  }

  getIndustryModules(): IndustryModule[] {
    return getAvailableIndustryModules();
  }

  getIndustryFeatureFlags(moduleId: string): string[] {
    return getIndustryModule(moduleId)?.featureFlags || [];
  }
}

export const cms = ContentService.getInstance();
