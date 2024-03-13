import {Accordion, Icon, MenuItem, TabPane} from 'semantic-ui-react';
import {Button, InfoTitle, MovableAccordionList, Tab} from 'common/components';
import {DataGrid, DataRow} from 'common/components/DataGrid';
import React, {useState} from 'react';

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
const panelSecondary = [
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
const ModelProperties: React.FC = () => {

  const movableItems: any = [
    {
      key: 1123123,
      title: {
        content: (
          'Top layer'
        ),
        icon: false,
      },
      content: {
        content: (
          <div style={{padding: '20px'}}><h2>Properties</h2>
            <p>Tab 1 Content</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi explicabo quos ullam
              voluptate.
              Blanditiis consequuntur doloremque dolores doloribus ducimus explicabo facere hic illum libero molestias nam nobis nostrum perspiciatis quas quos, sapiente
              similique.
              Aliquid at, ea enim et exercitationem impedit, ipsam magni minus numquam odio quae quaerat quod sit veritatis voluptas. Architecto eligendi perspiciatis quia rem
              veniam.
              Consequatur facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus et illum incidunt iste nostrum quaerat, reprehenderit voluptatem? Consectetur
              corporis
              dignissimos dolorum eveniet expedita, harum, id impedit ipsam ipsum iste laborum minima nihil officiis omnis perspiciatis provident quisquam quos rem, voluptas
              voluptatem?
              Accusamus doloribus eligendi eos, est expedita explicabo fugit harum illum iste itaque nisi optio perspiciatis quibusdam saepe sit sunt tenetur veniam. Animi,
              consequuntur
              corporis doloribus dolorum eligendi eos, exercitationem fugit harum id itaque labore laboriosam, laudantium libero nihil odit quas quia rem repellendus soluta
              tenetur.
              Accusantium alias aliquam assumenda aut debitis distinctio dolore dolorem doloremque enim inventore libero maxime neque officiis optio pariatur perferendis possimus
              quas
              quibusdam, repellendus sequi. Ab animi architecto, culpa dolorem doloribus eveniet illum itaque labore magnam magni molestias nam omnis perferendis placeat porro
              recusandae
              sed sit ut vitae voluptates! Amet cumque dolor enim itaque libero maxime mollitia, nihil nulla obcaecati odio quisquam tempora unde. Dicta, error, exercitationem
              explicabo,
              iste labore laboriosam magnam magni nemo optio quam similique tempore unde velit. Alias, asperiores, dicta dolor dolorem ducimus excepturi facilis iure libero
              molestias
              necessitatibus odit perferendis quod quos repudiandae sed soluta totam unde veniam voluptas, voluptate! Accusamus accusantium aliquam amet asperiores autem cum
              dolorem
              dolores ducimus eos, eveniet excepturi fuga ipsa minima minus mollitia necessitatibus nostrum obcaecati odio odit optio possimus qui quia quibusdam quisquam soluta
              vel
              veniam voluptatum! Aliquid assumenda dignissimos dolor excepturi, facere id iste labore laboriosam non obcaecati officiis, qui quidem quis reiciendis sequi ut
              vitae! Atque
              aut deserunt eaque facere id, iure maxime optio possimus ratione suscipit. Accusamus beatae hic laborum natus rerum! Adipisci architecto beatae commodi corporis,
              delectus
              esse eveniet facilis fuga in ipsum laboriosam maiores maxime, minima mollitia non numquam quasi repudiandae sequi tempore totam? Dolorem ea, eaque eligendi hic
              illum
              laborum quia similique. Aperiam beatae cupiditate ducimus veniam voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores maxime, minus molestias nobis
              qui,
              quidem repudiandae sapiente.</p>
          </div>
        ),
      },
      isOpen: false,
    },
    {
      key: 2,
      title: {
        content: (
          'Some clay-silt lenses'
        ),
        icon: false,
      },
      content: {
        content: (
          <p style={{padding: '20px'}}>Some clay-silt lenses. <br/> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam
            porro quia, quibusdam
            sapiente
            tempore
            vitae!</p>
        ),
      },
      isOpen: false,

    },
    {
      key: 3,
      title: {
        content: (
          'New Content'
        ),
        icon: false,
      },
      content: {
        content: (
          <div className={'scrollWrapper-Y'}>
            <Tab
              variant='secondary'
              title={true}
              defaultActiveIndex={1}
              grid={{rows: 1, columns: 2}}
              menu={{fluid: true, vertical: true, tabular: true}}
              panes={panelSecondary}
            />
          </div>
        ),
      },
      isOpen: false,

    },
    {
      key: 4,
      title: {
        content: (
          'New Content 2'
        ),
        icon: false,
      },
      content: {
        content: (
          <p style={{padding: '20px'}}>New content for item 2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dignissimos facilis inventore minima numquam porro
            quia, quibusdam sapiente
            tempore vitae!</p>
        ),
      },
      isOpen: false,

    },
  ];

  const [movableListItems, setMovableListItems] = useState<any[]>(movableItems);

  const onMovableListChange = (newItems: any) => {
    setMovableListItems(newItems);
  };

  const accordionItems: any[] = [
    {
      key: 1,
      title: {
        content: (
          'Top layer'
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
          'Some clay-silt lenses'
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
  const panelsPrimary = [
    {
      menuItem: (
        <MenuItem key='properties'>
          Properties
        </MenuItem>
      ),
      render: () => <TabPane attached={false}>
        <MovableAccordionList
          items={movableListItems}
          onMovableListChange={onMovableListChange}
        />
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
      </TabPane>,
    },
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
          panes={panelSecondary}
        />
      </div>
    </DataGrid>
  </>
  ;
};

export default ModelProperties;
