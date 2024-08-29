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
}

interface INewZone {
  name: string;
  geometry: Polygon | MultiPolygon;
  value: number;
}

const LayerPropertyValuesZones = ({zones: existingZones, onSubmit, readOnly}: IProps) => {

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
          labelPosition={'left'}
          size={'tiny'}
          icon={'save'}
          content={'Save'}
          onClick={() => {
            onSubmit(zones);
          }}
        />
      );
    }
  };

  return (
    <>
      <InfoTitle
        title='Zones'
        description='You can upload or draw Polygones on map to provide one value for a specific area.'
        style={{marginBottom: 0}}
      />
      <Button
        onClick={() => setShowFileUploadModal(true)}
        labelPosition={'left'}
        size={'tiny'}
        icon={'file'}
        content={'Upload file'}
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
    </>
  );
};

export default LayerPropertyValuesZones;
