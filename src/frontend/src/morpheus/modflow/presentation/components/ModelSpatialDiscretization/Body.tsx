import React from 'react';
import type {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import {Map} from 'common/components/Map';
import SpatialDiscretizationMap from './Map';
import {IAffectedCells} from '../../../types';

interface IProps {
  editAffectedCells?: boolean;
  affectedCellsGeometry?: Feature<Polygon | MultiPolygon>;
  onChangeAffectedCell?: (row: number, col: number, active: boolean) => void;
  modelGeometry?: Polygon;
  grid?: FeatureCollection;
  onChangeModelGeometry: (polygon: Polygon) => void;
  editModelGeometry: boolean;
}

const Body = ({affectedCellsGeometry, editAffectedCells, modelGeometry, grid, onChangeModelGeometry, editModelGeometry, onChangeAffectedCell}: IProps) => (
  <Map>
    <SpatialDiscretizationMap
      gridGeometry={grid}
      editAffectedCells={editAffectedCells}
      affectedCellsGeometry={affectedCellsGeometry}
      editModelGeometry={editModelGeometry}
      modelGeometry={modelGeometry}
      onChangeAffectedCell={onChangeAffectedCell}
      onChangeModelGeometry={onChangeModelGeometry}
    />
  </Map>
);

export default Body;
