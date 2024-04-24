import React from 'react';
import {ILayer} from '../../../types/Layers.type';
import {Button, InfoTitle, Tab} from 'common/components';
import {MenuItem, TabPane} from 'semantic-ui-react';

interface IProps {
  layer: ILayer
}

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

const layerProperties = [
  {
    menuItem: 'Layer properties',
  },
  {
    menuItem: 'Confinement',
    render: () => <TabPane>
      <InfoTitle
        title='Upload shapefile'
        description='Shapefile description'
        actions={[{actionText: 'Add on map', actionDescription: 'Action Description', onClick: () => console.log('Add on map action\'')}]}
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
  {
    menuItem: 'iBound',
    render: () => <TabPane><p>Tab 10 Content</p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. A at autem earum eius et fugiat itaque magnam recusandae rem ut? Animi
      atque distinctio eum quod sint tempora tempore? Ad alias aliquam aliquid assumenda autem deserunt dignissimos dolore dolorem doloribus, dolorum eum iure magnam magni
      molestiae natus nihil nostrum nulla odio optio pariatur, perspiciatis provident quaerat quos sapiente sint soluta ut voluptatem. Aut beatae cum dicta, dignissimos dolores et
      ex illo molestiae neque perferendis quae quis ut voluptates! Autem, blanditiis dicta ea illo iusto magnam maxime natus nobis, perspiciatis porro provident ratione voluptatem!
      Aspernatur delectus distinctio et exercitationem, maxime optio quod!<br/>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi enim, fugiat iusto nemo quo rem. Aut culpa distinctio dolorum est, ipsa laboriosam laudantium minus nam,
      obcaecati omnis pariatur perspiciatis ratione, rerum tempore veniam. Dicta eveniet incidunt magni minus nostrum quam sint tenetur voluptatum. Architecto cupiditate error
      ipsum placeat quibusdam repellat voluptates. Accusamus aperiam consequuntur enim, esse facere iusto nobis perferendis quae qui repellendus soluta sunt vel voluptatem.
      Accusamus, autem debitis deserunt dicta eligendi est et expedita fuga, hic ipsa iure, laudantium molestias neque non optio quibusdam reiciendis repellat sit temporibus velit?
      Autem consectetur, cupiditate facilis iure labore maxime soluta vero?

    </TabPane>,
  },
];

const LayerDetails = ({layer}: IProps) => {
  return (
    <div className={'scrollWrapper-Y'}>
      <Tab
        variant='secondary'
        title={true}
        defaultActiveIndex={1}
        grid={{rows: 1, columns: 2}}
        menu={{fluid: true, vertical: true, tabular: true}}
        panes={layerProperties}
      />
    </div>
  );
};

export default LayerDetails;
