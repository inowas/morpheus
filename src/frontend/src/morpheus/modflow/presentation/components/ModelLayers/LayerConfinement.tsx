import React, {useEffect, useState} from 'react';
import {InfoTitle} from 'common/components';
import {ILayer} from '../../../types/Layers.type';

interface IProps {
  layerType: ILayer['type'];  // 'confined' | 'convertible' | 'unconfined';
  onSubmit: (layerType: ILayer['type']) => void;
  readOnly: boolean;
}

const LayerConfinement = ({layerType, onSubmit, readOnly}: IProps) => {

  const [layerTypeLocal, setLayerTypeLocal] = useState<ILayer['type']>(layerType);

  useEffect(() => {
    setLayerTypeLocal(layerType);
  }, [layerType]);

  return (
    <>
      <InfoTitle
        title='Layer confinement'
        description='A confined layer is a layer that is confined by impermeable layers above and below. A convertible layer is a layer that can be converted to a confined layer by setting the vertical conductance to zero.'
      />
      <div>
        <input
          type="radio"
          checked={'confined' === layerTypeLocal}
          onChange={() => setLayerTypeLocal('confined')}
          disabled={readOnly}
        />
        <label>Confined</label>
      </div>
      <div>
        <input
          type="radio"
          checked={'convertible' === layerTypeLocal}
          onChange={() => setLayerTypeLocal('convertible')}
          disabled={readOnly}
        />
        <label>Convertible</label>
      </div>
      {layerTypeLocal !== layerType && !readOnly && (
        <button onClick={() => onSubmit(layerTypeLocal)}>Save</button>
      )}
    </>
  );
};

export default LayerConfinement;
