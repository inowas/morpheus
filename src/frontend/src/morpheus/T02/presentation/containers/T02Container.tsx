import React, {useState} from 'react';
import {Background, ChartWrapper, Info, Parameters, Settings} from '../components';
import image from '../images/T02.png';
import {IT02} from '../../types/T02.type';
import {useCalculateMounding, useNavigate, useTranslate} from '../../application';
import {Breadcrumb} from '../../../../components';
import SimpleToolGrid from '../../../../components/SimpleToolGrid';

export const defaults: IT02 = {
  settings: {
    variable: 'x',
  },
  parameters: [{
    decimals: 3,
    id: 'w',
    inputType: 'SLIDER',
    label: '',
    max: 10,
    min: 0,
    name: 'Percolation rate<br/>w (m/d)',
    order: 0,
    stepSize: 0.001,
    type: 'float',
    validMin: (x: number) => 0 <= x,
    value: 0.045,
    parseValue: parseFloat,
  }, {
    decimals: 0,
    id: 'L',
    inputType: 'SLIDER',
    label: '',
    max: 1000,
    min: 0,
    name: 'Basin length<br/>L (m)',
    order: 1,
    stepSize: 1,
    type: 'float',
    validMin: (x: number) => 0 < x,
    value: 40,
    parseValue: parseFloat,
  }, {
    decimals: 0,
    id: 'W',
    inputType: 'SLIDER',
    label: '',
    max: 100,
    min: 0,
    name: 'Basin width<br/>W (m)',
    order: 2,
    stepSize: 1,
    type: 'float',
    validMin: (x: number) => 0 < x,
    value: 20,
    parseValue: parseFloat,
  }, {
    decimals: 0,
    id: 'hi',
    inputType: 'SLIDER',
    label: '',
    max: 100,
    min: 0,
    name: 'Initial groundwater Level<br/>h<sub>i</sub> (m)',
    order: 3,
    stepSize: 1,
    type: 'float',
    validMin: (x: number) => 0 <= x,
    value: 35,
    parseValue: parseFloat,
  }, {
    decimals: 3,
    id: 'Sy',
    inputType: 'SLIDER',
    label: '',
    max: 0.5,
    min: 0.000,
    name: 'Specific yield<br/>S<sub>y</sub> (-)',
    order: 4,
    stepSize: 0.001,
    type: 'float',
    validMin: (x: number) => 0 < x,
    validMax: (x: number) => 0.5 >= x,
    value: 0.085,
    parseValue: parseFloat,
  }, {
    decimals: 2,
    id: 'K',
    inputType: 'SLIDER',
    label: '',
    max: 10,
    min: 0.1,
    name: 'Hydraulic conductivity<br/>K (m/d)',
    order: 5,
    stepSize: 0.01,
    type: 'float',
    validMin: (x: number) => 0 < x,
    validMax: (x: number) => 100000 >= x,
    value: 1.83,
    parseValue: parseFloat,
  }, {
    decimals: 1,
    id: 't',
    inputType: 'SLIDER',
    label: '',
    max: 100,
    min: 0,
    name: 'Infiltration time<br/>t (d)',
    order: 6,
    stepSize: 0.1,
    type: 'float',
    validMin: (x: number) => 0 < x,
    value: 1.5,
    parseValue: parseFloat,
  }],
};

type IParameter = IT02['parameters'][0];

const tool = 'T02';

const T02 = () => {

  const [data, setData] = useState<IT02>(defaults);
  const mounding = useCalculateMounding();
  const navigateTo = useNavigate();
  const {translate} = useTranslate();

  const handleChangeParameters = (parameters: IParameter[]) => {
    setData((prevState) => ({...prevState, parameters: [...parameters]}));
  };

  const handleChangeSettings = (settings: IT02['settings']) => {
    setData((prevState) => ({...prevState, settings: {...settings}}));
  };

  const handleReset = () => {
    setData(defaults);
  };

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <div data-testid="t02-container">
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartWrapper
          settings={data.settings}
          parameters={data.parameters}
          mounding={mounding}
        />
        <div>
          <Settings settings={data.settings} onChange={handleChangeSettings}/>
          <Info parameters={data.parameters} mounding={mounding}/>
        </div>
        <Parameters
          debounce={500}
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </div>
  );
};

export default T02;
