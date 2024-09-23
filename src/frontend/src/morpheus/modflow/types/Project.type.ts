import {IUserPrivilege} from './Privileges.type';

interface IProjectListItem {
  project_id: string;
  name: string;
  description: string;
  image?: string;
  tags: string[];
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_privileges: IUserPrivilege[];
}

interface IMetadata {
  name: string;
  description: string;
  tags: string[];
}

export type {IProjectListItem, IMetadata};
