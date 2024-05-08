import React, {useEffect, useState} from 'react';
import {Button, InfoTitle} from 'common/components';
import {IChangeLayerPropertyValues, ILayerPropertyValueZone} from '../../../types/Layers.type';
import AssetsModalContainer from '../../containers/AssetsModalContainter';
import {FeatureCollection, MultiPolygon, Polygon} from 'geojson';

interface IProps {
  zones: ILayerPropertyValueZone[];
  onSubmit: (zones: IChangeLayerPropertyValues['zones']) => void;
  readOnly: boolean;
  style?: React.CSSProperties;
}

interface INewZone {
  geometry: Polygon | MultiPolygon;
  value: number;
}

const LayerPropertyValuesZones = ({zones, onSubmit, readOnly, style = {}}: IProps) => {

  const [existingZones, setExistingZones] = useState<ILayerPropertyValueZone[]>([]);
  const [newZones, setNewZones] = useState<INewZone[]>([]);
  const [showFileUploadModal, setShowFileUploadModal] = useState<boolean>(false);

  useEffect(() => {
    setExistingZones(zones);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones]);

  const handleSelectShapeFile = (assetId: string, data: FeatureCollection) => {
    const zonesToAdd = [...newZones];

    data.features.forEach((feature) => {
      if (!feature.geometry) {
        return;
      }

      if (['Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
        zonesToAdd.push({
          geometry: feature.geometry as Polygon | MultiPolygon,
          value: 1,
        });
      }
    });

    setNewZones(zonesToAdd);
    setShowFileUploadModal(false);
  };

  const handleSubmitClick = () => {
    onSubmit([...existingZones, ...newZones]);
    setNewZones([]);
  };

  const handleRemoveAllZonesClick = () => {
    onSubmit(null);
    setNewZones([]);
  };

  const renderButtons = () => {
    if (readOnly) {
      return null;
    }

    if (zones !== existingZones || 0 < newZones.length) {
      return (
        <button onClick={handleSubmitClick}>
          Save
        </button>
      );
    }

    if (0 < existingZones.length || 0 < newZones.length) {
      return (
        <button onClick={handleRemoveAllZonesClick}>
          Remove all zones
        </button>
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
        icon={'upload'}
        color={'blue'}
        onClick={() => setShowFileUploadModal(true)}
      />


      {0 === existingZones.length && 0 === newZones.length && <div>No zones specified</div>}

      {renderButtons()}

      {showFileUploadModal && <AssetsModalContainer onClose={() => setShowFileUploadModal(false)} onSelectShapefile={handleSelectShapeFile}/>}
    </div>
  );
};

export default LayerPropertyValuesZones;
