import {Button, InfoTitle, Tab} from 'common/components';
import {Icon, MenuItem, TabPane} from 'semantic-ui-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Tab',
  component: Tab,
} as Meta<typeof Tab>;

const wrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '60px',
};

const panesPrimary = [
  {
    menuItem: (
      <MenuItem key='properties'>
        Properties
      </MenuItem>
    ),
    render: () => <TabPane attached={false}>
      <h2>Properties</h2>
      <p>Tab 1 Content</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi explicabo quos ullam voluptate.
        Blanditiis consequuntur doloremque dolores doloribus ducimus explicabo facere hic illum libero molestias nam nobis nostrum perspiciatis quas quos, sapiente similique.
        Aliquid at, ea enim et exercitationem impedit, ipsam magni minus numquam odio quae quaerat quod sit veritatis voluptas. Architecto eligendi perspiciatis quia rem veniam.
        Consequatur facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus et illum incidunt iste nostrum quaerat, reprehenderit voluptatem? Consectetur corporis
        dignissimos dolorum eveniet expedita, harum, id impedit ipsam ipsum iste laborum minima nihil officiis omnis perspiciatis provident quisquam quos rem, voluptas voluptatem?
        Accusamus doloribus eligendi eos, est expedita explicabo fugit harum illum iste itaque nisi optio perspiciatis quibusdam saepe sit sunt tenetur veniam. Animi, consequuntur
        corporis doloribus dolorum eligendi eos, exercitationem fugit harum id itaque labore laboriosam, laudantium libero nihil odit quas quia rem repellendus soluta tenetur.
        Accusantium alias aliquam assumenda aut debitis distinctio dolore dolorem doloremque enim inventore libero maxime neque officiis optio pariatur perferendis possimus quas
        quibusdam, repellendus sequi. Ab animi architecto, culpa dolorem doloribus eveniet illum itaque labore magnam magni molestias nam omnis perferendis placeat porro recusandae
        sed sit ut vitae voluptates! Amet cumque dolor enim itaque libero maxime mollitia, nihil nulla obcaecati odio quisquam tempora unde. Dicta, error, exercitationem explicabo,
        iste labore laboriosam magnam magni nemo optio quam similique tempore unde velit. Alias, asperiores, dicta dolor dolorem ducimus excepturi facilis iure libero molestias
        necessitatibus odit perferendis quod quos repudiandae sed soluta totam unde veniam voluptas, voluptate! Accusamus accusantium aliquam amet asperiores autem cum dolorem
        dolores ducimus eos, eveniet excepturi fuga ipsa minima minus mollitia necessitatibus nostrum obcaecati odio odit optio possimus qui quia quibusdam quisquam soluta vel
        veniam voluptatum! Aliquid assumenda dignissimos dolor excepturi, facere id iste labore laboriosam non obcaecati officiis, qui quidem quis reiciendis sequi ut vitae! Atque
        aut deserunt eaque facere id, iure maxime optio possimus ratione suscipit. Accusamus beatae hic laborum natus rerum! Adipisci architecto beatae commodi corporis, delectus
        esse eveniet facilis fuga in ipsum laboriosam maiores maxime, minima mollitia non numquam quasi repudiandae sequi tempore totam? Dolorem ea, eaque eligendi hic illum
        laborum quia similique. Aperiam beatae cupiditate ducimus veniam voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores maxime, minus molestias nobis qui,
        quidem repudiandae sapiente.</p>
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
    render: () => <TabPane attached={false}>
      <h2>Validation</h2>
      <p>Tab 2 Content</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi explicabo quos ullam voluptate.
        Blanditiis consequuntur doloremque dolores doloribus ducimus explicabo facere hic illum libero molestias nam nobis nostrum perspiciatis quas quos, sapiente similique.
        Aliquid at, ea enim et exercitationem impedit, ipsam magni minus numquam odio quae quaerat quod sit veritatis voluptas. Architecto eligendi perspiciatis quia rem veniam.
        Consequatur facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus et illum incidunt iste nostrum quaerat, reprehenderit voluptatem? Consectetur corporis
        iste labore laboriosam magnam magni nemo optio quam similique tempore unde velit. Alias, asperiores, dicta dolor dolorem ducimus excepturi facilis iure libero molestias
        necessitatibus odit perferendis quod quos repudiandae sed soluta totam unde veniam voluptas, voluptate! Accusamus accusantium aliquam amet asperiores autem cum dolorem
        dolores ducimus eos, eveniet excepturi fuga ipsa minima minus mollitia necessitatibus nostrum obcaecati odio odit optio possimus qui quia quibusdam quisquam soluta vel
        veniam voluptatum! Aliquid assumenda dignissimos dolor excepturi, facere id iste labore laboriosam non obcaecati officiis, qui quidem quis reiciendis sequi ut vitae! Atque
        aut deserunt eaque facere id, iure maxime optio possimus ratione suscipit. Accusamus beatae hic laborum natus rerum! Adipisci architecto beatae commodi corporis, delectus
        esse eveniet facilis fuga in ipsum laboriosam maiores maxime, minima mollitia non numquam quasi repudiandae sequi tempore totam? Dolorem ea, eaque eligendi hic illum
        laborum quia similique. Aperiam beatae cupiditate ducimus veniam voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores maxime, minus molestias nobis qui,
        quidem repudiandae sapiente.</p>
    </TabPane>,

  },
];
const panesPrimaryV2 = [
  {
    menuItem: (
      <MenuItem key='properties'>
        Properties
      </MenuItem>
    ),
    render: () => <TabPane attached={false}>
      <h2>Properties</h2>
      <p>Tab 1 Content</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi explicabo quos ullam voluptate.
        Blanditiis consequuntur doloremque dolores doloribus ducimus explicabo facere hic illum libero molestias nam nobis nostrum perspiciatis quas quos, sapiente similique.
        Aliquid at, ea enim et exercitationem impedit, ipsam magni minus numquam odio quae quaerat quod sit veritatis voluptas. Architecto eligendi perspiciatis quia rem veniam.
        Consequatur facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus et illum incidunt iste nostrum quaerat, reprehenderit voluptatem? Consectetur corporis
        dignissimos dolorum eveniet expedita, harum, id impedit ipsam ipsum iste laborum minima nihil officiis omnis perspiciatis provident quisquam quos rem, voluptas voluptatem?
        Accusamus doloribus eligendi eos, est expedita explicabo fugit harum illum iste itaque nisi optio perspiciatis quibusdam saepe sit sunt tenetur veniam. Animi, consequuntur
        corporis doloribus dolorum eligendi eos, exercitationem fugit harum id itaque labore laboriosam, laudantium libero nihil odit quas quia rem repellendus soluta tenetur.
        Accusantium alias aliquam assumenda aut debitis distinctio dolore dolorem doloremque enim inventore libero maxime neque officiis optio pariatur perferendis possimus quas
        quibusdam, repellendus sequi. Ab animi architecto, culpa dolorem doloribus eveniet illum itaque labore magnam magni molestias nam omnis perferendis placeat porro recusandae
        sed sit ut vitae voluptates! Amet cumque dolor enim itaque libero maxime mollitia, nihil nulla obcaecati odio quisquam tempora unde. Dicta, error, exercitationem explicabo,
        iste labore laboriosam magnam magni nemo optio quam similique tempore unde velit. Alias, asperiores, dicta dolor dolorem ducimus excepturi facilis iure libero molestias
        necessitatibus odit perferendis quod quos repudiandae sed soluta totam unde veniam voluptas, voluptate! Accusamus accusantium aliquam amet asperiores autem cum dolorem
        dolores ducimus eos, eveniet excepturi fuga ipsa minima minus mollitia necessitatibus nostrum obcaecati odio odit optio possimus qui quia quibusdam quisquam soluta vel
        veniam voluptatum! Aliquid assumenda dignissimos dolor excepturi, facere id iste labore laboriosam non obcaecati officiis, qui quidem quis reiciendis sequi ut vitae! Atque
        aut deserunt eaque facere id, iure maxime optio possimus ratione suscipit. Accusamus beatae hic laborum natus rerum! Adipisci architecto beatae commodi corporis, delectus
        esse eveniet facilis fuga in ipsum laboriosam maiores maxime, minima mollitia non numquam quasi repudiandae sequi tempore totam? Dolorem ea, eaque eligendi hic illum
        laborum quia similique. Aperiam beatae cupiditate ducimus veniam voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores maxime, minus molestias nobis qui,
        quidem repudiandae sapiente.</p>
    </TabPane>,
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
      <h2>Validation</h2>
      <p>Tab 2 Content</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi explicabo quos ullam voluptate.
        Blanditiis consequuntur doloremque dolores doloribus ducimus explicabo facere hic illum libero molestias nam nobis nostrum perspiciatis quas quos, sapiente similique.
        Aliquid at, ea enim et exercitationem impedit, ipsam magni minus numquam odio quae quaerat quod sit veritatis voluptas. Architecto eligendi perspiciatis quia rem veniam.
        Consequatur facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus et illum incidunt iste nostrum quaerat, reprehenderit voluptatem? Consectetur corporis
        iste labore laboriosam magnam magni nemo optio quam similique tempore unde velit. Alias, asperiores, dicta dolor dolorem ducimus excepturi facilis iure libero molestias
        necessitatibus odit perferendis quod quos repudiandae sed soluta totam unde veniam voluptas, voluptate! Accusamus accusantium aliquam amet asperiores autem cum dolorem
        dolores ducimus eos, eveniet excepturi fuga ipsa minima minus mollitia necessitatibus nostrum obcaecati odio odit optio possimus qui quia quibusdam quisquam soluta vel
        veniam voluptatum! Aliquid assumenda dignissimos dolor excepturi, facere id iste labore laboriosam non obcaecati officiis, qui quidem quis reiciendis sequi ut vitae! Atque
        aut deserunt eaque facere id, iure maxime optio possimus ratione suscipit. Accusamus beatae hic laborum natus rerum! Adipisci architecto beatae commodi corporis, delectus
        esse eveniet facilis fuga in ipsum laboriosam maiores maxime, minima mollitia non numquam quasi repudiandae sequi tempore totam? Dolorem ea, eaque eligendi hic illum
        laborum quia similique. Aperiam beatae cupiditate ducimus veniam voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores maxime, minus molestias nobis qui,
        quidem repudiandae sapiente.</p>
    </TabPane>,
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

export const TabPrimary: StoryFn<typeof Button> = () => {
  return (
    <div style={wrapper}>
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
    </div>
  );
};
export const TabSecondary: StoryFn<typeof Button> = () => {
  return (
    <div style={wrapper}>
      <div className={'scrollWrapper-Y'} style={{background: '#eeeeee', padding: '50px'}}>
        <Tab
          variant='secondary'
          title={true}
          defaultActiveIndex={1}
          grid={{rows: 1, columns: 2}}
          menu={{fluid: true, vertical: true, tabular: true}}
          panes={panesSecondary}
        />
      </div>
      <div className={'scrollWrapper-Y'} style={{padding: '50px'}}>
        <Tab
          variant='secondary'
          title={true}
          defaultActiveIndex={2}
          grid={{rows: 1, columns: 2}}
          menu={{fluid: true, vertical: true, tabular: true}}
          panes={panesSecondary}
        />
      </div>
    </div>
  );
};
