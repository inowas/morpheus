import React, {useEffect, useState} from 'react';
import {InfoTitle} from 'common/components';

interface IProps {
  value: number;
  onSubmit: (value: number) => void;
  readOnly: boolean;
  unit?: string;
  precision?: number;
  style?: React.CSSProperties;
}

const LayerPropertyValuesDefaultValue = ({value, onSubmit, readOnly, unit, precision = 2, style = {}}: IProps) => {

  const [valueLocal, setValueLocal] = useState<number>(value);

  useEffect(() => {
    if (value !== valueLocal) {
      setValueLocal(value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);


  return (
    <div style={{...style}}>
      <div>
        <InfoTitle
          title='Layer default value'
          description='You can provide a default value for the specified property for the whole layer.'
        />
        <input
          type="number"
          value={valueLocal}
          onChange={(e) => setValueLocal(Math.round(parseFloat(e.target.value) * Math.pow(10, precision || 0)) / Math.pow(10, precision || 0))}
          disabled={readOnly}
          step={Math.pow(10, -1 * (precision || 0))}
        />{unit}
      </div>
      <div>
        {!readOnly && valueLocal !== value && (
          <button onClick={() => onSubmit(valueLocal)}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default LayerPropertyValuesDefaultValue;
