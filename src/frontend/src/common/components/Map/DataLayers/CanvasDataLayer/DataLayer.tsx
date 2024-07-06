import React, {useMemo, useState} from 'react';
import {Feature, Polygon, FeatureCollection} from 'geojson';
import {Polygon as LeafletPolygon, FeatureGroup, useMap, useMapEvents, Pane} from 'common/infrastructure/React-Leaflet';
import * as turf from '@turf/turf';
import {GridLayerOptions} from 'leaflet';
import {ISelection} from '../types';

interface IProps {
  data: number[][];
  rotation: number;
  outline: Feature<Polygon>;
  getRgbColor: (value: number) => string;
  options?: GridLayerOptions;
}

interface IFeatureProperties {
  value: number;
  col: number;
  row: number;
  color: string;
}

const DataLayer = ({data, rotation, outline, getRgbColor, options}: IProps) => {

  const map = useMap();
  const [factor, setFactor] = useState(1);

  useMapEvents({
    zoomend: () => {

      const bounds = map.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();

      const xMin = southWest.lng;
      const yMin = southWest.lat;
      const xMax = northEast.lng;
      const yMax = northEast.lat;
      const mapWidth = xMax - xMin;
      const mapHeight = yMax - yMin;

      const modelBbox = turf.bbox(outline);
      const modelWidth = modelBbox[2] - modelBbox[0];
      const modelHeight = modelBbox[3] - modelBbox[1];

      const widthFactor = mapWidth / modelWidth;
      const heightFactor = mapHeight / modelHeight;

      // here we should calculate the factor based on the width and height of the map
      // the viewport in pixels and the width and height of the model
    },
  });

  const polygons = useMemo(() => {
    const nCols = data[0].length;
    const nRows = data.length;

    const polygon = turf.polygon(outline.geometry.coordinates);
    const centerOfPolygon = turf.centerOfMass(polygon);
    const rotatedPolygonBbox = turf.bbox(turf.transformRotate(polygon, rotation, {pivot: centerOfPolygon.geometry.coordinates}));
    const [xMin, , , yMax] = rotatedPolygonBbox;

    const width = rotatedPolygonBbox[2] - rotatedPolygonBbox[0];
    const height = rotatedPolygonBbox[3] - rotatedPolygonBbox[1];
    const cellWidth = width / nCols;
    const cellHeight = height / nRows;

    const featureCollection: FeatureCollection<Polygon, IFeatureProperties> = {
      type: 'FeatureCollection',
      features: [],
    };

    // render less cells for performance reasons
    // depending on the scaling factor
    // as we want to render maximum 1000 cells we need to calculate the factor
    // we need to determine the viewports width and height on the map
    // and divide it by the cell width and height
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {

        const value = data[row][col];
        const color = getRgbColor(value);
        if (null === value) {
          continue;
        }
        const x1 = col * cellWidth;
        const y1 = row * cellHeight;
        const x2 = (col + 1) * cellWidth;
        const y2 = (row + 1) * cellHeight;

        const cellPolygon = turf.polygon([[
          [xMin + x1, yMax - y1],
          [xMin + x2, yMax - y1],
          [xMin + x2, yMax - y2],
          [xMin + x1, yMax - y2],
          [xMin + x1, yMax - y1],
        ]]);

        cellPolygon.properties = {value, col, row, color};
        featureCollection.features.push(cellPolygon as Feature<Polygon, IFeatureProperties>);
      }
    }

    return turf.transformRotate(featureCollection, -rotation, {mutate: true, pivot: centerOfPolygon.geometry.coordinates});
  }, [data, rotation, outline, getRgbColor]);

  return (
    <Pane name={'data-layer'} style={{zIndex: 400}}>
      <FeatureGroup>
        {polygons.features.map((feature) => {
          const {color, row, col} = feature.properties;
          return (
            <LeafletPolygon
              key={`factor-${factor}-row-${row}-col-${col}-color-${color}`}
              positions={feature.geometry.coordinates[0].map((coords) => [coords[1], coords[0]])}
              color={'transparent'}
              fillOpacity={options?.opacity || 1}
              fillColor={color || 'transparent'}
              weight={0}
            />
          );
        })}
      </FeatureGroup>
    </Pane>
  );
};

export default DataLayer;
export type {ISelection};
