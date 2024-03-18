import {DataGrid, DataRow} from 'common/components/DataGrid';
import {Accordion, TabPane} from 'semantic-ui-react';
import {faDownload, faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import React from 'react';
import {Button, Map, Tab} from 'common/components';
import {BodyContent, SidebarContent} from '../components';
import type {FeatureCollection} from 'geojson';

const panels: any[] = [{
  key: 1,
  title: {
    content: 'Model domain',
    icon: <span><FontAwesomeIcon icon={faLock}/>Locked</span>,
  },
  content: {
    content: (
      <TabPane style={{
        padding: 0,
        backgroundColor: 'transparent',
        border: 'none',
      }}
      >
        <Tab
          variant='primary'
          menu={{pointing: true}}
          panes={[
            {
              menuItem: 'Upload file',
              render: () => <TabPane attached={false}>
                <Button
                  disabled={true}
                  primary={true}
                  size={'tiny'}
                >Choose file</Button>
              </TabPane>,
            },
            {
              menuItem: 'Polygons',
              render: () => <TabPane attached={false}>Polygons</TabPane>,
            },
          ]}
        />
      </TabPane>
    ),
  },
},
{
  key: 2,
  title: {
    content: 'Model domain',
    icon: <span><FontAwesomeIcon icon={faUnlock}/>Unlocked</span>,
  },
  content: {
    content: (
      <Tab
        variant='primary'
        menu={{pointing: true}}
        panes={[
          {
            menuItem: 'Grid Properties',
            render: () => <TabPane attached={false}>Polygons</TabPane>,
          },
          {
            menuItem: 'Upload file',
            render: () => <TabPane attached={false}>
              <Button
                size={'tiny'}
              >Choose file</Button>
              <Button
                className='buttonLink'
              >
                  Download template <FontAwesomeIcon icon={faDownload}/></Button>
            </TabPane>,
          },
          {
            menuItem: 'Polygons',
            render: () => <TabPane attached={false}>Polygons</TabPane>,
          },
        ]}
      />
    ),
  },
}];

const geoJsonPolygon: FeatureCollection = {
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

const SpatialDiscretizationContainer = () => {
  const defaultActiveIndex = Array.from({length: panels.length}, (_, index) => index);
  return (
    <>
      <SidebarContent maxWidth={700}>
        <DataGrid>
          <DataRow title={'Model Geometry'}/>
          <Accordion
            defaultActiveIndex={defaultActiveIndex}
            panels={panels}
            exclusive={false}
          />
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <Map
          editable={true}
          geojson={geoJsonPolygon}
          onChangeGeojson={(geojson) => {
            console.log(geojson);
          }}
          coords={[51.051772741784625, 13.72531677893111]}
        />
      </BodyContent>
    </>
  );
};

export default SpatialDiscretizationContainer;
