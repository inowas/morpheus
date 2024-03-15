// eslint-disable-next-line import/no-extraneous-dependencies
import {createServer, Response} from 'miragejs';

import config from '../src/config';
import {generateRandomUsers, IUser} from './data/users';
import {generateRandomProjects} from './data/projects';
import {IProjectSummary} from 'morpheus/modflow/types/Project.type';
import {getProjectMetadata} from './data/projectMetadata';

export function makeServer({environment = 'test'} = {}) {
  return createServer({
    environment,
    routes() {
      this.timing = 100;
      this.namespace = 'api/v1';

      this.get('projects', (schema) => {
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

        return new Response(200, {}, projectSummaries);
      });

      this.get('projects/:id/metadata', (schema, request) => {
        const id = request.params.id;
        const metadata = getProjectMetadata(id);
        return new Response(200, {}, metadata);
      });

      this.get('users', (schema) => {
        return schema.db.users as IUser[];
      });
      this.post('users', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const user = schema.db.users.findBy({email: attrs.email});
        if (user) {
          return new Response(400, {}, {message: 'User already exists'});
        }

        const newUser = schema.db.users.insert(attrs);
        return new Response(201, {
          'location': `${config.baseApiUrl}/users/${newUser.user_id}`,
        }, newUser);
      });
      this.get('users/:id', (schema, request) => {
        const id = request.params.id;
        const user = schema.db.users.findBy({user_id: id});
        if (!user) {
          return new Response(404, {}, {message: 'User not found'});
        }

        return new Response(200, {}, user);
      });
      this.put('users/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const user = schema.db.users.findBy({user_id: id});
        if (!user) {
          return new Response(404, {}, {message: 'User not found'});
        }

        const updatedUser = schema.db.users.update(id, attrs);
        return new Response(200, {}, updatedUser);
      });
      this.delete('users/:id', (schema, request) => {
        const id = request.params.id;
        const user = schema.db.users.findBy({user_id: id});
        if (!user) {
          return new Response(404, {}, {message: 'User not found'});
        }

        schema.db.users.remove(id);
        return new Response(204, {}, {});
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

      // ignore all /auth requests
      this.passthrough('https://identity.inowas.com/*');

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
