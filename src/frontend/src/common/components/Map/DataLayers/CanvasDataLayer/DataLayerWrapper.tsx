import React, {useMemo, useState} from 'react';
import {Feature, Polygon} from 'geojson';
import {GridLayerOptions, LatLngBoundsExpression} from 'leaflet';
import {bbox} from '@turf/turf';
import {ContinuousLegend} from '../Legend';
import DataLayer from './DataLayer';
import {ISelection} from '../types';
import SelectedRowAndColLayer from '../SelectedRowAndColLayer';
import HoverDataLayer from '../HoverDataLayer';

interface IProps {
  title?: string;
  data: number[][];
  minVal: number;
  maxVal: number;
  rotation: number;
  outline: Feature<Polygon>
  getRgbColor: (value: number, minVal: number, maxVal: number) => string;
  onHover?: (selection: ISelection | null) => void;
  onClick?: (selection: ISelection | null) => void;
  options?: GridLayerOptions;
}

const DataLayerWrapper = ({title, data, rotation, outline, getRgbColor, minVal, maxVal, options, onHover, onClick}: IProps) => {

  const [selection, setSelection] = useState<ISelection | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const handleHover = (selected: ISelection | null) => {
    setHoveredValue(selected?.value || null);
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

  if (!bounds) {
    return null;
  }

  return (
    <>
      <DataLayer
        data={data}
        rotation={rotation}
        outline={outline}
        getRgbColor={(value: number) => getRgbColor(value, minVal, maxVal)}
        options={options}
      />
      {selection && <SelectedRowAndColLayer
        nRows={data.length}
        nCols={data[0].length}
        selectedRow={selection.row}
        selectedCol={selection.col}
        outline={outline}
        rotation={rotation}
      />}
      <HoverDataLayer
        data={data}
        rotation={rotation}
        outline={outline}
        onHover={handleHover}
        onClick={handleClick}
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

export default DataLayerWrapper;
