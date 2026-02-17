import React, {useEffect, useState} from 'react';
import {Button, DataRow, Form, InfoTitle} from 'common/components';
import {ILayerConfinement} from '../../../types/Layers.type';

interface IProps {
  layerType: ILayerConfinement;  // 'confined' | 'convertible' | 'unconfined';
  onSubmit: (layerType: ILayerConfinement) => void;
  readOnly: boolean;
}

const LayerConfinement = ({layerType, onSubmit, readOnly}: IProps) => {

  const [layerTypeLocal, setLayerTypeLocal] = useState<ILayerConfinement>(layerType);

  useEffect(() => {
    setLayerTypeLocal(layerType);
  }, [layerType]);

  return (
    <>
      <InfoTitle
        title='Layer confinement'
        description='A confined layer is a layer that is confined by impermeable layers above and below. A convertible layer is a layer that can be converted to a confined layer by setting the vertical conductance to zero.'
      />
      <DataRow style={{gap: '10px'}}>
        <Form.Radio
          checked={'confined' === layerTypeLocal}
          onChange={() => setLayerTypeLocal('confined')}
          disabled={readOnly}
          label={'Confined'}
        />
        <Form.Radio
          checked={'convertible' === layerTypeLocal}
          onChange={() => setLayerTypeLocal('convertible')}
          disabled={readOnly}
          label={'Convertible'}
        />
        {layerTypeLocal !== layerType && !readOnly && (
          <Button
            labelPosition={'left'}
            icon={'save'}
            size={'tiny'}
            onClick={() => onSubmit(layerTypeLocal)}
            content={'Save'}
          />
        )}
      </DataRow>
    </>
  );
};

export default LayerConfinement;
