import React from 'react';
import {DataGrid, DataRow} from '../index';
import {Accordion, Icon, MenuItem, TabPane} from 'semantic-ui-react';
import {Button, DotsMenu, IAction, InfoTitle, Tab} from 'components';
import MovableList from 'components/MovableList/MovableList';

const ModelProperties: React.FC = () => {
  const yourActions: IAction[] = [
    {key: 'action1', text: 'Action 1', icon: 'sign language', onClick: () => console.log('Action 1 clicked')},
    {key: 'action2', text: 'Action 2', icon: 'microphone', onClick: () => console.log('Action 2 clicked')},
    {key: 'action3', text: 'Action 3', icon: 'share alternate', onClick: () => console.log('Action 3 clicked')},
    {key: 'action4', text: 'Action 4', icon: 'users', onClick: () => console.log('Action 4 clicked')},
  ];

  const movableItems: any[] = [
    [
      {
        key: 1,
        title: {
          content: (
            <div className='accordionTitleMenuWrapper'>
              <Icon className='accordionTitleMenuIcon' name='bars'/>
              Top layer
              <DotsMenu actions={yourActions}/>
            </div>
          ),
          icon: false,
        },
        content: {
          content: (
            <p>General parameters Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam porro quia, quibusdam sapiente tempore
              vitae!</p>
          ),
        },
      },
    ],
    [
      {
        key: 2,
        title: {
          content: (
            <div className='accordionTitleMenuWrapper'>
              <Icon className='accordionTitleMenuIcon' name='bars'/>
              Some clay-silt lenses
              <DotsMenu actions={yourActions}/>
            </div>
          ),
          icon: false,
        },
        content: {
          content: (
            <p>Some clay-silt lenses. <br/> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam porro quia, quibusdam
              sapiente
              tempore
              vitae!</p>
          ),
        },
      },
    ],
  ];

  const accordionItems: any[] = [
    {
      key: 1,
      title: {
        content: (
          <div className='accordionTitleMenuWrapper'>
            <Icon className='accordionTitleMenuIcon' name='bars'/>
            Top layer
            <DotsMenu actions={yourActions}/>
          </div>
        ),
        icon: false,
      },
      content: {
        content: (
          <p>General parameters Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam porro quia, quibusdam sapiente
            tempore
            vitae!</p>
        ),
      },
    },
    {
      key: 2,
      title: {
        content: (
          <div className='accordionTitleMenuWrapper'>
            <Icon className='accordionTitleMenuIcon' name='bars'/>
            Some clay-silt lenses
            <DotsMenu actions={yourActions}/>
          </div>
        ),
        icon: false,
      },
      content: {
        content: (
          <p>Some clay-silt lenses. <br/> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam porro quia, quibusdam
            sapiente
            tempore
            vitae!</p>
        ),
      },
    },
  ];

  // const movableItems = [
  //   <Accordion
  //     key={1}
  //     className='accordionPrimary'
  //     panels={accordionPanel}
  //     exclusive={false}
  //   />,
  //   <Accordion
  //     key={2}
  //     className='accordionPrimary'
  //     panels={accordionPanel2}
  //     exclusive={false}
  //   />,
  // ];
  // const movableItems2 = [
  //   accordionPanel,
  //   accordionPanel2,
  // ];
  // console.log(accordionPanel3);
  // console.log(movableItems2);


  const panelsPrimary = [
    {
      menuItem: (
        <MenuItem key='properties'>
          Properties
        </MenuItem>
      ),
      render: () => <TabPane attached={false}>
        <MovableList items={movableItems}/>
      </TabPane>,
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
  const panelsPrimaryV2 = [
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
      render: () => <TabPane attached={false}>
        <Accordion
          className='accordionPrimary'
          panels={accordionItems}
          exclusive={false}
        />
        {/*<Accordion*/}
        {/*  className='accordionPrimary'*/}
        {/*  panels={[*/}
        {/*    {*/}
        {/*      key: 2,*/}
        {/*      title: {*/}
        {/*        content: (*/}
        {/*          <div className='accordionTitleMenuWrapper'>*/}
        {/*            <Icon className='accordionTitleMenuIcon' name='bars'/>*/}
        {/*            Some clay-silt lenses*/}
        {/*            <DotsMenu actions={yourActions}/>*/}
        {/*          </div>*/}
        {/*        ),*/}
        {/*        icon: false,*/}
        {/*      },*/}
        {/*      content: {*/}
        {/*        content: (*/}
        {/*          <p>Some clay-silt lenses. <br/> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam porro quia, quibusdam*/}
        {/*            sapiente*/}
        {/*            tempore*/}
        {/*            vitae!</p>*/}
        {/*        ),*/}
        {/*      },*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*  exclusive={false}*/}
        {/*/>*/}
      </TabPane>,
    },
  ];
  const panelsPrimaryV3 = [
    {
      menuItem: 'Upload shapefile',
      render: () => <TabPane attached={false}>Upload shapefile</TabPane>,
    },
    {
      menuItem: 'Polygons',
      render: () => <TabPane attached={false}>Polygons</TabPane>,
    },
  ];
  const panelsPrimaryV4 = [
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
          panes={panelsPrimaryV3}
        />
      </TabPane>,
    },
    {
      menuItem: 'Bottom elevation', render: () => <TabPane>
        <Tab
          variant='primary'
          menu={{secondary: true, pointing: true}}
          panes={panelsPrimaryV4}
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
        panes={panelsPrimary}
      />
      <Tab
        variant='primary'
        defaultActiveIndex={1}
        menu={{secondary: true, pointing: true}}
        panes={panelsPrimaryV2}
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
