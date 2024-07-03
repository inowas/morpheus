import React, {useEffect, useMemo, useState} from 'react';
import {Feature, Polygon} from 'geojson';
import {GridLayerOptions, LatLngBoundsExpression, canvas} from 'leaflet';
import {bbox} from '@turf/turf';
import {ContinuousLegend, HoverDataLayer, ISelection} from '../Legend';
import {useMap} from 'react-leaflet';
import DataLayer from './DataLayer';

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

const DataLayerWrapper = ({title, data, rotation, outline, getRgbColor, minVal, maxVal, options}: IProps) => {

  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const bounds: LatLngBoundsExpression | null = useMemo(() => {
    if (!outline) {
      return null;
    }

    const boundingBox = bbox(outline);
    return [[boundingBox[1], boundingBox[0]], [boundingBox[3], boundingBox[2]]];
  }, [outline]);

  const dataCanvas = useMemo(() => {
    const precision = 10;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return canvas;
    }

    const nCols = data[0].length;
    const nRows = data.length;

    // Calculate the bounding box of the rotated rectangle
    const angle = rotation * Math.PI / 180;
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));

    const canvasWidth = (nCols * cos + nRows * sin) * precision;
    const canvasHeight = (nCols * sin + nRows * cos) * precision;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (rotation) {
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate(-rotation * Math.PI / 180);
      ctx.translate(-nCols * precision / 2, -nRows * precision / 2);
      ctx.save();
    }

    data.forEach((row: number[], nRow: number) => {
      row.forEach((value, nCol) => {
        const x = nCol * precision;
        const y = nRow * precision;
        ctx.fillStyle = null === value ? 'transparent' : getRgbColor(value, minVal, maxVal);
        ctx.fillRect(x, y, precision, precision);
      });
    });

    return canvas;
  }, [data, rotation]);


  if (!bounds) {
    return null;
  }

  return (
    <>
      <DataLayer
        data={data}
        rotation={rotation}
        outline={outline}
        minVal={minVal}
        maxVal={maxVal}
        getRgbColor={getRgbColor}
      />
      <ContinuousLegend
        title={title}
        direction={'horizontal'}
        value={hoveredValue}
        minValue={minVal}
        maxValue={maxVal}
        getRgbColor={getRgbColor}
      />
      <HoverDataLayer
        data={data}
        rotation={rotation}
        outline={outline}
        onHover={(value: ISelection | null) => setHoveredValue(value ? value.value : null)}
      />
    </>
  );
};

export default DataLayerWrapper;
