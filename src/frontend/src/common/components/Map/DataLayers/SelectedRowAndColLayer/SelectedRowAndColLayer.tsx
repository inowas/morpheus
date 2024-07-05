import React, {useMemo} from 'react';
import {Feature, FeatureCollection, Polygon} from 'geojson';
import {Polygon as LeafletPolygon, FeatureGroup} from 'common/infrastructure/React-Leaflet';
import * as turf from '@turf/turf';
import {ISelection} from '../types';
import PolygonWithText from './PolygonWithText';

interface IProps {
  nRows: number;
  nCols: number;
  selectedRow: number;
  selectedCol: number;
  outline: Feature<Polygon>;
  rotation: number;
}

interface PolygonProperties {
  row?: number;
  col?: number;
}

const SelectedRowAndColLayer = ({nRows, nCols, selectedRow, selectedCol, outline, rotation}: IProps) => {

  const rowAndColPolygons = useMemo(() => {
    const polygon = turf.polygon(outline.geometry.coordinates);
    const centerOfPolygon = turf.centerOfMass(polygon);
    const rotatedPolygonBbox = turf.bbox(turf.transformRotate(polygon, rotation, {pivot: centerOfPolygon.geometry.coordinates}));

    const cellWidth = (rotatedPolygonBbox[2] - rotatedPolygonBbox[0]) / nCols;
    const cellHeight = (rotatedPolygonBbox[3] - rotatedPolygonBbox[1]) / nRows;

    const featureCollection: FeatureCollection<Polygon, PolygonProperties> = {
      type: 'FeatureCollection',
      features: [],
    };

    const xMinCol = rotatedPolygonBbox[0] + selectedCol * cellWidth;
    const xMaxCol = rotatedPolygonBbox[0] + (selectedCol + 1) * cellWidth;
    const yMinCol = rotatedPolygonBbox[1];
    const yMaxCol = rotatedPolygonBbox[3];


    const xMinRow = rotatedPolygonBbox[0];
    const xMaxRow = rotatedPolygonBbox[2];
    const yMinRow = rotatedPolygonBbox[3] - selectedRow * cellHeight;
    const yMaxRow = rotatedPolygonBbox[3] - (selectedRow + 1) * cellHeight;

    const rowPolygon = turf.polygon([[
      [xMinRow, yMinRow],
      [xMaxRow, yMinRow],
      [xMaxRow, yMaxRow],
      [xMinRow, yMaxRow],
      [xMinRow, yMinRow],
    ]]);

    rowPolygon.properties = {row: selectedRow};
    featureCollection.features.push(rowPolygon as Feature<Polygon, PolygonProperties>);

    const colPolygon = turf.polygon([[
      [xMinCol, yMinCol],
      [xMaxCol, yMinCol],
      [xMaxCol, yMaxCol],
      [xMinCol, yMaxCol],
      [xMinCol, yMinCol],
    ]]);

    colPolygon.properties = {col: selectedCol};
    featureCollection.features.push(colPolygon as Feature<Polygon, PolygonProperties>);

    return turf.transformRotate(featureCollection, -rotation, {mutate: true, pivot: centerOfPolygon.geometry.coordinates});
  }, [nRows, nCols, selectedRow, selectedCol, outline, rotation]);

  const getCellPolygon = (row: number, col: number) => {
    const outlinePolygon = turf.polygon(outline.geometry.coordinates);
    const centerOfPolygon = turf.centerOfMass(outlinePolygon);
    const rotatedPolygonBbox = turf.bbox(turf.transformRotate(outlinePolygon, rotation, {pivot: centerOfPolygon.geometry.coordinates}));

    const cellWidth = (rotatedPolygonBbox[2] - rotatedPolygonBbox[0]) / nCols;
    const cellHeight = (rotatedPolygonBbox[3] - rotatedPolygonBbox[1]) / nRows;

    const xMin = rotatedPolygonBbox[0] + col * cellWidth;
    const xMax = rotatedPolygonBbox[0] + (col + 1) * cellWidth;
    const yMin = rotatedPolygonBbox[3] - row * cellHeight;
    const yMax = rotatedPolygonBbox[3] - (row + 1) * cellHeight;

    const cellPolygon = turf.polygon([[
      [xMin, yMin],
      [xMax, yMin],
      [xMax, yMax],
      [xMin, yMax],
      [xMin, yMin],
    ]]);

    return turf.transformRotate(cellPolygon, -rotation, {mutate: true, pivot: centerOfPolygon.geometry.coordinates});
  };

  return (
    <FeatureGroup>
      {rowAndColPolygons.features.map((feature) => {
        return (
          <LeafletPolygon
            key={`row-${feature.properties.row || ''}-col-${feature.properties.col || ''}`}
            positions={feature.geometry.coordinates[0].map((c) => [c[1], c[0]])}
            color={'#000000'}
            weight={0.2}
            fillOpacity={.2}
            bubblingMouseEvents={true}
          />
        );
      })}
      <PolygonWithText coords={getCellPolygon(-2, selectedCol).geometry.coordinates[0].map((c) => [c[1], c[0]])} text={'A'}/>
      <PolygonWithText coords={getCellPolygon(nRows + 1, selectedCol).geometry.coordinates[0].map((c) => [c[1], c[0]])} text={'A'}/>
      <PolygonWithText coords={getCellPolygon(selectedRow, -2).geometry.coordinates[0].map((c) => [c[1], c[0]])} text={'B'}/>
      <PolygonWithText coords={getCellPolygon(selectedRow, nCols + 1).geometry.coordinates[0].map((c) => [c[1], c[0]])} text={'B'}/>
    </FeatureGroup>
  );
};

export default SelectedRowAndColLayer;
export type {ISelection};
