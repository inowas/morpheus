import React, {useEffect, useMemo, useState} from 'react';
import {IChangeLayerPropertyValues, ILayerPropertyData, ILayerPropertyValues} from '../../../types/Layers.type';
import {Button, InfoTitle} from 'common/components';
import isEqual from 'lodash.isequal';
import {ISpatialDiscretization} from '../../../types';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import AssetsModalContainer from '../../containers/AssetsModalContainter';
import {contours} from 'd3-contour';
import {useColorMap} from 'common/hooks';

interface IProps {
  fetchLayerPropertyData?: () => Promise<ILayerPropertyData | null>;
  fetchLayerPropertyImage?: () => Promise<{ imageUrl: string, colorbarUrl: string } | null>;
  spatialDiscretization: ISpatialDiscretization;
  values: ILayerPropertyValues | null;
  onSubmitDefaultValueChange: (value: IChangeLayerPropertyValues['defaultValue']) => void;
  onSubmitRasterReferenceChange: (raster: IChangeLayerPropertyValues['rasterReference']) => void;
  onSubmitZoneChange?: (zones: IChangeLayerPropertyValues['zones']) => void;
  unit?: string;
  readOnly: boolean;
}

const LayerPropertyValues = ({
  values,
  onSubmitDefaultValueChange,
  onSubmitRasterReferenceChange,
  readOnly,
  unit,
  fetchLayerPropertyData,
}: IProps) => {

  const [layerPropertyValuesLocal, setLayerPropertyValuesLocal] = useState<ILayerPropertyValues | null>(values);
  const [showRasterFileUploadModal, setShowRasterFileUploadModal] = useState<boolean>(false);

  const [layerPropertyData, setLayerPropertyData] = useState<ILayerPropertyData | null>(null);

  const contourMultiPolygons = useMemo(() => {
    if (!layerPropertyData) {
      return null;
    }

    const contoursFunction = contours().size([layerPropertyData.n_cols, layerPropertyData.n_rows]);
    const {x_min: xMin, y_max: yMax} = layerPropertyData.bounds;

    const multiPolygons = contoursFunction(layerPropertyData.data.reduce((acc, row) => acc.concat(row), []));

    const cellSizeX = layerPropertyData.grid_width / layerPropertyData.n_cols;
    const cellSizeY = layerPropertyData.grid_height / layerPropertyData.n_rows;

    return multiPolygons.map((mp) => {
      mp.coordinates = mp.coordinates.map(coordinates => coordinates.map(positions => positions.map(([x, y]) => {
        x = xMin + (x * cellSizeX);
        y = yMax - (y * cellSizeY);
        return [x, y];
      })));

      return mp;
    });

  }, [layerPropertyData]);

  const color = useColorMap('gist_earth');

  useEffect(() => {
    if (values && !isEqual(values, layerPropertyValuesLocal)) {
      setLayerPropertyValuesLocal(values);
    }

    if (fetchLayerPropertyData) {
      fetchLayerPropertyData().then((data) => {
        if (data) {
          setLayerPropertyData(data);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const renderMapContent = () => {
    return (
      <>
        <FeatureGroup>
          {layerPropertyData && contourMultiPolygons && contourMultiPolygons.map((mp, key) => {
            const rgbColor = color(layerPropertyData.min_value / layerPropertyData.max_value * mp.value);
            return (
              <GeoJSON
                key={key}
                data={mp}
                pathOptions={{
                  color: `rgb(${rgbColor.join(',')})`,
                  opacity: 0,
                  weight: 0,
                }}
              />
            );
          })}
        </FeatureGroup>
      </>
    );
  };

  const handleSelectRasterFile = (assetId: string, band: number = 0) => onSubmitRasterReferenceChange({asset_id: assetId, band: band});

  return (
    <>
      <div>
        <InfoTitle
          title='Zones'
          description='You can upload or draw Polygones on map to provide one value for a specific area.'
        />
        <div>No zones specified</div>
        <Button size={'tiny'}>Choose file</Button>
      </div>
      <div style={{marginTop: 20}}>
        <InfoTitle
          title='Raster'
          description='You can upload a raster file to provide values for the specified property for each cell of the model.'
        />

        {undefined !== layerPropertyValuesLocal?.raster?.reference?.asset_id && layerPropertyValuesLocal?.raster?.reference?.asset_id == values?.raster?.reference?.asset_id ? (
          <Button
            size={'tiny'}
            icon={'trash'}
            color={'red'}
            onClick={() => onSubmitRasterReferenceChange(null)}
          />
        ) : (
          <Button
            size={'tiny'}
            icon={'upload'}
            color={'blue'}
            onClick={() => setShowRasterFileUploadModal(true)}
          />
        )}

        {layerPropertyValuesLocal?.raster?.reference?.asset_id !== values?.raster?.reference?.asset_id && (
          <Button
            size={'tiny'}
            content={'Save Raster File'}
            onClick={() => {
              if (layerPropertyValuesLocal?.raster && onSubmitRasterReferenceChange) {
                onSubmitRasterReferenceChange(layerPropertyValuesLocal.raster.reference);
              }
            }}
          />
        )}

      </div>
      <div style={{marginTop: 20}}>
        <InfoTitle
          title='Layer default value'
          description='You can provide a default value for the specified property for the whole layer.'
        />
        <input
          type="number"
          value={layerPropertyValuesLocal?.value || 0}
          onChange={(e) => {
            if (layerPropertyValuesLocal) {
              setLayerPropertyValuesLocal({...layerPropertyValuesLocal, value: Number(e.target.value)});
            }
          }}
          disabled={readOnly}
        />{unit}
      </div>
      <div>
        {layerPropertyValuesLocal?.value !== values?.value && (
          <button onClick={() => onSubmitDefaultValueChange(layerPropertyValuesLocal?.value)}>
            Save
          </button>
        )}
      </div>

      {renderMapContent()}

      {showRasterFileUploadModal && (
        <AssetsModalContainer
          onClose={() => setShowRasterFileUploadModal(false)}
          onSelectRasterFile={handleSelectRasterFile}
        />
      )}
    </>
  );
};

export default LayerPropertyValues;
