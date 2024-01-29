interface IProjectSummary {
  project_id: string;
  name: string;
  description: string;
  tags: string[];
  owner_id: string;
  is_public: boolean;
  created_at: string;
}

export type {IProjectSummary};
