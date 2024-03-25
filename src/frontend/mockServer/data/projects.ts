import {v4} from 'uuid';
import {IUser} from './users';
import fixedUuids from './fixedUuids';
import {ITimeDiscretization, ITimeUnit} from 'morpheus/modflow/types/TimeDiscretization.type';
import {ILengthUnit, ISpatialDiscretization} from '../../src/morpheus/modflow/types';

interface IProject {
  project_id: string;
  metadata: IMetadata;
  permissions: IPermissions;
  model: {
    model_id: string;
    spatial_discretization: ISpatialDiscretization;
    time_discretization: ITimeDiscretization;
  };
  calculation_profile: object;
  scenarios: object[];
}

interface IMetadata {
  name: string;
  description: string;
  image?: string;
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
    project_id: fixedUuids[counter],
    metadata: {
      name: 'Project Name ' + counter.toFixed(0),
      description: 'Project Description ' + counter.toFixed(0),
      tags: ['tag1', 'tag2'],
      created_at: createdAt.toISOString(),
      image: 0.5 < Math.random() ? 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg' : undefined,
    },
    permissions: {
      owner_id: user.user_id,
      groups: [],
      users: [],
      is_public: 0.5 < Math.random(),
    },
    model: {
      model_id: v4().toString(),
      spatial_discretization: {
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [
                13.737521,
                51.05702,
              ],
              [
                13.723092,
                51.048919,
              ],
              [
                13.736491,
                51.037358,
              ],
              [
                13.751779,
                51.04773,
              ],
              [
                13.737521,
                51.05702,
              ],
            ],
          ],
        },
        grid: {
          n_col: 10,
          n_row: 10,
          col_widths: new Array(10).fill(10),
          total_width: 1000,
          row_heights: new Array(10).fill(10),
          total_height: 1000,
          origin: {
            type: 'Point',
            coordinates: [13.737521, 51.05702],
          },
          rotation: 0,
          length_unit: ILengthUnit.METERS,
        },
      },
      time_discretization: {
        start_date_time: new Date('2010-01-01').toISOString(),
        end_date_time: new Date('2015-12-31').toISOString(),
        time_unit: ITimeUnit.DAYS,
        stress_periods: [{
          start_date_time: new Date('2010-01-01').toISOString(),
          number_of_time_steps: 1,
          time_step_multiplier: 1,
          steady_state: true,
        }],
      },
    },
    calculation_profile:
        {}
    ,
    scenarios: [],
  };
}
;

const generateRandomProjects = (count: number, users: IUser[]): IProject[] => {
  const projects: IProject[] = [];
  for (let i = 0; i < count; i++) {
    projects.push(generateRandomProject(i, getRandomElement(users) as IUser));
  }
  return projects;
};


export {generateRandomProjects};
