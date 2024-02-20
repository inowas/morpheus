import React from 'react';
import {DataGrid, DataRow} from '../index';
import {Icon, MenuItem, TabPane} from 'semantic-ui-react';
import Tab from 'components/Tabs/Tabs';

const ModelProperties: React.FC = () => {
  const panesPrimary = [
    {
      menuItem: (
        <MenuItem key='properties'>
          Properties
        </MenuItem>
      ),
      render: () => <TabPane attached={false}>Properties</TabPane>,
    },
    {
      menuItem: (
        <MenuItem
          key='validation'
          className='tabItemWithIcon'
        >
          Validation
          <Icon name='check circle'/>
        </MenuItem>
      ),
      render: () => <TabPane attached={false}>Validation</TabPane>,
    },
  ];
  const panesPrimaryV2 = [
    {
      menuItem: (
        <MenuItem key='properties'>
          Properties
        </MenuItem>
      ),
      render: () => <TabPane attached={false}>Properties</TabPane>,
    },
    {
      menuItem: (
        <MenuItem
          key='validation'
          className='tabItemWithIcon'
        >
          Validation
          <Icon name='times circle outline'/>
        </MenuItem>
      ),
      render: () => <TabPane attached={false}>Validation</TabPane>,
    },
  ];
  const panesSecondary = [
    {menuItem: 'Confinement', render: () => <TabPane>Tab 1 Content</TabPane>},
    {menuItem: 'Top elevation', render: () => <TabPane>Tab 2 Content</TabPane>},
    {menuItem: 'Bottom elevation', render: () => <TabPane>Tab 3 Content</TabPane>},
    {menuItem: 'Hydraulic conductivity along rows', render: () => <TabPane>Tab 4 Content</TabPane>},
    {menuItem: 'Horizontal hydraulic anisotropy<', render: () => <TabPane>Tab 5 Content</TabPane>},
    {menuItem: 'Vertical hydraulic conductivity', render: () => <TabPane>Tab 6 Content</TabPane>},
    {menuItem: 'Specific storage', render: () => <TabPane>Tab 7 Content</TabPane>},
    {menuItem: 'Specific yield', render: () => <TabPane>Tab 8 Content</TabPane>},
    {menuItem: 'Starting head', render: () => <TabPane>Tab 9 Content</TabPane>},
    {menuItem: 'iBound', render: () => <TabPane>Tab 10 Content</TabPane>},
  ];
  return <>
    <DataGrid>
      <DataRow title={'Model Grid'}/>
      <Tab
        variant='primary'
        menu={{secondary: true, pointing: true}}
        panes={panesPrimary}
      />
      <Tab
        variant='primary'
        defaultActiveIndex={1}
        menu={{secondary: true, pointing: true}}
        panes={panesPrimaryV2}
      />
      <Tab
        variant='secondary'
        menu={{fluid: true, vertical: true, tabular: true}}
        panes={panesSecondary}
      />
    </DataGrid>
  </>;
};

export default ModelProperties;
