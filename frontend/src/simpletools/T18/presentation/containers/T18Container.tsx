import React, {useState} from 'react';
import {IT18} from '../../types/T18.type';
import {Background, Chart, Info, Parameters, Settings} from '../components';
import SimpleToolGrid from 'components/SimpleToolGrid';
import image from '../images/T18.png';
// import uuidv4 from 'uuid';

export const SETTINGS_INFILTRATION_TYPE_BASIN = 0.07;
export const SETTINGS_INFILTRATION_TYPE_CYLINDER = 0.02;


const defaults: IT18 = {
  // FIXME npm i uuidv4 (id: uuidv4())
  id: '123',
  name: 'New simple tool',
  description: 'Simple tool description',
  permissions: 'rwx',
  public: false,
  tool: 'T18',
  //FIXME  inputType, label, parseValue
  data: {
    settings: {
      AF: 0.07,
    },
    parameters: [{
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 0,
      id: 'LLRN',
      name: 'Limiting loading rates<br/>N (kg/m²/y)',
      min: 0,
      validMin: x => 0 <= x,
      max: 500,
      value: 67,
      stepSize: 1,
      type: 'int',
      decimals: 0,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 1,
      id: 'LLRO',
      name: 'Limiting loading rates<br/>BOD (kg/m²/y)',
      min: 0,
      validMin: x => 0 <= x,
      max: 1000,
      value: 667,
      stepSize: 1,
      type: 'int',
      decimals: 0,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 2,
      id: 'Q',
      name: 'Flow rate<br/>Q (million m³/y)',
      min: 0,
      validMin: x => 0 <= x,
      max: 30,
      value: 3.65,
      stepSize: 0.01,
      type: 'int',
      decimals: 2,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 3,
      id: 'IR',
      name: 'Infiltration rate<br/>I' + 'R'.sub() + '(m/y)',
      min: 0,
      validMin: x => 0 <= x,
      max: 1000,
      value: 438,
      stepSize: 1,
      type: 'int',
      decimals: 0,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 4,
      id: 'OD',
      name: 'No. operation days per year<br/>OD (d)',
      min: 0,
      validMin: x => 0 <= x,
      max: 365,
      validMax: x => 365 >= x,
      value: 365,
      stepSize: 1,
      type: 'int',
      decimals: 0,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 5,
      id: 'Cn',
      name: 'Nitrogen concentration<br/>C' + 'N'.sub() + '(mg/l)',
      min: 0,
      validMin: x => 0 <= x,
      max: 100,
      value: 40,
      stepSize: 1,
      type: 'int',
      decimals: 0,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 6,
      id: 'Co',
      name: 'Organic concentration<br/>C' + 'O'.sub() + '(BOD in mg/l)',
      min: 0,
      validMin: x => 0 <= x,
      max: 100,
      value: 100,
      stepSize: 1,
      type: 'int',
      decimals: 0,
    }],
  },
};

const T18 = () => {
  const [data, setData] = useState<IT18>(defaults);
  const handleChangeSettings = (settings: IT18['data']['settings']) => {
    setData((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        settings: {...settings},
      },
    }));
  };

  const handleChangeParameters = (parameters: IT18['data']['parameters']) => {
    setData((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        parameters: [...parameters],
      },
    }));
  };
  const handleReset = () => {
    setData(defaults);
  };

  return (
    <SimpleToolGrid rows={2}>
      <Background image={image} title={'T08: 1D transport equation (Ogata-Banks)'}/>
      <Chart
        settings={data.data.settings}
        parameters={data.data.parameters}
      />
      <div>
        <Settings settings={data.data.settings} onChange={handleChangeSettings}/>
        <Info parameters={data.data.parameters} settings={data.data.settings}/>
      </div>
      <Parameters
        parameters={data.data.parameters}
        onChange={handleChangeParameters}
        onReset={handleReset}
      />
    </SimpleToolGrid>
  );
};

export default T18;
