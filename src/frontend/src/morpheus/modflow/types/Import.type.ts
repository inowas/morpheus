import {LineString, Point, Polygon} from 'geojson';
import {IAffectedCells} from './SpatialDiscretization.type';
import {IBoundaryId, IBoundaryObservationValue, IBoundaryType, IInterpolationType} from './Boundaries.type';
import {IObservationValue, IObservationId, IObservationType} from './Observations.type';

interface IImportItem {
  id?: IImportId;
  type: IImportItemType;
  name: string;
  interpolation?: IInterpolationType;
  tags?: string[];
  geometry: Point | LineString | Polygon;
  affected_cells?: IAffectedCells;
  affected_layers: number[];
  data: IImportValue[];
}

type IImportId = IBoundaryId | IObservationId;
type IImportItemType = IBoundaryType | IObservationType;
type IImportValue = IBoundaryObservationValue | IObservationValue;

export type {IImportItem, IImportId, IImportItemType, IImportValue};
