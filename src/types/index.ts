export interface ComponentInstance {
  type: string;
  props: Record<string, any>;
  order: number;
}

export interface PageDesign {
  route: string;
  title: string;
  description?: string;
  components: ComponentInstance[];
}

export interface WebsiteDesign {
  projectName: string;
  domain?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    darkMode: boolean;
  };
  pages: PageDesign[];
  updatedAt: string;
}
