import React from 'react';
import {
  faBarsStaggered,
  faBorderAll,
  faChartLine,
  faChartSimple,
  faCircle,
  faClock,
  faCompress,
  faFlag,
  faFolder,
  faLayerGroup,
  faLocationCrosshairs,
  faMap,
  faPenToSquare,
  faSliders,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';

import BoundariesContainer from '../containers/BoundariesContainer';
import CalculationProfileContainer from '../containers/CalculationProfileContainer';
import LayersContainer from '../containers/LayersContainer';
import ModelSetupContainer from '../containers/ModelSetupContainer';
import SpatialDiscretizationContainer from '../containers/SpatialDiscretizationContainer';
import TimeDiscretizationContainer from '../containers/TimeDiscretizationContainer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export interface IMenuItem {
  icon: React.ReactNode;
  name: string;
  isTitle: boolean;
  slug: string;
  component?: React.ReactNode;
}

const getSidebarItems = (basePath: string, section: string): IMenuItem[] => {
  return [
    {
      name: 'Model',
      slug: 'setup',
      icon: <FontAwesomeIcon icon={faPenToSquare}/>,
      isTitle: true,
      component: <ModelSetupContainer/>,
    },
    {
      name: 'Grid properties',
      slug: 'spatial-discretization',
      icon: <FontAwesomeIcon icon={faBorderAll}/>,
      isTitle: false,
      component: <SpatialDiscretizationContainer/>,
    },
    {
      icon: <FontAwesomeIcon icon={faClock}/>,
      name: 'Stress periods',
      isTitle: false,
      slug: 'time-discretization',
      component: <TimeDiscretizationContainer/>,
    },
    {
      icon: <FontAwesomeIcon icon={faLayerGroup}/>,
      name: 'Model layers',
      isTitle: false,
      slug: 'layers',
      component: <LayersContainer/>,
    },
    {
      icon: <FontAwesomeIcon icon={faFlag}/>,
      name: 'Boundary conditions',
      isTitle: false,
      slug: 'boundary-conditions',
      component: <BoundariesContainer/>,
    },
    {
      icon: <FontAwesomeIcon icon={faLocationCrosshairs}/>,
      name: 'Head observations',
      isTitle: false,
      slug: 'head-observations',
    },
    {
      icon: <FontAwesomeIcon icon={faCompress}/>,
      name: 'Solute transport',
      isTitle: false,
      slug: 'solute-transport',
    },
    {
      icon: <FontAwesomeIcon icon={faBarsStaggered}/>,
      name: 'Variable density flow',
      isTitle: false,
      slug: 'variable-density-flow',
    },
    {
      icon: <FontAwesomeIcon icon={faSliders}/>,
      name: 'Calculation',
      isTitle: true,
      slug: 'calculation',
    },
    {
      icon: <FontAwesomeIcon icon={faFolder}/>,
      name: 'Calculation Profile',
      isTitle: false,
      slug: 'calculation-profiles',
      component: <CalculationProfileContainer/>,
    },
    {
      icon: <FontAwesomeIcon icon={faFolder}/>,
      name: 'Calculation',
      isTitle: false,
      slug: 'calculation',
    },
    {
      icon: <FontAwesomeIcon icon={faSquareCheck}/>,
      name: 'Results',
      isTitle: true,
      slug: 'results',
    },
    {
      icon: <FontAwesomeIcon icon={faMap}/>,
      name: 'Groundwater heads',
      isTitle: false,
      slug: 'groundwater-heads',
    },
    {
      icon: <FontAwesomeIcon icon={faChartSimple}/>,
      name: 'Budget',
      isTitle: false,
      slug: 'budget',
    },
    {
      icon: <FontAwesomeIcon icon={faCircle}/>,
      name: 'Concentration',
      isTitle: false,
      slug: 'concentration',
    },
    {
      icon: <FontAwesomeIcon icon={faChartLine}/>,
      name: 'Calibration statistics',
      isTitle: false,
      slug: 'calibration-statistics',
    },
    // {
    //   icon: <FontAwesomeIcon icon={faFolderOpen}/>,
    //   name: 'SCENARIOS',
    //   isTitle: true,
    //   slug: 'scenarios',
    // },
    // {
    //   icon: <FontAwesomeIcon icon={faCodeCompare}/>,
    //   name: 'Scenarios comparison',
    //   isTitle: false,
    //   slug: 'scenarios-comparison',
    // },
    // {
    //   icon: <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter}/>,
    //   name: 'Scenarios difference',
    //   isTitle: false,
    //   slug: 'scenarios-difference',
    // },
    // {
    //   icon: <FontAwesomeIcon icon={faTimeline}/>,
    //   name: 'Scenarios time series',
    //   isTitle: false,
    //   slug: 'scenarios-time-series',
    // },
    // {
    //   icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>,
    //   name: 'EXPORT',
    //   isTitle: true, slug: 'export',
    // },
    // {
    //   icon: <FontAwesomeIcon icon={faNoteSticky}/>,
    //   name: 'Export model (JSON)',
    //   isTitle: false,
    //   slug: 'export-model-json',
    // },
    // {
    //   icon: <FontAwesomeIcon icon={faImage}/>,
    //   name: 'Export model results',
    //   isTitle: false,
    //   slug: 'export-model-results',
    // },
    // {
    //   icon: <FontAwesomeIcon icon={faDownload}/>,
    //   name: 'Download MODFLOW files',
    //   isTitle: false,
    //   slug: 'download-modflow-files',
    // },
  ];
};

export {getSidebarItems};
