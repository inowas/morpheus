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

export type {IProjectListItem};
