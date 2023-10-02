import React, {useState} from 'react';
import SimpleToolGrid from '../../../../components/SimpleToolGrid';
import {Background, ChartT09A, InfoT09A, Parameters} from '../components';
import {IT09A} from '../../types/T09.type';
import image from '../images/T09A.png';
import {Breadcrumb} from '../../../../components';
import {useCalculationsT09A, useNavigate, useTranslate} from '../../application';

const defaults: IT09A = {
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'h',
    name: 'Freshwater thickness<br/>h [m]',
    min: 0,
    max: 10,
    value: 1,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
    id: 'df',
    name: 'Density of freshwater<br/>ρ<sub>f</sub> [g/cm³]',
    min: 0.9,
    validMin: x => 0.9 <= x,
    max: 1.03,
    validMax: x => 1.05 >= x,
    value: 1.000,
    stepSize: 0.001,
    decimals: 3,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 2,
    id: 'ds',
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

const tool = 'T09A';

const T09AContainer = () => {
  const [data, setData] = useState<IT09A>(defaults);
  const calculation = useCalculationsT09A();
  const navigateTo = useNavigate();
  const {translate} = useTranslate();

  const handleChangeParameters = (parameters: IT09A['parameters']) => {
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
    <div data-testid="t09a-container">
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: translate('T09_title'), link: '/tools/T09'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartT09A
          parameters={data.parameters}
          calculation={calculation}
        />
        <InfoT09A
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

export default T09AContainer;
