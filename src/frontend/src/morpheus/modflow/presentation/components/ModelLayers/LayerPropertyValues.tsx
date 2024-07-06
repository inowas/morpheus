import React, {useEffect, useState} from 'react';
import {IChangeLayerPropertyValues, ILayerPropertyValues} from '../../../types/Layers.type';
import isEqual from 'lodash.isequal';
import AssetsModalContainer from '../../containers/AssetsModalContainter';
import {GeoJSON} from 'geojson';
import LayerPropertyValuesDefaultValue from './LayerPropertyValuesDefaultValue';
import LayerPropertyValuesRaster from './LayerPropertyValuesRaster';
import LayerPropertyValuesZones from './LayerPropertyValuesZones';
import {DataRow} from 'common/components';

interface IProps {
  values: ILayerPropertyValues | null;
  onSubmitDefaultValueChange: (value: IChangeLayerPropertyValues['defaultValue']) => void;
  onSubmitRasterReferenceChange: (raster: IChangeLayerPropertyValues['rasterReference']) => void;
  onSubmitZoneChange: (zones: IChangeLayerPropertyValues['zones']) => void;
  unit?: string;
  readOnly: boolean;
}

const LayerPropertyValues = ({
  values,
  onSubmitDefaultValueChange,
  onSubmitRasterReferenceChange,
  onSubmitZoneChange,
  readOnly,
  unit,
}: IProps) => {

  const [layerPropertyValuesLocal, setLayerPropertyValuesLocal] = useState<ILayerPropertyValues | null>(values);
  const [showFileUploadModal, setShowFileUploadModal] = useState<'raster' | 'shapefile' | false>(false);

  useEffect(() => {
    if (values && !isEqual(values, layerPropertyValuesLocal)) {
      setLayerPropertyValuesLocal(values);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);


  const handleSelectRasterFile = (assetId: string, band: number = 0) => onSubmitRasterReferenceChange({asset_id: assetId, band: band});
  const handleSelectShapeFile = (assetId: string, data: GeoJSON) => console.log('handleSelectShapeFile', assetId, data);

  const renderOptionalFileUploadModal = () => {
    if ('raster' === showFileUploadModal) {
      return (
        <AssetsModalContainer
          onClose={() => setShowFileUploadModal(false)}
          onSelectRasterFile={handleSelectRasterFile}
        />
      );
    }

    if ('shapefile' === showFileUploadModal) {
      return (
        <AssetsModalContainer
          onClose={() => setShowFileUploadModal(false)}
          onSelectShapefile={handleSelectShapeFile}
        />
      );
    }

    return null;
  };

  return (
    <>
      <DataRow>
        <LayerPropertyValuesZones
          zones={layerPropertyValuesLocal?.zones || []}
          onSubmit={onSubmitZoneChange}
          readOnly={readOnly}
        />
        <LayerPropertyValuesRaster
          value={layerPropertyValuesLocal?.raster?.reference}
          onSubmit={onSubmitRasterReferenceChange}
          readOnly={readOnly}
        />
        <LayerPropertyValuesDefaultValue
          value={layerPropertyValuesLocal?.value || 0}
          onSubmit={(value) => onSubmitDefaultValueChange(value)}
          readOnly={readOnly}
          unit={unit}
        />
      </DataRow>

      {renderOptionalFileUploadModal()}
    </>
  );
};

export default LayerPropertyValues;
