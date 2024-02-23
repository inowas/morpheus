import React from 'react';
import {DataGrid, DataRow} from '../index';
import {Icon, MenuItem, TabPane} from 'semantic-ui-react';
import {Button, InfoTitle, Tab} from 'components';

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
  const panesPrimaryV3 = [
    {
      menuItem: 'Upload shapefile',
      render: () => <TabPane attached={false}>Upload shapefile</TabPane>,
    },
    {
      menuItem: 'Polygons',
      render: () => <TabPane attached={false}>Polygons</TabPane>,
    },
  ];
  const panesPrimaryV4 = [
    {
      menuItem: (
        <MenuItem key='Upload shapefile'>
          Properties
        </MenuItem>
      ),
      render: () => <TabPane attached={false}>Upload shapefile</TabPane>,
    },
    {
      menuItem: (
        <MenuItem key='Polygons'>
          Properties
        </MenuItem>
      ),
      render: () => <TabPane attached={false}>Polygons</TabPane>,
    },
  ];
  const panesSecondary = [
    {
      menuItem: 'Layer properties',
      render: () => <TabPane></TabPane>,
    },
    {
      menuItem: 'Confinement',
      render: () => <TabPane>
        <InfoTitle
          title='Upload shapefile'
          description='Shapefile description'
          actionText='Add on map'
          actionDescription='Action description'
          onAction={() => {
            console.log('Add on map action');
          }}
        />
        <Button size={'tiny'}>Choose file</Button>
        <InfoTitle
          title='Upload raster'
          description='raster description'
        />
        <Button size={'tiny'}>Choose file</Button>
      </TabPane>,
    },
    {
      menuItem: 'Top elevation', render: () => <TabPane>
        <Tab
          variant='primary'
          menu={{secondary: true, pointing: true}}
          panes={panesPrimaryV3}
        />
      </TabPane>,
    },
    {
      menuItem: 'Bottom elevation', render: () => <TabPane>
        <Tab
          variant='primary'
          menu={{secondary: true, pointing: true}}
          panes={panesPrimaryV4}
        />
      </TabPane>,
    },
    {menuItem: 'Hydraulic conductivity along rows', render: () => <TabPane>Tab 4 Content</TabPane>},
    {menuItem: 'Horizontal hydraulic anisotropy', render: () => <TabPane>Tab 5 Content</TabPane>},
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
      <div className={'scrollWrapper-Y'}>
        <Tab
          variant='secondary'
          title={true}
          defaultActiveIndex={2}
          grid={{rows: 1, columns: 2}}
          menu={{fluid: true, vertical: true, tabular: true}}
          panes={panesSecondary}
        />
      </div>
    </DataGrid>

  </>
  ;
};

export default ModelProperties;
