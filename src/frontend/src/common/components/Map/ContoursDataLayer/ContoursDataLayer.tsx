import React, {useEffect, useMemo, useState} from 'react';
import {Feature, Polygon} from 'geojson';
import {contours} from 'd3-contour';
import {bbox, transformRotate, centerOfMass} from '@turf/turf';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import Legend from '../Legend';

interface IProps {
  data: number[][];
  rotation: number;
  outline: Feature<Polygon>;
  getRgbColor: (value: number) => string;
  onHover?: (value: number | null) => void;
  numberOfGrades?: number;
}

const ContoursDataLayer = ({data, rotation, outline, getRgbColor, onHover, numberOfGrades = 50}: IProps) => {

  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (onHover) {
      onHover(value);
    }
    // eslint-disable-next-line
  }, [value]);

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
            onEachFeature={(feature, layer) => {
              layer.on('mouseover', () => setValue(mp.value));
              layer.on('mouseout', () => setValue(null));
            }}
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
      <Legend
        direction={'horizontal'}
        value={value}
        grades={contourMultiPolygons.map(mp => mp.value)}
        getRgbColor={(v) => getRgbColor(v)}
      />
    </FeatureGroup>
  );
};

export default ContoursDataLayer;