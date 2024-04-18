import ProjectsFilter from './ProjectsFilter';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React, {useState} from 'react';
import {IFilterOptions} from 'morpheus/modflow/application/useProjectList';

const filterOptions: IFilterOptions = {
  number_of_my_projects: 10,
  number_of_my_group_projects: 12,
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

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Modflow/ProjectsFilter',
  component: ProjectsFilter,
} as Meta<typeof ProjectsFilter>;

export const FormFilterExample: StoryFn<typeof ProjectsFilter> = () => {
  const [filter, setFilter] = useState({});


  return (
    <div style={{paddingLeft: '1rem', backgroundColor: '#eeeeee'}}>
      <ProjectsFilter
        filterParams={filter}
        filterOptions={filterOptions}
        onChangeFilterParams={setFilter}
      />
    </div>
  );
};


