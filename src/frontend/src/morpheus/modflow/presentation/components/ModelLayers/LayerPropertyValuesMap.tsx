import React, {useEffect, useState} from 'react';
import {ILayerPropertyData} from '../../../types/Layers.type';
import {FeatureGroup} from 'react-leaflet';
import {IColorMap, useColorMap} from 'common/hooks';
import ContoursDataLayer from 'common/components/Map/ContoursDataLayer';

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

  return (
    <FeatureGroup key={'contourLayer'}>
      <ContoursDataLayer
        data={data.data}
        rotation={data.rotation}
        outline={data.outline}
        minVal={minValue}
        maxVal={maxValue}
        getRgbColor={getRgbColor}
      />
    </FeatureGroup>
  );
};

export default LayerPropertyValuesMap;
