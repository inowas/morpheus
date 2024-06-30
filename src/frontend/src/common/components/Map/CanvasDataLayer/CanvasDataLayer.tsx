import React, {useMemo, useState} from 'react';
import {Feature, Polygon} from 'geojson';
import ReactLeafletCanvasDataLayer from './ReactLeafletCanvasDataLayer';
import {GridLayerOptions, LatLngExpression} from 'leaflet';
import {bbox} from '@turf/turf';
import {ContinuousLegend} from '../Legend';

interface IProps {
  title?: string;
  data: number[][];
  minVal: number;
  maxVal: number;
  rotation: number;
  outline: Feature<Polygon>
  getRgbColor: (value: number, minVal: number, maxVal: number) => string;
  onHover?: (value: number | null) => void;
  options?: GridLayerOptions;
}


const CanvasDataLayer = ({title, data, rotation, outline, getRgbColor, minVal, maxVal, options}: IProps) => {

  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const bounds: LatLngExpression[] | null = useMemo(() => {
    if (!outline) {
      return null;
    }

    const boundingBox = bbox(outline);
    return [[boundingBox[1], boundingBox[0]], [boundingBox[3], boundingBox[2]]];
  }, [outline]);


  if (!bounds) {
    return null;
  }

  return (
    <>
      <ReactLeafletCanvasDataLayer
        data={data}
        rotation={rotation}
        bounds={bounds}
        getRgbColor={(value: number) => getRgbColor(value, minVal, maxVal)}
        onHover={setHoveredValue}
        options={options}
      />
      <ContinuousLegend
        title={title}
        direction={'horizontal'}
        value={hoveredValue}
        minValue={minVal}
        maxValue={maxVal}
        getRgbColor={getRgbColor}
      />
    </>
  );
};

export default CanvasDataLayer;
