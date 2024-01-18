import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import Sidebar from '../Sidebar';
import {IMenuItem} from '../SidebarMenu';

import {
  faArrowUpRightFromSquare,
  faBarsStaggered,
  faBorderAll,
  faChartLine,
  faChartSimple,
  faCircle,
  faClock,
  faCompress,
  faDownload,
  faFlag,
  faFolder,
  faImage,
  faLayerGroup,
  faLocationCrosshairs,
  faMap,
  faNoteSticky,
  faPenToSquare,
  faSliders,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';

const menuItems: IMenuItem[] = [
  {icon: faPenToSquare, description: 'Setup', title: true, active: false},
  {icon: faBorderAll, description: 'Model grid', active: false},
  {icon: faClock, description: 'Stress periods', active: true},
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
  {icon: faArrowUpRightFromSquare, description: 'EXPORT', title: true, active: false},
  {icon: faNoteSticky, description: 'Export model (JSON)', active: false},
  {icon: faImage, description: 'Export model results', active: false},
  {icon: faDownload, description: 'Download MODFLOW files', active: false},
];

export default {
  title: 'Sidebar',
  component: Sidebar,
} as Meta<typeof Sidebar>;

export const SidebarExample: StoryFn<typeof Sidebar> = () => (
  <Sidebar
    headerHeight={0}
    open={true}
    maxWidth={700}
    contentFullWidth={false}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </Sidebar>
);

export const SidebarSmallSizeExample: StoryFn<typeof Sidebar> = () => (
  <Sidebar
    headerHeight={0}
    open={true}
    maxWidth={350}
    contentFullWidth={false}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </Sidebar>
);

export const SidebarWithSidebarMenuExample: StoryFn<typeof Sidebar> = () => (
  <Sidebar
    headerHeight={0}
    open={true}
    maxWidth={700}
    contentFullWidth={false}
    menuItems={menuItems}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </Sidebar>
);
