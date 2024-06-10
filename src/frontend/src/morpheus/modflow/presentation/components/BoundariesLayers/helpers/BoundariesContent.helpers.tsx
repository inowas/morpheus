import {IBoundary} from "../../../../types/Boundaries.type";

const getBoundariesByType = (boundaries: IBoundary[], boundaryType?: string): IBoundary[] => {
  if (!boundaries) {
    return boundaries;
  }
  return boundaries.filter(item => item.type === boundaryType);
};

export {getBoundariesByType};
