import {IBoundaries} from '../type/BoundariesContent.type';

const getBoundariesByType = (boundaries: IBoundaries[], boundaryType: string): IBoundaries[] => {
  return boundaries.filter(item => item.type === boundaryType);
};

export {getBoundariesByType};
