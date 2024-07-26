import {LineString, Point, Polygon} from 'geojson';
import {IAffectedCells} from '../../../types';
import {IBoundaryId, IBoundaryObservationValue, IBoundaryType, IInterpolationType} from '../../../types/Boundaries.type';
import {IObservationValue, IObservationId, IObservationType} from '../../../types/Observations.type';

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
type IImportItemValue = IBoundaryObservationValue | IObservationValue | {date_time: string, [key: string]: any};

export type {IImportItem, IImportId, IImportItemType, IImportItemValue};
