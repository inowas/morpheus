import {IMenuItem} from './types/SidebarMenu.type';

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
  faDownLeftAndUpRightToCenter,
  faDownload,
  faFlag,
  faFolder,
  faFolderOpen,
  faImage,
  faLayerGroup,
  faLocationCrosshairs,
  faMap,
  faNoteSticky,
  faPenToSquare,
  faSliders,
  faSquareCheck,
  faTimeline,
} from '@fortawesome/free-solid-svg-icons';

const menuItems: IMenuItem[] = [
  {icon: faPenToSquare, description: 'Setup', title: true, active: false},
  {icon: faBorderAll, description: 'Grid properties', active: true},
  {icon: faClock, description: 'Stress periods', active: false},
  {icon: faLayerGroup, description: 'Model layers', active: false},
  {icon: faFlag, description: 'Boundary conditions', active: false},
  {icon: faLocationCrosshairs, description: 'Head observations', active: false},
  {icon: faCompress, description: 'Solute transport', active: false},
  {icon: faBarsStaggered, description: 'Variable density flow', active: false},
  {icon: faSliders, description: 'PACKAGES', title: true, active: false},
  {icon: faFolder, description: 'MODFLOW packages', active: false},
  {icon: faCompress, description: 'MT3DMS packages', disabled: true, active: false},
  {icon: faBarsStaggered, description: 'SEAWAT packages', disabled: true, active: false},
  {icon: faSquareCheck, description: 'RESULTS', title: true, active: false},
  {icon: faMap, description: 'Groundwater heads', active: false},
  {icon: faChartSimple, description: 'Budget', active: false},
  {icon: faCircle, description: 'Concentration', disabled: true, active: false},
  {icon: faChartLine, description: 'Calibration statistics', active: false},
  {icon: faFolderOpen, description: 'SCENARIOS', title: true, active: false},
  {icon: faCodeCompare, description: 'Scenarios comparison', active: false},
  {icon: faDownLeftAndUpRightToCenter, description: 'Scenarios difference', active: false},
  {icon: faTimeline, description: 'Scenarios time series', active: false},
  {icon: faArrowUpRightFromSquare, description: 'EXPORT', title: true, active: false},
  {icon: faNoteSticky, description: 'Export model (JSON)', active: false},
  {icon: faImage, description: 'Export model results', active: false},
  {icon: faDownload, description: 'Download MODFLOW files', active: false},
];

export default menuItems;
