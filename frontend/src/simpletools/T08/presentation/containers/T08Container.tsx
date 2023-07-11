import React, {useState} from 'react';
import {IT08} from '../../types/T08.type';
import {Background, Chart, Info, Parameters, Settings} from '../components';
import SimpleToolGrid from 'components/SimpleToolGrid';
import image from '../images/T08.png';

export const SETTINGS_CASE_FIXED_TIME: number = 1;
export const SETTINGS_CASE_VARIABLE_TIME: number = 2;
export const SETTINGS_INFILTRATION_ONE_TIME: number = 1;
export const SETTINGS_INFILTRATION_CONTINUOUS: number = 2;

const defaults: IT08 = {
  // FIXME npm i uuidv4 (id: uuidv4())
  id: '123',
  name: 'New simple tool',
  description: 'Simple tool description',
  permissions: 'rwx',
  public: false,
  tool: 'T08',
  //FIXME  inputType, label, parseValue
  data: {
    parameters: [{
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 0,
      id: 'C0',
      name: 'Initial solute concentration<br/><em>C</em><sub>0</sub> [mg/l]',
      min: 0.0,
      max: 1000.0,
      value: 100,
      stepSize: 0.01,
      type: 'float',
      decimals: 3,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 1,
      id: 'x',
      name: 'Distance from injection point<br/><em>x</em> [m]',
      min: 0,
      max: 100,
      value: 10,
      stepSize: 1,
      type: 'int',
      decimals: 2,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 2,
      id: 't',
      name: 'Time since injection<br/><em>t</em> [d]',
      min: 0,
      max: 500,
      value: 365,
      stepSize: 1,
      type: 'int',
      decimals: 0,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 3,
      id: 'K',
      name: 'Hydraulic conductivity<br/><em>K</em> [m/d]',
      min: 1e-2,
      max: 1e+2,
      value: 2.592,
      stepSize: 0.001,
      type: 'float',
      decimals: 3,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 4,
      id: 'I',
      name: 'Hydraulic gradient<br/><em>I</em> [-]',
      min: 0,
      max: 0.01,
      value: 0.002,
      stepSize: 0.001,
      type: 'float',
      decimals: 3,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 5,
      id: 'ne',
      name: 'Effective porosity<br/><em>n</em> [-]',
      min: 0,
      max: 0.5,
      value: 0.23,
      stepSize: 0.01,
      type: 'float',
      decimals: 2,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 6,
      id: 'rhoS',
      name: 'Particle density<br/><em>ρ</em> [g/cc]',
      min: 0,
      max: 3.00,
      value: 2.65,
      stepSize: 0.01,
      type: 'float',
      decimals: 2,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 7,
      id: 'alphaL',
      name: 'Longitudinal dispersivity<br/><em>α</em> [m]',
      min: 0.1,
      max: 10,
      value: 0.923,
      stepSize: 0.001,
      type: 'float',
      decimals: 3,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 8,
      id: 'Kd',
      name: 'Sorption partition coefficient<br/><em>K</em><sub>d</sub> [l/g]',
      min: 0.0,
      max: 0.1,
      value: 0.0,
      stepSize: 0.001,
      type: 'float',
      decimals: 3,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 9,
      id: 'tau',
      name: 'Duration of infiltration<br/><em>τ</em> [d]',
      min: 0,
      max: 500,
      value: 100,
      stepSize: 1,
      type: 'int',
      decimals: 0,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 10,
      id: 'Corg',
      name: 'Soil organic carbon content<br/><em>C</em><sub>org</sub> [-]',
      min: 0,
      max: 0.1,
      value: 0.001,
      stepSize: 0.001,
      type: 'float',
      decimals: 3,
    }, {
      inputType: 'SLIDER',
      label: '',
      parseValue: parseFloat,
      order: 11,
      id: 'Kow',
      name: 'Octanol/water partition coefficient, log <em>K</em><sub>ow</sub> [-]',
      min: 0,
      max: 10,
      value: 2.25,
      stepSize: 0.001,
      type: 'float',
      decimals: 3,
    }],
    settings: {
      retardation: true,
      case: SETTINGS_CASE_FIXED_TIME,
      infiltration: SETTINGS_INFILTRATION_CONTINUOUS,
    },
  },
};

const T08 = () => {
  const [data, setData] = useState<IT08>(defaults);
  const handleChangeSettings = (settings: IT08['data']['settings']) => {
    setData((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        settings: {...settings},
      },
    }));
  };

  const handleChangeParameters = (parameters: IT08['data']['parameters']) => {
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

export default T08;
