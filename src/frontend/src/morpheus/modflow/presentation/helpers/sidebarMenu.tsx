import React from 'react';
import {
  faBarsStaggered,
  faBorderAll,
  faCalculator,
  faChartLine,
  faChartSimple,
  faCircle,
  faClock,
  faCompress,
  faFlag,
  faGear,
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
import CalculationContainer from '../containers/CalculationContainer';
import FlowResultsContainer from '../containers/FlowResultsContainer';
import HeadObservationsContainer from '../containers/HeadObservationsContainer';
import CalibrationStatisticsContainer from '../containers/CalibrationStatisticsContainer';

export interface IMenuItem {
  icon: React.ReactNode;
  name: string;
  isTitle: boolean;
  slug: string;
  component?: React.ReactNode;
}

const getSidebarItems = (): IMenuItem[] => {
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
      component: <HeadObservationsContainer/>,
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
      icon: <FontAwesomeIcon icon={faGear}/>,
      name: 'Calculation',
      isTitle: true,
      slug: 'calculation-header',
    },
    {
      icon: <FontAwesomeIcon icon={faSliders}/>,
      name: 'Settings',
      isTitle: false,
      slug: 'calculation-profile',
      component: <CalculationProfileContainer/>,
    },
    {
      icon: <FontAwesomeIcon icon={faCalculator}/>,
      name: 'Calculation',
      isTitle: false,
      slug: 'calculation',
      component: <CalculationContainer/>,
    },
    {
      icon: <FontAwesomeIcon icon={faSquareCheck}/>,
      name: 'Results',
      isTitle: true,
      slug: 'results',
    },
    {
      icon: <FontAwesomeIcon icon={faMap}/>,
      name: 'Flow Results',
      isTitle: false,
      slug: 'flow-results',
      component: <FlowResultsContainer/>,
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
      component: <CalibrationStatisticsContainer/>,
    },
  ];
};

export {getSidebarItems};
