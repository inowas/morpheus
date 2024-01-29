import {v4} from 'uuid';
import {IUser} from './users';

interface IProject {
  project_id: string;
  metadata: IMetadata;
  permissions: IPermissions;
  baseModel: object;
  calculationProfile: object;
  scenarios: object[];
}

interface IMetadata {
  name: string;
  description: string;
  tags: string[];
  created_at: string;
}

interface IPermissions {
  owner_id: string;
  groups: IPermission[];
  users: IPermission[];
  is_public: boolean;
}

interface IPermission {
  id: string;
  role: IRole;
}

type IRole = 'admin' | 'editor' | 'viewer';

export type {IProject};

const getRandomElement = (arr: any[]) =>
  arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;

const generateRandomProject = (counter: number, user: IUser): IProject => {
  const numberOfDaysToSubstract = Math.random() * 365;
  const createdAt = new Date(new Date().getTime() - (numberOfDaysToSubstract * 24 * 60 * 60 * 1000));

  return {
    project_id: v4().toString(),
    metadata: {
      name: 'Project Name ' + counter.toFixed(0),
      description: 'Project Description ' + counter.toFixed(0),
      tags: ['tag1', 'tag2'],
      created_at: createdAt.toISOString(),
    },
    permissions: {
      owner_id: user.user_id,
      groups: [],
      users: [],
      is_public: 0.5 < Math.random(),
    },
    baseModel: {},
    calculationProfile: {},
    scenarios: [],
  };
};

const generateRandomProjects = (count: number, users: IUser[]): IProject[] => {
  const projects: IProject[] = [];
  for (let i = 0; i < count; i++) {
    projects.push(generateRandomProject(count, getRandomElement(users) as IUser));
  }
  return projects;
};


export {generateRandomProjects};
