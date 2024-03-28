import {IError, IProjectListItem} from '../types';
import {useEffect, useMemo, useRef, useState} from 'react';

import {useApi, useAuthentication} from '../incoming';

interface IUseProjectSummaries {
  projects: IProjectListItem[];
  filter: IFilterParams;
  onFilterChange: (filter: IFilterParams) => void;
  order: IOrder;
  onOrderChange: (order: IOrder) => void;
  orderOptions: IOrderOption[];
  search: string;
  onSearchChange: (search: string) => void;
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
  {text: 'Most Recent', order: {created_at: 'desc'}},
  {text: 'Less Recent', order: {created_at: 'asc'}},
  {text: 'A-Z', order: {name: 'asc'}},
  {text: 'Z-A', order: {name: 'desc'}},
];

const defaultOrder: IOrder = {created_at: 'desc'};

interface IOrderOption {
  text: string;
  order: IOrder;
}

interface IOrder {
  [key: string]: 'asc' | 'desc';
}


const useProjectList = (): IUseProjectSummaries => {
  const isMounted = useRef(true);
  const [projects, setProjects] = useState<IProjectListItem[]>([]);
  const [filter, setFilter] = useState<IFilterParams>({});
  const [order, setOrder] = useState<IOrder>(defaultOrder);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {userProfile} = useAuthentication();
  const myUserId = userProfile?.sub || '';


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
      if (filter.status && !filter.status.includes(project.status)) {
        return false;
      }
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
      const key = Object.keys(order)[0];
      const direction = 'asc' === order[key] ? 1 : -1;


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

  }, [projects, filter, search, order, myUserId]);

  const {httpGet} = useApi();

  useEffect(() => {
    const fetch = async () => {
      if (!isMounted.current) {
        return;
      }
      setLoading(true);
      setError(null);
      const result = await httpGet<any>('/projects');

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
    filter: filter,
    onFilterChange: setFilter,
    order: order,
    onOrderChange: setOrder,
    orderOptions,
    search: '',
    onSearchChange: setSearch,
    loading,
    error,
  };
};

export default useProjectList;
