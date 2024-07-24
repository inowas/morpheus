import getColorScale, {IColorMap} from './colorMaps';
import {normal, distinct} from './colorLists';
import {useEffect, useState} from 'react';


interface IUseColorMap {
  getColorArray: (value: number, minValue: number, maxValue: number) => [number, number, number];
  getRgbColor: (value: number, minValue: number, maxValue: number) => string;
  getHexColor: (value: number, minValue: number, maxValue: number) => string;
  colors: {
    normal: string[];
    distinct: string[];
  }
}

const useColorMap = (name: IColorMap): IUseColorMap => {

  const [colorScale, setColorScale] = useState<(x: number) => [number, number, number]>(() => getColorScale(name));

  useEffect(() => {
    setColorScale(() => getColorScale(name));
  }, [name]);

  const getX = (value: number, minValue: number, maxValue: number) => {
    // round min and max values to 6 decimal places
    minValue = Math.round(minValue * 1e6) / 1e6;
    maxValue = Math.round(maxValue * 1e6) / 1e6;
    if (minValue === maxValue) return 0.5;

    if (value <= minValue) return 0;
    if (value >= maxValue) return 1;

    return (value - minValue) / (maxValue - minValue);
  };

  const getColorArray = (value: number, minValue: number, maxValue: number) => {
    return colorScale(getX(value, minValue, maxValue));
  };

  const getRgbColor = (value: number, minValue: number, maxValue: number) => {
    return `rgb(${colorScale(getX(value, minValue, maxValue)).join(',')})`;
  };

  const getHexColor = (value: number, minValue: number, maxValue: number) => {
    return `#${colorScale(getX(value, minValue, maxValue)).map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  };

  return {
    getColorArray,
    getRgbColor,
    getHexColor,
    colors: {
      normal,
      distinct,
    },
  };
};

export default useColorMap;
export type {IColorMap, IUseColorMap};
