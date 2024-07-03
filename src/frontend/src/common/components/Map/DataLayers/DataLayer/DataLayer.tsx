import React, {useMemo} from 'react';
import {Feature, Polygon, FeatureCollection} from 'geojson';
import {Polygon as LeafletPolygon, FeatureGroup, useMap} from 'common/infrastructure/React-Leaflet';
import * as turf from '@turf/turf';
import {canvas} from 'leaflet';

interface ISelection {
  col: number;
  row: number;
  value: number;
}

interface IProps {
  data: number[][];
  rotation: number;
  outline: Feature<Polygon>;
  minVal: number;
  maxVal: number;
  getRgbColor: (value: number, minVal: number, maxVal: number) => string;
  onHover?: (selection: ISelection | null) => void;
  onClick?: (selection: ISelection | null) => void;
}

const DataLayer = ({data, rotation, outline, onHover, onClick, getRgbColor, minVal, maxVal}: IProps) => {

  const renderer = canvas({ padding: 1, tolerance: 1});

  const polygons = useMemo(() => {
    const nCols = data[0].length;
    const nRows = data.length;

    const polygon = turf.polygon(outline.geometry.coordinates);
    const centerOfPolygon = turf.centerOfMass(polygon);
    const rotatedPolygonBbox = turf.bbox(turf.transformRotate(polygon, rotation, {pivot: centerOfPolygon.geometry.coordinates}));
    const [xMin, yMin, xMax, yMax] = rotatedPolygonBbox;

    const width = rotatedPolygonBbox[2] - rotatedPolygonBbox[0];
    const height = rotatedPolygonBbox[3] - rotatedPolygonBbox[1];
    const cellWidth = width / nCols;
    const cellHeight = height / nRows;

    const featureCollection: FeatureCollection<Polygon> = {
      type: 'FeatureCollection',
      features: [],
    };

    for (let row = 0; row < nRows - 1; row++) {
      for (let col = 0; col < nCols - 1; col++) {
        const value = data[row][col];
        if (null === value) {
          continue;
        }
        const x1 = col * cellWidth;
        const y1 = row * cellHeight;
        const x2 = (col + 1) * cellWidth;
        const y2 = (row + 1) * cellHeight;

        const polygon = turf.polygon([[
          [xMin + x1, yMax - y1],
          [xMin + x2, yMax - y1],
          [xMin + x2, yMax - y2],
          [xMin + x1, yMax - y2],
          [xMin + x1, yMax - y1],
        ]]);

        polygon.properties = {value, col, row};
        featureCollection.features.push(polygon);
      }
    }

    return turf.transformRotate(featureCollection, -rotation, {pivot: centerOfPolygon.geometry.coordinates});
  }, [data, rotation, outline]);


  return (
    <FeatureGroup>
      {polygons.features.map((feature, index) => (
        <LeafletPolygon
          key={index}
          positions={feature.geometry.coordinates[0].map((coords) => [coords[1], coords[0]])}
          color={onHover || onClick ? 'transparent' : 'black'}
          fillOpacity={0.5}
          fillColor={getRgbColor(feature.properties?.value || 0, minVal, maxVal)}
          weight={0}
          renderer={renderer}
        />
      ))}
    </FeatureGroup>
  );
};

export default DataLayer;
export type {ISelection};
