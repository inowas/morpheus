import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {Background, ChartT09D, InfoT09D, Parameters, SettingsT09D} from '../components/';
import {IT09D} from '../../types/T09.type';
import image from '../images/T09D.png';


const defaults: IT09D = {
  settings: {
    AqType: 'unconfined',
  },
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'k',
    name: 'Hydraulic conductivity<br/>K [m/d]',
    min: 1,
    validMin: x => 0 < x,
    max: 100,
    value: 50,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
    id: 'b',
    name: 'Aquifer thickness below sea level<br/>b [m]',
    min: 10,
    validMin: x => 0 < x,
    max: 100,
    value: 20,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 2,
    id: 'q',
    name: 'Offshore discharge rate<br/>q [m³/d]',
    min: 0.1,
    validMin: x => 0 < x,
    max: 10,
    value: 1,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 3,
    id: 'Q',
    name: 'Well pumping rate<br/>Q [m³/d]',
    min: 0,
    validMin: x => 0 <= x,
    max: 10000,
    value: 5000,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 4,
    id: 'xw',
    name: 'Distance from well to shoreline<br/>x<sub>w</sub> [m]',
    min: 1000,
    validMin: x => 0 < x,
    max: 5000,
    value: 2000,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 5,
    id: 'rhof',
    name: 'Density of freshwater<br/>ρ<sub>f</sub> [g/cm³]',
    min: 0.9,
    validMin: x => 0.9 <= x,
    max: 1.03,
    validMax: x => 1.05 >= x,
    value: 1,
    stepSize: 0.001,
    decimals: 3,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 6,
    id: 'rhos',
    name: 'Density of saltwater<br/>ρ<sub>s</sub> [g/cm³]',
    min: 0.9,
    validMin: x => 0.9 <= x,
    max: 1.03,
    validMax: x => 1.05 >= x,
    value: 1.025,
    stepSize: 0.001,
    decimals: 3,
  }],
};

const T09DContainer = () => {

  const [data, setData] = useState<IT09D>(defaults);
  const handleChangeParameters = (parameters: IT09D['parameters']) => {
    setData((prevState) => ({
      ...prevState,
      parameters: [...parameters],
    }));
  };

  const handleChangeSettings = (settings: IT09D['settings']) => {
    setData((prevState) => ({...prevState, settings: {...settings}}));
  };
  const handleReset = () => {
    setData(defaults);
  };

  return (
    <>
      <SimpleToolGrid rows={2}>
        <Background
          image={image}
          title={'T09D. Saltwater intrusion // Critical well discharge'}
        />
        <ChartT09D
          parameters={data.parameters}
        />
        <div>
          <SettingsT09D
            settings={data.settings}
            onChange={handleChangeSettings}
          />
          <InfoT09D parameters={data.parameters} settings={data.settings}/>
        </div>
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </>
  );
};

export default T09DContainer;