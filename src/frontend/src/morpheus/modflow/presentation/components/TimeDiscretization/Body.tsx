import {MapExample} from 'common/components';
import React from 'react';
import type {FeatureCollection} from 'geojson';

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

const Body = () => {
  return (
    <MapExample
      editable={true}
      geojson={geoJsonPolygon}
      onChangeGeojson={(geojson) => {
        console.log(geojson);
      }}
      coords={[51.051772741784625, 13.72531677893111]}
    />
  );
};

export default Body;
