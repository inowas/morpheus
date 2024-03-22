// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import type {FeatureCollection} from 'geojson';
import MapExample from './MapExample';
import React from 'react';

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
const emptyGeojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export default {
  title: 'Map',
  component: MapExample,
} as Meta<typeof MapExample>;

export const NoGeojson: StoryFn<typeof MapExample> = () => (
  <div style={{height: '50vh', width: '50vw', transform: 'translate(50%, 50%)'}}>
    <MapExample
      editable={true}
      geojson={emptyGeojson}
      onChangeGeojson={() => console.log('changed')}
      coords={[51.051772741784625, 13.72531677893111]}
    />
  </div>
);

export const Editable: StoryFn<typeof MapExample> = () => (
  <div style={{height: '50vh', width: '50vw', transform: 'translate(50%, 50%)'}}>
    <MapExample
      editable={true}
      geojson={geojson}
      onChangeGeojson={() => console.log('changed')}
      coords={[51.051772741784625, 13.72531677893111]}
    />
  </div>
);

export const NoEditable: StoryFn<typeof MapExample> = () => (
  <div style={{height: '50vh', width: '50vw', transform: 'translate(50%, 50%)'}}>
    <MapExample
      editable={false}
      geojson={geojson}
      onChangeGeojson={() => console.log('changed')}
      coords={[51.051772741784625, 13.72531677893111]}
    />
  </div>
);
