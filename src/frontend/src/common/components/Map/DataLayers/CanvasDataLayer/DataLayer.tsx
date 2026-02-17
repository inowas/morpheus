import React, {useMemo, useState} from 'react';
import {Feature, Polygon} from 'geojson';
import {GridLayerOptions, LatLngBoundsExpression} from 'leaflet';
import {bbox} from '@turf/turf';
import {ContinuousLegend} from '../Legend';
import CanvasDataLayer from './CanvasDataLayer';
import {ISelection} from '../types';
import SelectedRowAndColLayer from '../SelectedRowAndColLayer';
import HoverGridLayer from '../HoverDataLayer';

interface IProps {
  title?: string;
  data: number[][];
  minValue: number;
  maxValue: number;
  rotation: number;
  outline: Feature<Polygon>
  getRgbColor: (value: number, minVal: number, maxVal: number) => string;
  onHover?: (selection: ISelection | null) => void;
  onClick?: (selection: ISelection | null) => void;
  options?: GridLayerOptions;
  selectRowsAndCols?: boolean;
}

const DataLayer = ({title, data, rotation, outline, getRgbColor, minValue, maxValue, options, onHover, onClick, selectRowsAndCols = true}: IProps) => {

  const [selection, setSelection] = useState<ISelection | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const handleHover = (selected: ISelection | null) => {

    if (null === selected || selected === undefined) {
      setHoveredValue(null);
    }

    if (selected && selected.row < data.length && selected.col < data[0].length) {
      setHoveredValue(data[selected.row][selected.col]);
    }

    if (onHover) {
      onHover(selected);
    }
  };

  const handleClick = (selected: ISelection | null) => {
    setSelection(selected);
    if (onClick) {
      onClick(selected);
    }
  };

  const bounds: LatLngBoundsExpression | null = useMemo(() => {
    if (!outline) {
      return null;
    }

    const boundingBox = bbox(outline);
    return [[boundingBox[1], boundingBox[0]], [boundingBox[3], boundingBox[2]]];
  }, [outline]);

  const minMaxValue = useMemo(() => {
    let min = minValue;
    let max = maxValue;

    if (min == max) {
      min = min - 1;
      max = max + 1;
    }

    min = min - (max - min) * 0.1;
    max = max + (max - min) * 0.1;

    return {min, max};
  }, [minValue, maxValue]);

  if (!bounds) {
    return null;
  }

  return (
    <>
      <CanvasDataLayer
        data={data}
        rotation={rotation}
        outline={outline}
        getRgbColor={(value: number) => getRgbColor(value, minMaxValue.min, minMaxValue.max)}
        options={options}
      />
      {selection && selectRowsAndCols && <SelectedRowAndColLayer
        nCols={data[0].length}
        nRows={data.length}
        selectedRow={selection.row}
        selectedCol={selection.col}
        outline={outline}
        rotation={rotation}
      />}
      <HoverGridLayer
        nCols={data[0].length}
        nRows={data.length}
        rotation={rotation}
        outline={outline.geometry}
        onHover={handleHover}
        onClick={handleClick}
      />
      <ContinuousLegend
        title={title}
        direction={'horizontal'}
        value={hoveredValue}
        minValue={minMaxValue.min}
        maxValue={minMaxValue.max}
        getRgbColor={getRgbColor}
      />
    </>
  );
};

export default DataLayer;
