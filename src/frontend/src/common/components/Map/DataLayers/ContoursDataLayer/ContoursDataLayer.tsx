import React, {useMemo, useState} from 'react';
import {Feature, Polygon} from 'geojson';
import {contours} from 'd3-contour';
import {bbox, transformRotate, centerOfMass} from '@turf/turf';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import {ContinuousLegend} from '../Legend';
import {ISelection} from '../types';
import HoverDataLayer from '../HoverDataLayer';

interface IProps {
  title: string;
  data: number[][];
  rotation: number;
  outline: Feature<Polygon>;
  getRgbColor: (value: number) => string;
  numberOfGrades?: number;
  minVal: number;
  maxVal: number;
  onClick?: (selection: ISelection | null) => void;
  onHover?: (selection: ISelection | null) => void;
}

const ContoursDataLayer = ({data, rotation, outline, getRgbColor, onHover, numberOfGrades = 50, title, maxVal, minVal, onClick}: IProps) => {

  const [selection, setSelection] = useState<ISelection | null>(null);

  const handleHover = (selected: ISelection | null) => {
    setSelection(selected);
    if (onHover) {
      onHover(selected);
    }
  };

  const handleClick = (selected: ISelection | null) => {
    if (onClick) {
      onClick(selected);
    }
  };

  const contourMultiPolygons = useMemo(() => {
    const contoursFunction = contours().size([data[0].length, data.length]).thresholds(numberOfGrades);

    // rotate grid outline
    const centerOfMassOutline = centerOfMass(outline);
    const normalizedOutline = transformRotate(outline, rotation, {pivot: centerOfMassOutline});
    const normalizedOutlineBBox = bbox(normalizedOutline);
    const [xMin, yMin, xMax, yMax] = normalizedOutlineBBox;

    const multiPolygons = contoursFunction(data.reduce((acc, row) => acc.concat(row), []));
    const cellSizeX = (xMax - xMin) / data[0].length;
    const cellSizeY = (yMax - yMin) / data.length;

    return multiPolygons.filter(mp => 0 < mp.coordinates.length).map((mp) => {
      mp.coordinates = mp.coordinates.map(coordinates => coordinates.map(positions => positions.map(([x, y]) => {
        x = xMin + (x * cellSizeX);
        y = yMax - (y * cellSizeY);
        return [x, y];
      })));

      return transformRotate(mp, -rotation, {mutate: true, pivot: centerOfMassOutline});
    });

  }, [data, rotation, outline]);

  return (
    <FeatureGroup key={'contourLayer'}>
      {contourMultiPolygons.map((mp, key) => {
        return (
          <GeoJSON
            key={JSON.stringify(mp) + key}
            data={mp}
            pmIgnore={true}
            pathOptions={{
              fillOpacity: .5,
              weight: .25,
              opacity: 1,
              color: getRgbColor(mp.value),
              fillColor: getRgbColor(mp.value),
            }}
          />
        );
      })}
      <ContinuousLegend
        title={title}
        direction={'horizontal'}
        value={selection ? selection.value : null}
        minValue={minVal}
        maxValue={maxVal}
        getRgbColor={getRgbColor}
      />
      <HoverDataLayer
        data={data}
        rotation={rotation}
        outline={outline}
        onHover={handleHover}
        onClick={handleClick}
      />
    </FeatureGroup>
  );
};

export default ContoursDataLayer;
