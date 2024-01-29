// eslint-disable-next-line import/no-extraneous-dependencies
import {createServer, Response} from 'miragejs';

import config from '../src/config';
import {generateRandomUsers, IUser} from './data/users';
import {generateRandomProjects} from './data/projects';
import {IProjectSummary} from 'morpheus/modflow/types/Project.type';

export function makeServer({environment = 'test'} = {}) {
  return createServer({
    environment,
    routes() {
      this.timing = 100;
      this.namespace = 'api/v1';
      this.get('users', (schema) => {
        return schema.db.users as IUser[];
      });
      this.get('users/:id', (schema, request) => {
        const id = request.params.id;
        const user = schema.db.users.findBy({user_id: id});
        if (!user) {
          return new Response(404, {}, {message: 'User not found'});
        }

        return new Response(200, {}, user);
      });
      this.get('modflow', (schema) => {
        const projectSummaries: IProjectSummary[] = schema.db.projects.map(
          (p) => {
            return {
              project_id: p.project_id,
              name: p.metadata.name,
              description: p.metadata.description,
              tags: p.metadata.tags,
              owner_id: p.permissions.owner_id,
              is_public: p.permissions.is_public,
              created_at: p.metadata.created_at,
            };
          });
        return projectSummaries;
      });

      // ignore all /locales requests
      this.namespace = '/locales';
      this.passthrough();
    },
    seeds(server) {
      const users = generateRandomUsers(10);
      server.db.loadData({
        users: users,
        projects: generateRandomProjects(100, users),
      });
    },
  });
}
