// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import React from 'react';
import SidebarMenu from './SidebarMenu';
import {ISidebarMenuItem} from './types/SidebarMenu.type';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as fa from '@fortawesome/free-solid-svg-icons';

export default {
  title: 'SidebarMenu',
  component: SidebarMenu,
} as Meta<typeof SidebarMenu>;


const menuItems: ISidebarMenuItem[] = [
  {icon: <FontAwesomeIcon icon={fa.faPenToSquare}/>, name: 'Setup', isTitle: false, isActive: false, slug: 'setup'},
  {icon: <FontAwesomeIcon icon={fa.faBorderAll}/>, name: 'Grid properties', isTitle: false, isActive: true, slug: 'grid-properties'},
  {icon: <FontAwesomeIcon icon={fa.faClock}/>, name: 'Stress periods', isTitle: false, isActive: false, slug: 'stress-periods'},
  {icon: <FontAwesomeIcon icon={fa.faLayerGroup}/>, name: 'Model layers', isTitle: false, isActive: false, slug: 'model-layers'},
  {icon: <FontAwesomeIcon icon={fa.faFlag}/>, name: 'Boundary conditions', isTitle: false, isActive: false, slug: 'boundary-conditions'},
  {icon: <FontAwesomeIcon icon={fa.faLocationCrosshairs}/>, name: 'Head observations', isTitle: false, isActive: false, slug: 'head-observations'},
  {icon: <FontAwesomeIcon icon={fa.faCompress}/>, name: 'Solute transport', isTitle: false, isActive: false, slug: 'solute-transport'},
  {icon: <FontAwesomeIcon icon={fa.faBarsStaggered}/>, name: 'Variable density flow', isTitle: false, isActive: false, slug: 'variable-density-flow'},
  {icon: <FontAwesomeIcon icon={fa.faDatabase}/>, name: 'Meta Data', isTitle: false, isActive: false, slug: 'meta-data'},
  {icon: <FontAwesomeIcon icon={fa.faInfo}/>, name: 'Test', isTitle: false, isActive: false, slug: 'test'},
  {icon: <FontAwesomeIcon icon={fa.faSliders}/>, name: 'PACKAGES', isTitle: true, isActive: false, slug: 'packages'},
  {icon: <FontAwesomeIcon icon={fa.faFolder}/>, name: 'MODFLOW packages', isTitle: false, isActive: false, slug: 'modflow-packages'},
  {icon: <FontAwesomeIcon icon={fa.faCompress}/>, name: 'MT3DMS packages', isTitle: false, isDisabled: true, isActive: false, slug: 'mt3dms-packages'},
  {icon: <FontAwesomeIcon icon={fa.faBarsStaggered}/>, name: 'SEAWAT packages', isTitle: false, isDisabled: true, isActive: false, slug: 'seawat-packages'},
  {icon: <FontAwesomeIcon icon={fa.faSquareCheck}/>, name: 'RESULTS', isTitle: true, isActive: false, slug: 'results'},
  {icon: <FontAwesomeIcon icon={fa.faMap}/>, name: 'Groundwater heads', isTitle: false, isActive: false, slug: 'groundwater-heads'},
  {icon: <FontAwesomeIcon icon={fa.faChartSimple}/>, name: 'Budget', isTitle: false, isActive: false, slug: 'budget'},
  {icon: <FontAwesomeIcon icon={fa.faCircle}/>, name: 'Concentration', isTitle: false, isDisabled: true, isActive: false, slug: 'concentration'},
  {icon: <FontAwesomeIcon icon={fa.faChartLine}/>, name: 'Calibration statistics', isTitle: false, isActive: false, slug: 'calibration-statistics'},
  {icon: <FontAwesomeIcon icon={fa.faFolderOpen}/>, name: 'SCENARIOS', isTitle: true, isActive: false, slug: 'scenarios'},
  {icon: <FontAwesomeIcon icon={fa.faCodeCompare}/>, name: 'Scenarios comparison', isTitle: false, isActive: false, slug: 'scenarios-comparison'},
  {icon: <FontAwesomeIcon icon={fa.faDownLeftAndUpRightToCenter}/>, name: 'Scenarios difference', isTitle: false, isActive: false, slug: 'scenarios-difference'},
  {icon: <FontAwesomeIcon icon={fa.faTimeline}/>, name: 'Scenarios time series', isTitle: false, isActive: false, slug: 'scenarios-time-series'},
  {icon: <FontAwesomeIcon icon={fa.faArrowUpRightFromSquare}/>, name: 'EXPORT', isTitle: true, isActive: false, slug: 'export'},
  {icon: <FontAwesomeIcon icon={fa.faNoteSticky}/>, name: 'Export model (JSON)', isTitle: false, isActive: false, slug: 'export-model-json'},
  {icon: <FontAwesomeIcon icon={fa.faImage}/>, name: 'Export model results', isTitle: false, isActive: false, slug: 'export-model-results'},
  {icon: <FontAwesomeIcon icon={fa.faDownload}/>, name: 'Download MODFLOW files', isTitle: false, isActive: false, slug: 'download-modflow-files'},
];


export const SidebarMenuExample: StoryFn<typeof SidebarMenu> = () => {
  const [selected, setSelected] = React.useState<ISidebarMenuItem>(menuItems[0]);
  const listItems = menuItems.map((item) => {
    return {
      ...item,
      isActive: item.slug === selected.slug,
    };
  });

  return (
    <div style={{position: 'relative', height: '100vh', display: 'block'}}>
      <SidebarMenu menuItems={listItems} onClickCallback={setSelected}/>
    </div>
  );
};
