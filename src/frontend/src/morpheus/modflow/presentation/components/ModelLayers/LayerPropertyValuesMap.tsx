import React, {useEffect, useMemo, useState} from 'react';
import {ILayerPropertyData} from '../../../types/Layers.type';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import {contours} from 'd3-contour';
import {IColorMap, useColorMap} from 'common/hooks';
import Legend from './Legend';

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
  const [maxValue, setMaxValue] = useState<number>(maxValueProp || Math.round(data.max_value * Math.pow(10, precision)) / Math.pow(10, precision));
  const [value, setValue] = useState<number | null>(null);

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
      {contourMultiPolygons.map((mp, key) => {
        const rgbColor = getRgbColor(mp.value, minValue, maxValue);
        return (
          <GeoJSON
            key={JSON.stringify(mp) + key}
            data={mp}
            onEachFeature={(feature, layer) => {
              // @ts-ignore // Todo: Fix this later
              layer.on('mouseover', () => {
                setValue(mp.value);
                // Todo show this value in Legend
              });
              layer.on('mouseout', () => {
                setValue(null);
              });
            }}
            pmIgnore={true}
            pathOptions={{
              fillOpacity: .5,
              weight: .25,
              opacity: 1,
              color: rgbColor,
              fillColor: rgbColor,
            }}
          />
        );
      })}
      <Legend
        value={value}
        grades={contourMultiPolygons.map(mp => mp.value)}
        getRgbColor={(v) => getRgbColor(v, minValue, maxValue)}
      />
    </FeatureGroup>
  );
};

export default LayerPropertyValuesMap;
