import React, {useMemo, useState} from 'react';
import {Feature, Polygon} from 'geojson';
import ReactLeafletCanvasDataLayer from './ReactLeafletCanvasDataLayer';
import {LatLngExpression} from 'leaflet';
import {bbox} from '@turf/turf';
import Legend from '../Legend';
import {calculateQuantileThresholds} from './helpers';

interface IProps {
  data: number[][];
  rotation: number;
  outline: Feature<Polygon>
  getRgbColor: (value: number) => string;
  onHover?: (value: number | null) => void;
}


const CanvasDataLayer = ({data, rotation, outline, getRgbColor}: IProps) => {

  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const bounds: LatLngExpression[] | null = useMemo(() => {
    if (!outline) {
      return null;
    }

    const boundingBox = bbox(outline);
    return [[boundingBox[1], boundingBox[0]], [boundingBox[3], boundingBox[2]]];
  }, [outline]);

  const grades = useMemo(() => {
    return calculateQuantileThresholds(data, 5);
  }, [data]);


  if (!bounds) {
    return null;
  }

  return (
    <>
      <ReactLeafletCanvasDataLayer
        data={data}
        rotation={rotation}
        bounds={bounds}
        getRgbColor={getRgbColor}
        onHover={setHoveredValue}
      />
      <Legend
        direction={'horizontal'}
        value={hoveredValue}
        grades={grades}
        getRgbColor={getRgbColor}
      />
    </>
  );
};

export default CanvasDataLayer;
