import './toggle.less';

import React from 'react';

interface IProps {
  value: boolean;
  onChange: (value: boolean) => void;
  labelUnchecked?: string;
  labelChecked?: string;
}

const Toggle = ({value, onChange, labelUnchecked, labelChecked}: IProps) => (
  <div style={{marginLeft: 10, marginRight: 10}}>
    <input
      type='checkbox'
      id='toggle'
      data-testid='toggle'
      className='toggleCheckbox'
      checked={value}
      onChange={(event) => onChange(event.target.checked)}
    />
    <label htmlFor="toggle" className='toggleContainer'>
      <div className='toggleSwitch'>{labelUnchecked}</div>
      <div className='toggleSwitch'>{labelChecked}</div>
    </label>
  </div>
);

export default Toggle;
