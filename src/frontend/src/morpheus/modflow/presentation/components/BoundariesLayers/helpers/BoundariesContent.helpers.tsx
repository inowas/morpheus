import {IBoundaries} from '../type/BoundariesContent.type';

const getBoundariesByType = (boundaries: IBoundaries[], boundaryType?: string): IBoundaries[] => {
  if (!boundaries) {
    return boundaries;
  }
  return boundaries.filter(item => item.type === boundaryType);
};

export {getBoundariesByType};
