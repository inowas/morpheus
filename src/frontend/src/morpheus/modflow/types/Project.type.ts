interface IProjectListItem {
  project_id: string;
  name: string;
  description: string;
  image?: string;
  tags: string[];
  owner_id: string;
  is_public: boolean;
  created_at: string;
  status: 'green' | 'yellow' | 'red' | 'grey';
}

export type {IProjectListItem};
