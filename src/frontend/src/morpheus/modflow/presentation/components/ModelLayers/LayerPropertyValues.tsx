import React, {useEffect, useState} from 'react';
import {IChangeLayerPropertyValues, ILayerPropertyData, ILayerPropertyValues} from '../../../types/Layers.type';
import isEqual from 'lodash.isequal';
import {ISpatialDiscretization} from '../../../types';
import AssetsModalContainer from '../../containers/AssetsModalContainter';
import LayerPropertyValuesMap from './LayerPropertyValuesMap';
import {GeoJSON} from 'geojson';
import LayerPropertyValuesDefaultValue from './LayerPropertyValuesDefaultValue';
import LayerPropertyValuesRaster from './LayerPropertyValuesRaster';
import LayerPropertyValuesZones from './LayerPropertyValuesZones';
import {DataRow} from 'common/components';

interface IProps {
  fetchLayerPropertyData?: () => Promise<ILayerPropertyData | null>;
  fetchLayerPropertyImage?: () => Promise<{ imageUrl: string, colorbarUrl: string } | null>;
  spatialDiscretization: ISpatialDiscretization;
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
  fetchLayerPropertyData,
}: IProps) => {

  const [layerPropertyValuesLocal, setLayerPropertyValuesLocal] = useState<ILayerPropertyValues | null>(values);
  const [layerPropertyData, setLayerPropertyData] = useState<ILayerPropertyData | null>(null);
  const [showFileUploadModal, setShowFileUploadModal] = useState<'raster' | 'shapefile' | false>(false);

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

  const renderMapContent = () => {
    if (layerPropertyData) {
      return <LayerPropertyValuesMap data={layerPropertyData} colorMap={'gist_earth'}/>;
    }
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

      {renderMapContent()}
      {renderOptionalFileUploadModal()}
    </>
  );
};

export default LayerPropertyValues;
