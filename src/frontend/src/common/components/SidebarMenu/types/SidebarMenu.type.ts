export interface ISidebarMenuItem {
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  isDisabled?: boolean;
  isTitle: boolean;
  slug: string;
  onClick?: () => void;
  component?: React.ReactNode;
}
