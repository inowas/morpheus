import React, {useEffect, useState} from 'react';
import {Button, InfoTitle} from 'common/components';

interface IProps {
  value: number;
  onSubmit: (value: number) => void;
  readOnly: boolean;
  unit?: string;
  precision?: number;
}

const LayerPropertyValuesDefaultValue = ({value, onSubmit, readOnly, unit, precision = 2}: IProps) => {

  const [valueLocal, setValueLocal] = useState<number>(value);

  useEffect(() => {
    if (value !== valueLocal) {
      setValueLocal(value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);


  return (
    <>
      <InfoTitle
        title={`Constant value ${unit ? `(${unit.split('').join('')})` : ''}`}
        description='You can provide a default value for the specified property for the whole layer.'
        style={{marginBottom: 0}}
      />
      <input
        type="number"
        value={valueLocal}
        onChange={(e) => setValueLocal(Math.round(parseFloat(e.target.value) * Math.pow(10, precision || 0)) / Math.pow(10, precision || 0))}
        disabled={readOnly}
        step={Math.pow(10, -1 * (precision || 0))}
        style={{
          width: '110px',
          textAlign: 'end',
          backgroundColor: '#f5f5f7',
        }}
      />
      {!readOnly && valueLocal !== value && (
        <Button
          onClick={() => onSubmit(valueLocal)}
          primary={true}
          labelPosition={'left'}
          size={'tiny'}
          icon={'save'}
          content={'Save'}
        />
      )
      }
    </>
  )
  ;
};

export default LayerPropertyValuesDefaultValue;
