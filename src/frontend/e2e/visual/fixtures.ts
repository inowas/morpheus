import {getHandler, IApiHandler, notFound} from './api-mock';

export const PROJECT_ID = 'c0ffee00-0000-4000-8000-000000000001';

export const USER_ID = '11111111-1111-1111-1111-111111111111';

const user = {
  user_id: USER_ID,
  is_admin: false,
  email: 'demo@inowas.com',
  username: 'demo',
  first_name: 'Demo',
  last_name: 'User',
  keycloak_user_id: USER_ID,
  geo_node_user_id: null,
};

const users = [
  {user_id: USER_ID, username: 'demo', first_name: 'Demo', last_name: 'User'},
  {user_id: '22222222-2222-2222-2222-222222222222', username: 'alice', first_name: 'Alice', last_name: 'Example'},
];

const projects = [
  {
    project_id: PROJECT_ID,
    name: 'Sandy Aquifer',
    description: 'Deterministic project for the visual regression suite',
    tags: ['demo', 'benchmark'],
    owner_id: USER_ID,
    is_public: false,
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-02-01T12:00:00.000Z',
    user_privileges: ['view_project', 'edit_project', 'manage_project', 'full_access'],
  },
  {
    project_id: 'c0ffee00-0000-4000-8000-000000000002',
    name: 'Coastal Delta',
    description: 'A read-only shared project',
    tags: ['coastal'],
    owner_id: '22222222-2222-2222-2222-222222222222',
    is_public: false,
    created_at: '2024-03-10T09:30:00.000Z',
    updated_at: '2024-03-11T09:30:00.000Z',
    user_privileges: ['view_project'],
  },
];

const EDITABLE_PRIVILEGES = ['view_project', 'edit_project', 'manage_project', 'full_access'];
const READ_ONLY_PRIVILEGES = ['view_project'];

export interface IProjectFixturesOptions {
  readOnly: boolean;
}

export const userFixtures: IApiHandler[] = [
  getHandler('/users', users),
  getHandler('/users/me', user),
];

export const projectsListFixture: IApiHandler = getHandler('/projects', projects);

export function projectFixtures({readOnly}: IProjectFixturesOptions): IApiHandler[] {
  return [
    userFixtures[0],
    userFixtures[1],
    {
      test: (url, method) => 'GET' === method && url.pathname === `/projects/${PROJECT_ID}/privileges`,
      respond: () => ({json: readOnly ? READ_ONLY_PRIVILEGES : EDITABLE_PRIVILEGES}),
    },
    getHandler(`/projects/${PROJECT_ID}/metadata`, {
      name: 'Sandy Aquifer',
      description: 'Deterministic project used by the visual regression suite',
      tags: ['demo', 'benchmark'],
    }),
    notFound(`/projects/${PROJECT_ID}/model`),
    getHandler(`/projects/${PROJECT_ID}/assets`, {assets: []}),
  ];
}

const GROUPS = [
  {group_id: '33333333-3333-3333-3333-333333333333', group_name: 'Hydro Team', members: [USER_ID], admins: [USER_ID]},
  {group_id: '44444444-4444-4444-4444-444444444444', group_name: 'External Viewers', members: [], admins: []},
];

export function settingsFixtures({readOnly}: IProjectFixturesOptions): IApiHandler[] {
  return [
    ...userFixtures,
    {
      test: (url, method) => 'GET' === method && url.pathname === `/projects/${PROJECT_ID}/privileges`,
      respond: () => ({json: readOnly ? READ_ONLY_PRIVILEGES : EDITABLE_PRIVILEGES}),
    },
    getHandler(`/projects/${PROJECT_ID}/metadata`, {
      name: 'Sandy Aquifer',
      description: 'Deterministic project used by the visual regression suite',
      tags: ['demo', 'benchmark'],
    }),
    getHandler('/users/groups', GROUPS),
    getHandler(`/projects/${PROJECT_ID}/permissions`, {
      owner_id: '22222222-2222-2222-2222-222222222222',
      groups: readOnly ? {} : {'33333333-3333-3333-3333-333333333333': 'editor'},
      members: {},
      visibility: 'private',
    }),
  ];
}
