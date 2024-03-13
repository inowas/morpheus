import React from 'react';
import {
  faArrowUpRightFromSquare,
  faBarsStaggered,
  faBorderAll,
  faChartLine,
  faChartSimple,
  faCircle,
  faClock,
  faCodeCompare,
  faCompress,
  faDatabase,
  faDownLeftAndUpRightToCenter,
  faDownload,
  faFlag,
  faFolder,
  faFolderOpen,
  faImage,
  faInfo,
  faLayerGroup,
  faLocationCrosshairs,
  faMap,
  faNoteSticky,
  faPenToSquare,
  faSliders,
  faSquareCheck,
  faTimeline,
} from '@fortawesome/free-solid-svg-icons';

import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

import LayersContainer from '../containers/LayersContainer';
import ProjectMetadataContainer from '../containers/ProjectMetadataContainer';
import SpatialDiscretizationContainer from '../containers/SpatialDiscretizationContainer';
import TestingContainer from '../containers/TestingContainer';
import TimeDiscretizationContainer from '../containers/TimeDiscretizationContainer';

export interface IMenuItem {
  icon: IconDefinition;
  description: string;
  slug: string;
  title?: boolean;
  active: boolean;
  disabled?: boolean;
  component?: React.ReactNode;
}

const sidebarItems: IMenuItem[] = [
  {icon: faPenToSquare, description: 'Setup', title: true, active: false, slug: 'setup'},
  {icon: faBorderAll, description: 'Grid properties', active: true, slug: 'spatial-discretization', component: <SpatialDiscretizationContainer/>},
  {icon: faClock, description: 'Stress periods', active: false, slug: 'time-discretization', component: <TimeDiscretizationContainer/>},
  {icon: faLayerGroup, description: 'Model layers', active: false, slug: 'layers', component: <LayersContainer/>},
  {icon: faFlag, description: 'Boundary conditions', active: false, slug: 'boundary-conditions'},
  {icon: faLocationCrosshairs, description: 'Head observations', active: false, slug: 'head-observations'},
  {icon: faCompress, description: 'Solute transport', active: false, slug: 'solute-transport'},
  {icon: faBarsStaggered, description: 'Variable density flow', active: false, slug: 'variable-density-flow'},
  {icon: faDatabase, description: 'Project Metadata', active: false, slug: 'meta-data', component: <ProjectMetadataContainer/>},
  {icon: faInfo, description: 'Testing', active: false, slug: 'test', component: <TestingContainer/>},
  {icon: faSliders, description: 'PACKAGES', title: true, active: false, slug: 'packages'},
  {icon: faFolder, description: 'MODFLOW packages', active: false, slug: 'modflow-packages'},
  {icon: faCompress, description: 'MT3DMS packages', disabled: true, active: false, slug: 'mt3dms-packages'},
  {icon: faBarsStaggered, description: 'SEAWAT packages', disabled: true, active: false, slug: 'seawat-packages'},
  {icon: faSquareCheck, description: 'RESULTS', title: true, active: false, slug: 'results'},
  {icon: faMap, description: 'Groundwater heads', active: false, slug: 'groundwater-heads'},
  {icon: faChartSimple, description: 'Budget', active: false, slug: 'budget'},
  {icon: faCircle, description: 'Concentration', disabled: true, active: false, slug: 'concentration'},
  {icon: faChartLine, description: 'Calibration statistics', active: false, slug: 'calibration-statistics'},
  {icon: faFolderOpen, description: 'SCENARIOS', title: true, active: false, slug: 'scenarios'},
  {icon: faCodeCompare, description: 'Scenarios comparison', active: false, slug: 'scenarios-comparison'},
  {icon: faDownLeftAndUpRightToCenter, description: 'Scenarios difference', active: false, slug: 'scenarios-difference'},
  {icon: faTimeline, description: 'Scenarios time series', active: false, slug: 'scenarios-time-series'},
  {icon: faArrowUpRightFromSquare, description: 'EXPORT', title: true, active: false, slug: 'export'},
  {icon: faNoteSticky, description: 'Export model (JSON)', active: false, slug: 'export-model-json'},
  {icon: faImage, description: 'Export model results', active: false, slug: 'export-model-results'},
  {icon: faDownload, description: 'Download MODFLOW files', active: false, slug: 'download-modflow-files'},
];

export {sidebarItems};
