export interface IT06 {
  condition: {
    name: string;
    category: string;
    selected: boolean;
    applicable_methods: string[];
  }[];
  method: {
    slug: string;
    name: string;
    description: string;
    highCost: boolean;
    highLandNeed: boolean;
    image: string;
    href: string;
  }[];
}
