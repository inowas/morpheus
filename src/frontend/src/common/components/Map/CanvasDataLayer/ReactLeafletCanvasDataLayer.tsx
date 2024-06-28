import React, {useEffect, useState} from 'react';
import {useLeafletContext} from '@react-leaflet/core';
import LeafletCanvasDataLayer from './LeafletCanvasDataLayer';
import {GridLayerOptions, LatLngExpression} from 'leaflet';

interface IProps {
  data: number[][];
  rotation: number;
  bounds: LatLngExpression[];
  getRgbColor: (value: number) => string;
  onHover?: (value: number | null) => void;
  options?: GridLayerOptions;
}

const CanvasDataLayer = ({data, rotation, bounds, getRgbColor, onHover, options}: IProps) => {

  const context = useLeafletContext();

  const [layer, setLayer] = useState<LeafletCanvasDataLayer | null>(null);

  const handleHover = (value: number | null) => {
    if (onHover) {
      onHover(value);
    }
  };

  useEffect(() => {

    if (!data || !bounds) {
      return;
    }

    const nCols = data[0].length;
    const nRows = data.length;

    const scalingFactor = (200 < nCols + nRows) ? 1 : 10;
    const dataLayer = new LeafletCanvasDataLayer(data, bounds, rotation, getRgbColor, handleHover, scalingFactor, options);
    dataLayer.setData(data);
    const container = context.layerContainer || context.map;
    container.addLayer(dataLayer);
    setLayer(dataLayer);

    return () => {
      container.removeLayer(dataLayer);
    };
  }, []);

  useEffect(() => {
    if (layer) {
      layer.setData(data);
    }
  }, [data, rotation, bounds, getRgbColor, onHover]);

  useEffect(() => {
    if (layer) {
      layer.setOpacity(options?.opacity || 1);
    }
  }, [options?.opacity]);

  return null;
};

export default CanvasDataLayer;
