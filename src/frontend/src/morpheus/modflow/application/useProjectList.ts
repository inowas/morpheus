import {IError, IProjectListItem, IUserPrivilege} from '../types';
import {useEffect, useMemo, useRef, useState} from 'react';

import {useApi, useAuthentication} from '../incoming';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';

interface IUseProjectList {
  projects: IProjectListItem[];
  filterOptions: IFilterOptions;
  filter: IFilterParams;
  onFilterChange: (filter: IFilterParams) => void;
  order: IOrderOption;
  onOrderChange: (order: IOrderOption) => void;
  orderOptions: IOrderOption[];
  search: string;
  onSearchChange: (search: string) => void;
  onDeleteClick: (projectId: string) => void;
  loading: boolean;
  error: IError | null;
}

export interface IFilterParams {
  my_projects?: boolean;
  my_groups?: boolean;
  users?: string[];
  is_public?: boolean;
  status?: string[];
  date_range?: {
    timestamp?: string;
    start?: string;
    end?: string;
  };
  number_of_grid_cells?: number;
  number_of_stress_periods?: number;
  number_of_layers?: number;
  boundary_conditions?: string[];
  additional_features?: string[];
  tags?: string[];
  geolocation?: {
    type: 'Rectangle';
    coordinates: number[];
  };
}

export interface IFilterOptions {
  number_of_my_projects: number;
  number_of_my_group_projects: number;
  users: IUserSummary[];
  by_status: {
    green: number;
    yellow: number;
    red: number;
  },
  by_date: {
    created_at: {
      start_date: string
      end_date: string
    },
    updated_at: {
      start_date: string
      end_date: string
    },
    model_date: {
      start_date: string
      end_date: string
    }
  },
  boundary_conditions: {
    CHD: number,
    FHB: number,
    WEL: number,
    RCH: number,
    RIV: number,
    GHB: number,
    EVT: number,
    DRN: number,
    NB: number,
  }
  additional_features: {
    soluteTransportMT3DMS: number,
    dualDensityFlowSEAWAT: number,
    realTimeSensors: number,
    modelsWithScenarios: number,
  },
  number_of_grid_cells: {
    min: number,
    max: number,
    step: number,
  }
  number_of_stress_periods: {
    min: number,
    max: number,
    step: number,
  }
  number_of_layers: {
    min: number,
    max: number,
    step: number,
  }
  tags: ITags;
}

export interface IUserSummary {
  user_id: string;
  unsername: string;
  count?: number
}

export interface ITags {
  [tagName: string]: number;
}


const orderOptions: IOrderOption[] = [
  {text: 'Most Recent', order: {created_at: 'desc'}, value: 'created_at_desc'},
  {text: 'Less Recent', order: {created_at: 'asc'}, value: 'created_at_asc'},
  {text: 'A-Z', order: {name: 'asc'}, value: 'name_asc'},
  {text: 'Z-A', order: {name: 'desc'}, value: 'name_desc'},
];

interface IOrderOption {
  text: string;
  value: string;
  order: IOrder;
}

interface IOrder {
  [key: string]: 'asc' | 'desc';
}

type IProjectSummaryGetResponse = {
  project_id: string
  created_at: string
  description: string
  is_public: boolean
  name: string
  owner_id: string
  tags: string[]
  updated_at: string
  user_privileges: IUserPrivilege[]
}[];

const useProjectList = (): IUseProjectList => {
  const isMounted = useRef(true);
  const [projects, setProjects] = useState<IProjectListItem[]>([]);
  const [filter, setFilter] = useState<IFilterParams>({});
  const [orderOption, setOrderOption] = useState<IOrderOption>(orderOptions[0]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {sendCommand} = useProjectCommandBus();

  const {userProfile} = useAuthentication();
  const myUserId = userProfile?.sub || '';

  const filterOptions: IFilterOptions = useMemo(() => {
    return {
      number_of_my_projects: projects.filter((project) => project.owner_id === myUserId).length,
      number_of_my_group_projects: projects.filter((project) => project.owner_id !== myUserId).length,
      users: [{
        user_id: 'Dmytro',
        unsername: 'Dmytro',
        count: 10,
      },
      {
        user_id: 'Ralf',
        unsername: 'Ralf',
        count: 2,
      }],
      by_status: {
        green: 100,
        yellow: 100,
        red: 100,
      },
      by_date: {
        created_at: {
          start_date: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString(),
          end_date: new Date().toISOString(),
        },
        updated_at: {
          start_date: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString(),
          end_date: new Date().toISOString(),
        },
        model_date: {
          start_date: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString(),
          end_date: new Date().toISOString(),
        },
      },
      boundary_conditions: {
        CHD: 10,
        FHB: 11,
        WEL: 12,
        RCH: 13,
        RIV: 14,
        GHB: 15,
        EVT: 12,
        DRN: 12,
        NB: 0,
      },
      additional_features: {
        soluteTransportMT3DMS: 12,
        dualDensityFlowSEAWAT: 1,
        realTimeSensors: 13,
        modelsWithScenarios: 1,
      },
      number_of_grid_cells: {
        min: 0,
        max: 240000,
        step: 100,
      },
      number_of_stress_periods: {
        min: 0,
        max: 50,
        step: 1,
      },
      number_of_layers: {
        min: 110,
        max: 300,
        step: 10,
      },
      tags: {
        groundwater: 46,
        recharge: 12,
      },
    };
  }, [myUserId, projects]);


  const filteredProjects = useMemo(() => {

    let newListOfProjects: IProjectListItem[] = projects.filter((project) => {

      if (filter.my_projects && project.owner_id !== myUserId) {
        return false;
      }

      if (filter.users && !filter.users.includes(project.owner_id)) {
        return false;
      }

      if (filter.is_public && !project.is_public) {
        return false;
      }
      // if (filter.status && !filter.status.includes(project.status)) {
      //   return false;
      // }
      if (filter.date_range) {
        const projectDate = new Date(project.created_at);
        const startDate = filter.date_range.start && new Date(filter.date_range.start);
        const endDate = filter.date_range.end && new Date(filter.date_range.end);

        if (!startDate && !endDate) {
          return false;
        }

        if (startDate && projectDate < startDate) {
          return false;
        }

        if (endDate && projectDate > endDate) {
          return false;
        }
      }

      if (filter.tags && !filter.tags.every((keyword) => project.tags.includes(keyword))) {
        return false;
      }

      return true;
    });

    if (0 < search.length) {
      newListOfProjects = newListOfProjects.filter((project) => {
        return project.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    newListOfProjects.sort((a, b) => {

      const key = Object.keys(orderOption.order)[0];
      const direction = 'asc' === orderOption.order[key] ? 1 : -1;


      // @ts-ignore
      const valueA = a[key] as keyof IProjectListItem;
      // @ts-ignore
      const valueB = b[key] as keyof IProjectListItem;

      if (valueA < valueB) {
        return -1 * direction;
      }
      if (valueA > valueB) {
        return 1 * direction;
      }
      return 0;
    });

    return newListOfProjects;

  }, [projects, filter, search, orderOption, myUserId]);

  const onDeleteClick = async (projectId: string): Promise<void> => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const deleteProjectCommand: Commands.IDeleteProjectCommand = {
      command_name: 'delete_project_command',
      payload: {
        project_id: projectId,
      },
    };

    const response = await sendCommand(deleteProjectCommand);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.err) {
      setError(response.val);
      return;
    }

    setProjects(projects.filter((project) => project.project_id !== projectId));
  };

  const {httpGet} = useApi();

  useEffect(() => {
    const fetch = async () => {
      if (!isMounted.current) {
        return;
      }
      setLoading(true);
      setError(null);
      const result = await httpGet<IProjectSummaryGetResponse>('/projects');

      if (!isMounted.current) {
        return;
      }

      if (result.ok) {
        setProjects(result.val);
      }

      if (result.err) {
        setError({
          message: result.val.message,
          code: result.val.code,
        });
      }

      setLoading(false);
    };

    fetch();

    return (): void => {
      isMounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    projects: filteredProjects,
    filterOptions,
    filter: filter,
    onFilterChange: setFilter,
    order: orderOption,
    onOrderChange: setOrderOption,
    orderOptions,
    search: '',
    onSearchChange: setSearch,
    onDeleteClick,
    loading,
    error,
  };
};

export default useProjectList;
