import React, {useEffect, useMemo, useState} from 'react';
import {ILayerPropertyData} from '../../../types/Layers.type';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import {contours} from 'd3-contour';
import {IColorMap, useColorMap} from 'common/hooks';

interface IProps {
  data: ILayerPropertyData;
  colorMap?: IColorMap;
  minValue?: number;
  maxValue?: number;
  precision?: number;
}

const LayerPropertyValuesMap = ({data, colorMap = 'gist_earth', minValue: minValueProp, maxValue: maxValueProp, precision = 2}: IProps) => {

  const {getRgbColor} = useColorMap(colorMap);

  const [minValue, setMinValue] = useState<number>(minValueProp || Math.round(data.min_value * Math.pow(10, precision)) / Math.pow(10, precision));
  const [maxValue, setMaxValue] = useState<number>(maxValueProp || Math.round(data.min_value * Math.pow(10, precision)) / Math.pow(10, precision));

  useEffect(() => {
    if (minValueProp) {
      setMinValue(minValueProp);
    }
    if (!minValueProp !== undefined) {
      setMinValue(Math.round(data.min_value * Math.pow(10, precision)) / Math.pow(10, precision));
    }

    if (maxValueProp) {
      setMaxValue(maxValueProp);
    }

    if (!maxValueProp !== undefined) {
      setMaxValue(Math.round(data.max_value * Math.pow(10, precision)) / Math.pow(10, precision));
    }
  }, [minValueProp, maxValueProp, data.min_value, data.max_value, precision]);


  const contourMultiPolygons = useMemo(() => {
    const contoursFunction = contours().size([data.n_cols, data.n_rows]);
    const {x_min: xMin, y_max: yMax} = data.bounds;
    // round min and max values to 5 decimal places

    if (minValue == maxValue) {
      contoursFunction.thresholds([minValue]);
    }

    const multiPolygons = contoursFunction(data.data.reduce((acc, row) => acc.concat(row), []));
    const cellSizeX = data.grid_width / data.n_cols;
    const cellSizeY = data.grid_height / data.n_rows;

    return multiPolygons.map((mp) => {
      mp.coordinates = mp.coordinates.map(coordinates => coordinates.map(positions => positions.map(([x, y]) => {
        x = xMin + (x * cellSizeX);
        y = yMax - (y * cellSizeY);
        return [x, y];
      })));

      return mp;
    });

  }, [data.bounds, data.data, data.grid_height, data.grid_width, data.n_cols, data.n_rows, maxValue, minValue]);


  return (
    <FeatureGroup key={'contourLayer'}>
      {contourMultiPolygons.map((mp, key) => (
        <GeoJSON
          key={JSON.stringify(mp) + key}
          data={mp}
          onEachFeature={(feature, layer) => {
            // @ts-ignore // Todo: Fix this later
            const value = feature.value as number || 'N/A';
            layer.on('click', () => layer.bindPopup(`Value: ${value}`).openPopup());
          }}
          pathOptions={{
            color: getRgbColor(mp.value, minValue, maxValue),
            opacity: 0,
            weight: 0,
          }}
        />
      ))}
    </FeatureGroup>
  );
};

export default LayerPropertyValuesMap;
