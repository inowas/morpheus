import { Meta, StoryFn } from "@storybook/react";

import type { FeatureCollection } from "geojson";
import { Map } from "./index";
import React from "react";

const geojson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
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
  type: "FeatureCollection",
  features: [],
};

export default {
  title: "Map",
  component: Map,
} as Meta<typeof Map>;

export const NoGeojson: StoryFn<typeof Map> = () => (
  <Map
    editable={true}
    geojson={emptyGeojson}
    onChangeGeojson={(geojson) => {
      console.log(geojson);
    }}
    coords={[51.051772741784625, 13.72531677893111]}
  />
);

export const Editable: StoryFn<typeof Map> = () => (
  <Map
    editable={true}
    geojson={geojson}
    onChangeGeojson={(geojson) => {
      console.log(geojson);
    }}
    coords={[51.051772741784625, 13.72531677893111]}
  />
);

export const NoEditable: StoryFn<typeof Map> = () => (
  <Map
    editable={false}
    geojson={geojson}
    onChangeGeojson={(geojson) => {
      console.log(geojson);
    }}
    coords={[51.051772741784625, 13.72531677893111]}
  />
);
