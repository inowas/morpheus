import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {Background, ChartT09E, InfoT09E, Parameters, SettingsT09E} from '../components/';
import {IT09E} from '../../types/T09.type';
import image from '../images/T09E.png';
import {Breadcrumb} from '../../../../components';
import {useCalculationsT09E, useNavigate, useTranslate} from '../../application';


const defaults: IT09E = {
  settings: {
    method: 'constFlux',
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
    max: 100,
    value: 20,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
    id: 'z0',
    name: 'Depth to base of aquifer<br/>z<sub>0</sub> [m]',
    min: 0,
    max: 100,
    value: 25,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 2,
    id: 'l',
    name: 'Distance to inland boundary<br/>L [m]',
    min: 0,
    max: 10000,
    value: 2000,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 3,
    id: 'w',
    name: 'Recharge rate<br/>w [m³/d]',
    min: 0,
    max: 0.001,
    value: 0.0001,
    stepSize: 0.0001,
    decimals: 4,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 4,
    id: 'dz',
    name: 'Sea level rise<br/>dz<sub>0</sub> [m]',
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
    order: 5,
    id: 'hi',
    name: 'Constant head boundary inland <br/>h<sub>i</sub> [m]',
    min: 0,
    max: 10,
    value: 2,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 6,
    id: 'i',
    name: 'Hydraulic gradient<br/>i [-]',
    min: 0,
    max: 0.01,
    value: 0.001,
    stepSize: 0.001,
    decimals: 3,
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

const tool = 'T09E';

const T09EContainer = () => {
  const [data, setData] = useState<IT09E>(defaults);
  const calculation = useCalculationsT09E();
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const handleChangeParameters = (parameters: IT09E['parameters']) => {
    setData((prevState) => ({
      ...prevState,
      parameters: [...parameters],
    }));
  };

  const handleChangeSettings = (settings: IT09E['settings']) => {
    setData((prevState) => ({...prevState, settings: {...settings}}));
  };
  const handleReset = () => {
    setData(defaults);
  };

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <div data-testid="t09e-container">
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
        <ChartT09E
          parameters={data.parameters}
          settings={data.settings}
          calculation={calculation}
        />
        <div>
          <SettingsT09E
            settings={data.settings}
            onChange={handleChangeSettings}
          />
          <InfoT09E
            parameters={data.parameters}
            settings={data.settings}
            calculation={calculation}
          />
        </div>
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </div>
  );
};

export default T09EContainer;
