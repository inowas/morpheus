import React from 'react';
import type {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import {Map} from 'common/components/Map';
import {IAffectedCells} from "../../../types";
import SpatialDiscretizationLayer from "./SpatialDiscretizationLayer";
import AffectedCellsLayer from "./AffectedCellsLayer";


interface IProps {
  affectedCells: IAffectedCells;
  editAffectedCells: boolean
  affectedCellsGeometry?: Feature<Polygon | MultiPolygon>;
  gridGeometry?: FeatureCollection
  onChangeAffectedCells: (affectedCells: IAffectedCells) => void;
  editModelGeometry: boolean
  modelGeometry: Polygon
  onChangeModelGeometry: (polygon: Polygon) => void
}

const MapWrapper = (props: IProps) => {
  return (
    <Map>
      <SpatialDiscretizationLayer modelGeometry={props.modelGeometry} onChangeModelGeometry={props.onChangeModelGeometry} editModelGeometry={props.editModelGeometry}/>
      <AffectedCellsLayer affectedCells={props.affectedCells} affectedCellsGeometry={props.affectedCellsGeometry} editAffectedCells={props.editAffectedCells}
                          gridGeometry={props.gridGeometry} onChangeAffectedCells={props.onChangeAffectedCells}/>
    </Map>
  );
};


export default MapWrapper;
