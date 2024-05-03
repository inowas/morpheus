import React, {useEffect, useState} from 'react';
import {IChangeLayerPropertyValues, ILayerPropertyValues} from '../../../types/Layers.type';
import {Button, InfoTitle} from 'common/components';
import isEqual from 'lodash.isequal';
import {ISpatialDiscretization} from '../../../types';
import {FeatureGroup, ImageOverlay} from 'react-leaflet';
import Legend from './Legend';
import AssetsModalContainer from '../../containers/AssetsModalContainter';

interface IProps {
  fetchLayerPropertyImage?: () => Promise<{ imageUrl: string, colorbarUrl: string } | null>;
  spatialDiscretization: ISpatialDiscretization;
  values: ILayerPropertyValues | null;
  onSubmitDefaultValueChange: (value: IChangeLayerPropertyValues['defaultValue']) => void;
  onSubmitRasterReferenceChange: (raster: IChangeLayerPropertyValues['rasterReference']) => void;
  onSubmitZoneChange?: (zones: IChangeLayerPropertyValues['zones']) => void;
  unit?: string;
  readOnly: boolean;
}

const LayerPropertyValues = ({spatialDiscretization, values, onSubmitDefaultValueChange, onSubmitRasterReferenceChange, readOnly, unit, fetchLayerPropertyImage}: IProps) => {

  const [layerPropertyValuesLocal, setLayerPropertyValuesLocal] = useState<ILayerPropertyValues | null>(values);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [colorbarUrl, setColorbarUrl] = useState<string | null>(null);
  const [showRasterFileUploadModal, setShowRasterFileUploadModal] = useState<boolean>(false);

  useEffect(() => {
    if (values && !isEqual(values, layerPropertyValuesLocal)) {
      setLayerPropertyValuesLocal(values);
    }

    if (fetchLayerPropertyImage) {
      fetchLayerPropertyImage().then((data) => {
        if (data) {
          setImgUrl(data.imageUrl);
          setColorbarUrl(data.colorbarUrl);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const renderMapContent = () => {
    const [[xMin, yMin], [xMax, yMax]] = spatialDiscretization.grid.bounding_box;
    return (
      <FeatureGroup>
        {spatialDiscretization.geometry && imgUrl && (
          <ImageOverlay
            url={imgUrl}
            bounds={[[yMin, xMin], [yMax, xMax]]}
            opacity={0.5}
          />
        )}
        {colorbarUrl && <Legend colorbarUrl={colorbarUrl}/>}
      </FeatureGroup>
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
