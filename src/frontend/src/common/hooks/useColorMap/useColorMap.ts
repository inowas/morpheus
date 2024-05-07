import getColorScale, {IColorScale} from './colormap';
import {useEffect, useState} from 'react';


interface IUseColorMap {
  (x: number): [number, number, number];
}

const useColorMap = (name: IColorScale): IUseColorMap => {

  const [colorScale, setColorScale] = useState<(x: number) => [number, number, number]>(() => getColorScale(name));

  useEffect(() => {
    setColorScale(() => getColorScale(name));
  }, [name]);


  return colorScale;
};

export default useColorMap;
export type {IColorScale, IUseColorMap};
