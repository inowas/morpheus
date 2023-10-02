import React, {useState} from 'react';
import SimpleToolGrid from '../../../../components/SimpleToolGrid';
import {Background, ChartT09F, InfoT09F, Parameters} from '../components';
import {IT09F} from '../../types/T09.type';
import image from '../images/T09F.png';
import {Breadcrumb} from '../../../../components';
import {useCalculationsT09F, useNavigate, useTranslate} from '../../application';


const defaults: IT09F = {
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'dz',
    name: 'Sea level rise<br/>dz₀ [m]',
    min: 0,
    max: 2,
    value: 1,
    stepSize: 0.01,
    decimals: 2,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
    id: 'k',
    name: 'Hydraulic conductivity<br/>K [m/d]',
    min: 1,
    max: 100,
    value: 10,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 2,
    id: 'z0',
    name: 'Depth to base of aquifer<br/>z₀ [m]',
    min: 0,
    max: 100,
    value: 50,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 3,
    id: 'l',
    name: 'Distance to inland boundary<br/>L₀[m]',
    min: 0,
    max: 10000,
    value: 1000,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 4,
    id: 'w',
    name: 'Recharge rate<br/>w [m³/d]',
    min: 0,
    max: 0.002,
    value: 0.0014,
    stepSize: 0.0001,
    decimals: 4,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 5,
    id: 'theta',
    name: 'Slope of coastal aquifer<br/>theta [°]',
    min: 0,
    max: 90,
    value: 2,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 6,
    id: 'x',
    name: 'Distance from inland boundary<br/>x [m] ',
    min: 0,
    max: 2000,
    value: 500,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 7,
    id: 'df',
    name: 'Density of freshwater<br/>ρ<sub>f</sub> [g/cm³]',
    min: 1.000,
    max: 1.005,
    value: 1.000,
    stepSize: 0.001,
    decimals: 3,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 8,
    id: 'ds',
    name: 'Density of saltwater<br/>ρ<sub>s</sub> [g/cm³]',
    min: 1.020,
    max: 1.030,
    value: 1.025,
    stepSize: 0.001,
    decimals: 3,
  }],
};

const tool = 'T09F';

const T09FContainer = () => {
  const [data, setData] = useState<IT09F>(defaults);
  const calculation = useCalculationsT09F();
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const handleChangeParameters = (parameters: IT09F['parameters']) => {
    setData((prevState) => ({
      ...prevState,
      parameters: [...parameters],
    }));
  };
  const handleReset = () => {
    setData(defaults);
  };

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <div data-testid="t09f-container">
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: translate('T09_title'), link: '/tools/T09'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <SimpleToolGrid rows={2}>
        <Background
          image={image}
          title={title}
        />
        <ChartT09F
          parameters={data.parameters}
          calculation={calculation}
        />
        <InfoT09F
          parameters={data.parameters}
          calculation={calculation}
        />
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </div>
  );
};

export default T09FContainer;
