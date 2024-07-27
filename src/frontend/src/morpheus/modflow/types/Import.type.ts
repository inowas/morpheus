import {LineString, Point, Polygon} from 'geojson';
import {IAffectedCells} from './index';
import {IBoundaryId, IBoundaryObservationValue, IBoundaryType, IInterpolationType} from './Boundaries.type';
import {IObservationValue, IObservationId, IObservationType} from './Observations.type';

interface IImportItem {
  id?: IImportId;
  type: IImportItemType;
  name: string;
  interpolation: IInterpolationType;
  tags: string[];
  geometry: Point | LineString | Polygon;
  affected_cells?: IAffectedCells;
  affected_layers: number[];
  data: IImportItemValue[];
}

type IImportId = IBoundaryId | IObservationId;
type IImportItemType = IBoundaryType | IObservationType;
type IImportItemValue = (IBoundaryObservationValue | IObservationValue) & { [key: string]: any; };

export type {IImportItem, IImportId, IImportItemType, IImportItemValue};
