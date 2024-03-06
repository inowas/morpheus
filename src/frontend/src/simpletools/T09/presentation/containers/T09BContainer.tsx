import {Background, ChartT09B, InfoT09B, Parameters} from '../components';
import React, {useState} from 'react';
import {useCalculationsT09B, useNavigate, useShowBreadcrumbs, useTranslate} from '../../application';

import {Breadcrumb} from '../../../../components';
import {IT09B} from '../../types/T09.type';
import SimpleToolGrid from 'components/SimpleToolGrid';
import image from '../images/T09B.png';

const defaults: IT09B = {
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'b',
    name: 'Aquifer thickness<br/>b [m]',
    min: 1,
    validMin: x => 0 < x,
    max: 100,
    value: 50,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
    id: 'i',
    name: 'Hydraulic gradient<br/>i [-]',
    min: 0.000,
    validMin: x => 0 <= x,
    max: 0.010,
    validMax: x => 1 >= x,
    value: 0.001,
    stepSize: 0.001,
    decimals: 3,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 2,
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
    order: 3,
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

const tool = 'T09B';

const T09AContainer = () => {
  const [data, setData] = useState<IT09B>(defaults);
  const calculation = useCalculationsT09B();
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const showBreadcrumbs = useShowBreadcrumbs();

  const handleChangeParameters = (parameters: IT09B['parameters']) => {
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
    <div data-testid="t09b-container">
      {showBreadcrumbs && <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: translate('T09_title'), link: '/tools/T09'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />}
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartT09B
          parameters={data.parameters}
          calculation={calculation}
        />
        <InfoT09B
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
