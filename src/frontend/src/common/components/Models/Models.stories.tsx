import {ApplicationContentWrapper, Header, IPageWidth, Map, ModelGeometry, ModelMetaData, ModelStressPeriods, ModelTest} from 'common/components';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React, {useState} from 'react';

import type {FeatureCollection} from 'geojson';
import ProjectContainer from '../../../morpheus/application/presentation/containers/ProjectContainer';
import menuItems from '../SidebarMenu/MenuItems';

const geojson: FeatureCollection = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [
              13.737521,
              51.05702,
            ],
            [
              13.723092,
              51.048919,
            ],
            [
              13.736491,
              51.037358,
            ],
            [
              13.751779,
              51.04773,
            ],
            [
              13.737521,
              51.05702,
            ],
          ],
        ],
      },
    },
  ],
};

const navbarItems = [
  {
    name: 'home', label: 'Home', admin: false, basepath: '/', subMenu: [
      {name: 'T02', label: 'T02: Groundwater Mounding (Hantush)', admin: false, to: '/tools/T02'},
      {name: 'T04', label: 'T04: Database for GIS-based Suitability Mapping', admin: false, to: '/tools/T04'}],
  },
  {name: 'filters', label: 'Filters', admin: false, to: '/tools'},
  {name: 'documentation', label: 'Documentation', admin: false, to: '/modflow'},
];

const pageSize: IPageWidth = 'auto';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Modflow/Models',
  component: ProjectContainer,
} as Meta<typeof ProjectContainer>;


export const ModelsExample: StoryFn<typeof ProjectContainer> = () => {
  const [listItems, setListItems] = useState(menuItems);
  const [headerHeight, setHeaderHeight] = useState(0);

  const currentContent = listItems.find(item => item.active)?.description;

  const SidebarContent = () => {
    switch (currentContent) {
    case 'Grid properties':
      return <ModelGeometry/>;
    case 'Test':
      return <ModelTest/>;
    case 'Model layers':
      return <ModelMetaData/>;
    case 'Stress periods':
      return <ModelStressPeriods/>;
    default:
      return <pre style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        Coming soon</pre>;
    }
  };

  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  return (
    <div style={{margin: '-1rem'}}>
      <Header
        maxWidth={pageSize}
        navbarItems={navbarItems}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={true}
        showSidebarMenu={true}
        updateHeight={(height: number) => {
        }}
      />
      <ApplicationContentWrapper
        headerHeight={headerHeight}
        open={false}
        maxWidth={700}
        contentFullWidth={true}
        menuItems={listItems}
        handleItemClick={handleItemClick}
      >
        <SidebarContent/>
        <Map
          editable={true}
          geojson={geojson}
          onChangeGeojson={(data) => {
            console.log(data);
          }}
          coords={[51.051772741784625, 13.72531677893111]}
        />
      </ApplicationContentWrapper>
    </div>
  );
};

export const ModelsNoSidebarMenuExample: StoryFn<typeof ProjectContainer> = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <div style={{margin: '-1rem'}}>
      <Header
        maxWidth={pageSize}
        navbarItems={navbarItems}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={true}
        showCreateButton={true}
        showSidebarMenu={false}
        updateHeight={(height: number) => {
        }}
      />
      <ApplicationContentWrapper
        headerHeight={headerHeight}
        open={false}
        maxWidth={700}
        contentFullWidth={true}
      >
        <ModelGeometry/>
        <Map
          editable={true}
          geojson={geojson}
          onChangeGeojson={(data) => {
            console.log(data);
          }}
          coords={[51.051772741784625, 13.72531677893111]}
        />
      </ApplicationContentWrapper>
    </div>
  );
};
