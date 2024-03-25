// eslint-disable-next-line import/no-extraneous-dependencies
import {createServer, Response} from 'miragejs';
import {v4 as uuidv4} from 'uuid';

import config from '../src/config';
import {generateRandomUsers, IUser} from './data/users';
import {generateRandomProjects, IProject} from './data/projects';
import {IProjectListItem} from 'morpheus/modflow/types/Project.type';
import {getProjectMetadata} from './data/projectMetadata';

export function makeServer({environment = 'test'} = {}) {
  return createServer({
    environment,
    routes() {
      this.timing = 100;
      this.namespace = 'api/v1';

      this.get('projects', (schema) => {
        const projectSummaries: IProjectListItem[] = schema.db.projects.map(
          (p) => {
            return {
              project_id: p.project_id,
              name: p.metadata.name,
              description: p.metadata.description,
              tags: p.metadata.tags,
              owner_id: p.permissions.owner_id,
              is_public: p.permissions.is_public,
              created_at: p.metadata.created_at,
              status: 'green',
              image: p.metadata.image,
            };
          });

        return new Response(200, {}, projectSummaries);
      });

      this.post('projects', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const newProject = generateRandomProjects(1, schema.db.users)[0];
        newProject.project_id = uuidv4();
        newProject.metadata = {
          ...newProject.metadata,
          name: attrs.name,
          description: attrs.description,
          tags: attrs.tags,
        };

        schema.db.projects.insert({...newProject});

        return new Response(201, {
          'location': `${config.baseApiUrl}/projects/${newProject.project_id}`,
        });
      });

      this.get('projects/:id/metadata', (schema, request) => {
        const id = request.params.id;
        const metadata = getProjectMetadata(id);
        return new Response(200, {}, metadata);
      });

      this.get('projects/:projectId/model/spatial-discretization', (schema, request) => {
        const projectId = request.params.projectId;
        const project = schema.db.projects.findBy({project_id: projectId}) as IProject | undefined;
        if (!project) {
          return new Response(404, {}, {message: 'Project not found'});
        }

        return new Response(200, {}, project.model.spatial_discretization);
      });

      this.put('projects/:projectId/model/spatial-discretization', (schema, request) => {
        const projectId = request.params.projectId;
        const project = schema.db.projects.findBy({project_id: projectId}) as IProject | undefined;
        if (!project) {
          return new Response(404, {}, {message: 'Project not found'});
        }

        const spatialDiscretization = JSON.parse(request.requestBody);
        console.log(spatialDiscretization);
        schema.db.projects.update({project_id: projectId, model: {...project.model, spatial_discretization: spatialDiscretization}});
        return new Response(204);
      });


      this.get('projects/:projectId/model/time-discretization', (schema, request) => {
        const projectId = request.params.projectId;
        const project = schema.db.projects.findBy({project_id: projectId}) as IProject | undefined;
        if (!project) {
          return new Response(404, {}, {message: 'Project not found'});
        }

        return new Response(200, {}, project.model.time_discretization);
      });

      this.put('projects/:projectId/model/time-discretization', (schema, request) => {
        const projectId = request.params.projectId;
        const project = schema.db.projects.findBy({project_id: projectId}) as IProject | undefined;
        if (!project) {
          return new Response(404, {}, {message: 'Project not found'});
        }

        const timeDiscretization = JSON.parse(request.requestBody);
        schema.db.projects.update({project_id: projectId, model: {...project.model, time_discretization: timeDiscretization}});
        return new Response(204);
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

      // ignore all /auth requests
      this.passthrough('https://identity.inowas.com/*');

      // ignore all /fonts requests
      this.namespace = '/fonts';
      this.passthrough();

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
