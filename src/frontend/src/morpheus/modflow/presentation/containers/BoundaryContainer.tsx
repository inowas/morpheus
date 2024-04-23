import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import MapExample from '../../../../common/components/Map/MapExample';
import type {FeatureCollection} from 'geojson';
import {BoundaryContent} from '../components/BoundaryLayers';

const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.737521, 51.05702],
            [13.723092, 51.048919],
            [13.736491, 51.037358],
            [13.751779, 51.04773],
            [13.737521, 51.05702],
          ],
        ],
      },
    },
  ],
};

const BoundaryContainer = () => {

  return (
    <>
      <SidebarContent maxWidth={700}>
        <BoundaryContent/>
      </SidebarContent>
      <BodyContent>
        <MapExample
          editable={true}
          geojson={geojson}
          onChangeGeojson={() => console.log('changed')}
          coords={[51.051772741784625, 13.72531677893111]}
        />
      </BodyContent>
    </>
  );
};

export default BoundaryContainer;
