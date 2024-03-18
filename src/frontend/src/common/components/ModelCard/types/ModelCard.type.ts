export interface IProjectCard {
  projectId: string;
  name: string;
  description: string;
  image: string;
  owner_name: string;
  last_updated_at: string;
  status_color: 'green' | 'yellow' | 'red' | 'grey';
  onClick?: () => void;
  onCopyButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
}
