import React, {useEffect, useState} from 'react';
import {Button, InfoTitle} from 'common/components';
import {IChangeLayerPropertyValues, ILayerPropertyValueRaster} from '../../../types/Layers.type';
import AssetsModalContainer from '../../containers/AssetsModalContainter';

interface IProps {
  value: ILayerPropertyValueRaster['reference'] | undefined;
  onSubmit: (rasterReference: IChangeLayerPropertyValues['rasterReference']) => void;
  readOnly: boolean;
}

const LayerPropertyValuesRaster = ({value, onSubmit, readOnly}: IProps) => {

  const [valueLocal, setValueLocal] = useState<ILayerPropertyValueRaster['reference'] | undefined>(undefined);
  const [showFileUploadModal, setShowFileUploadModal] = useState<boolean>(false);

  useEffect(() => {
    if (value !== valueLocal) {
      setValueLocal(value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSelectRasterFile = (assetId: string, band: number = 0) => onSubmit({asset_id: assetId, band: band});

  const rasterIsDefined = value?.asset_id && valueLocal?.asset_id == value?.asset_id;

  const renderButtons = () => {
    if (rasterIsDefined) {
      return (
        <Button
          size={'tiny'}
          icon={'trash'}
          color={'red'}
          content={'Delete'}
          onClick={() => onSubmit(null)}
          disabled={readOnly}
        />
      );
    }

    return (
      <Button
        size={'tiny'}
        icon={'upload'}
        content={'Choose file'}
        onClick={() => setShowFileUploadModal(true)}
        disabled={readOnly}
      />
    );
  };

  return (
    <>
      <InfoTitle
        title='Upload raster'
        description='You can upload a raster file to provide values for the specified property for each cell of the model.'
        style={{marginBottom: 0}}
      />
      {renderButtons()}
      {showFileUploadModal && <AssetsModalContainer onClose={() => setShowFileUploadModal(false)} onSelectRasterFile={handleSelectRasterFile}/>}
    </>
  );
};

export default LayerPropertyValuesRaster;
