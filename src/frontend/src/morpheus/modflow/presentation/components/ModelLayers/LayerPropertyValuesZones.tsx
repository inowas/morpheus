import React, {useEffect, useState} from 'react';
import {Button, InfoTitle} from 'common/components';
import {IChangeLayerPropertyValues, ILayerPropertyValueZone} from '../../../types/Layers.type';
import AssetsModalContainer from '../../containers/AssetsModalContainter';
import {FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import LayerPropertyValuesZonesList from './LayerPropertyValuesZonesList';
import LayerPropertyValuesZonesMap from './LayerPropertyValuesZonesMap';
import isEqual from 'lodash.isequal';

interface IProps {
  zones: ILayerPropertyValueZone[];
  onSubmit: (zones: IChangeLayerPropertyValues['zones']) => void;
  readOnly: boolean;
  style?: React.CSSProperties;
}

interface INewZone {
  name: string;
  geometry: Polygon | MultiPolygon;
  value: number;
}

const LayerPropertyValuesZones = ({zones: existingZones, onSubmit, readOnly, style = {}}: IProps) => {

  const [zones, setZones] = useState<Array<ILayerPropertyValueZone | INewZone>>(existingZones);
  const [showFileUploadModal, setShowFileUploadModal] = useState<boolean>(false);

  useEffect(() => {
    setZones(existingZones);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingZones]);

  const handleSelectShapeFile = (assetId: string, data: FeatureCollection) => {
    const zonesToAdd: INewZone[] = [];

    data.features.forEach((feature, idx) => {
      if (!feature.geometry) {
        return;
      }

      if (['Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
        zonesToAdd.push({
          name: feature.properties?.name || `New Zone ${idx + 1}`,
          geometry: feature.geometry as Polygon | MultiPolygon,
          value: 1,
        });
      }
    });

    setZones([...zones, ...zonesToAdd]);
    onSubmit([...zones, ...zonesToAdd]);
    setShowFileUploadModal(false);
  };

  const renderSubmitButton = () => {
    if (!readOnly && !isEqual(existingZones, zones)) {
      return (
        <Button
          size={'tiny'}
          onClick={() => onSubmit(zones)}
          floated={'right'}
          content={'Submit'}
        />
      );
    }
  };

  return (
    <div style={{...style}}>
      <InfoTitle
        title='Zones'
        description='You can upload or draw Polygones on map to provide one value for a specific area.'
      />

      <Button
        size={'tiny'}
        color={'blue'}
        onClick={() => setShowFileUploadModal(true)}
        content={'Upload Shapefile'}
      />

      <LayerPropertyValuesZonesList
        zones={zones}
        onChange={setZones}
        precision={2}
        readOnly={readOnly}
      />

      {renderSubmitButton()}

      <LayerPropertyValuesZonesMap
        zones={zones}
        onChange={setZones}
        readOnly={readOnly}
      />

      {showFileUploadModal && !readOnly && <AssetsModalContainer onClose={() => setShowFileUploadModal(false)} onSelectShapefile={handleSelectShapeFile}/>}
    </div>
  );
};

export default LayerPropertyValuesZones;
