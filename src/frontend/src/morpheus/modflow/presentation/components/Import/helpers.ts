import {IImportItemType, IImportItemValue} from '../../../types/Import.type';
import {boundarySettings} from '../ModelBoundaries/helpers';
import {getBoundaryColumnsByType, getNewBoundaryDataItemByType} from '../ModelBoundaries/BoundaryDataTable/helpers';
import {IBoundaryType} from '../../../types/Boundaries.type';
import {getNewObservationDataItemByType, getObservationColumnsByType} from '../ModelHeadObservations/helpers';
import {IColumn} from '../../../types/DataTable.type';

const isBoundaryType = (type: IImportItemType): type is IBoundaryType => boundarySettings.find((b) => b.type === type) !== undefined;
const isObservationType = (type: IImportItemType): boolean => boundarySettings.find((b) => b.type === type) === undefined;

export const createDefaultImportItemValueByType = (type: IImportItemType, dateTime: string): IImportItemValue => {
  if (isBoundaryType(type)) {
    return getNewBoundaryDataItemByType(type, dateTime);
  }

  if (isObservationType(type)) {
    return getNewObservationDataItemByType(type, dateTime);
  }

  throw new Error(`Unknown type: ${type}`);
};

export const hasMultipleAffectedLayers = (type: IImportItemType): boolean => boundarySettings.find((b) => b.type === type) ? boundarySettings.find((b) => b.type === type)!.hasMultipleAffectedLayers : false;


export const getImportColumnsByType = (type: IImportItemType, formatISODate: (date: string) => string, parseDate: (date: string) => string): IColumn[] => {
  if (isBoundaryType(type)) {
    return getBoundaryColumnsByType(type, formatISODate, parseDate);
  }

  if (isObservationType(type)) {
    return getObservationColumnsByType(type, formatISODate, parseDate);
  }

  throw new Error(`Unknown type: ${type}`);
};
