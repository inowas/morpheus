import React from 'react';
import {
  faBarsStaggered,
  faBorderAll,
  faChartLine,
  faChartSimple,
  faCircle,
  faClock,
  faCompress,
  faDatabase,
  faFlag,
  faFolder,
  faLayerGroup,
  faLocationCrosshairs,
  faMap,
  faPenToSquare,
  faSliders,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';

import LayersContainer from '../containers/LayersContainer';
import ProjectMetadataContainer from '../containers/ProjectMetadataContainer';
import SpatialDiscretizationContainer from '../containers/SpatialDiscretizationContainer';
import TimeDiscretizationContainer from '../containers/TimeDiscretizationContainer';
import ModelSetupContainer from '../containers/ModelSetupContainer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import BoundaryContainer from '../containers/BoundaryContainer';

export interface IMenuItem {
  icon: React.ReactNode;
  name: string;
  isTitle: boolean;
  slug: string;
  component?: React.ReactNode;
}

const sidebarItems: IMenuItem[] = [
  {
    name: 'Setup',
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
    component: <BoundaryContainer/>,
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
    icon: <FontAwesomeIcon icon={faDatabase}/>,
    name: 'Project Metadata',
    isTitle: false,
    slug: 'meta-data',
    component: <ProjectMetadataContainer/>,
  },
  // {
  //   icon: <FontAwesomeIcon icon={faInfo}/>,
  //   name: 'Testing',
  //   isTitle: false,
  //   slug: 'test',
  //   component: <TestingContainer/>,
  // },
  {
    icon: <FontAwesomeIcon icon={faSliders}/>,
    name: 'PACKAGES',
    isTitle: true,
    slug: 'packages',
  },
  {
    icon: <FontAwesomeIcon icon={faFolder}/>,
    name: 'MODFLOW packages',
    isTitle: false,
    slug: 'modflow-packages',
  },
  {
    icon: <FontAwesomeIcon icon={faCompress}/>,
    name: 'MT3DMS packages',
    isTitle: false,
    slug: 'mt3dms-packages',
  },
  {
    icon: <FontAwesomeIcon icon={faBarsStaggered}/>,
    name: 'SEAWAT packages',
    isTitle: false,
    slug: 'seawat-packages',
  },
  {
    icon: <FontAwesomeIcon icon={faSquareCheck}/>,
    name: 'RESULTS',
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

export {sidebarItems};
