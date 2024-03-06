import {Background, ChartT09C, InfoT09C, Parameters} from '../components';
import React, {useState} from 'react';
import {useCalculationsT09C, useNavigate, useShowBreadcrumbs, useTranslate} from '../../application';

import {Breadcrumb} from '../../../../components';
import {IT09C} from '../../types/T09.type';
import SimpleToolGrid from 'components/SimpleToolGrid';
import image from '../images/T09C.png';

const defaults: IT09C = {
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'q',
    name: 'Pumping rate<br/>Q [m³/d]',
    min: 1,
    validMin: function (x) {
      return 0 < x;
    },
    max: 3000,
    value: 2000,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
    id: 'k',
    name: 'Hydraulic conductivity<br/>K [m/d]',
    min: 1,
    validMin: function (x) {
      return 0 < x;
    },
    max: 100,
    validMax: function (x) {
      return 100000 >= x;
    },
    value: 50,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 2,
    id: 'd',
    name: 'Pre-pumping distance<br/>d [m]',
    min: 1,
    validMin: function (x) {
      return 0 < x;
    },
    max: 50,
    value: 30,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 3,
    id: 'df',
    name: 'Density of freshwater<br/>ρ<sub>f</sub> [g/cm³]',
    min: 0.9,
    validMin: function (x) {
      return 0.9 <= x;
    },
    max: 1.03,
    validMax: function (x) {
      return 1.05 >= x;
    },
    value: 1.000,
    stepSize: 0.001,
    decimals: 3,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 4,
    id: 'ds',
    name: 'Density of saltwater<br/>ρ<sub>s</sub> [g/cm³]',
    min: 0.9,
    validMin: function (x) {
      return 0.9 <= x;
    },
    max: 1.03,
    validMax: function (x) {
      return 1.05 >= x;
    },
    value: 1.025,
    stepSize: 0.001,
    decimals: 3,
  }],
};

const tool = 'T09C';

const T09CContainer = () => {
  const [data, setData] = useState<IT09C>(defaults);
  const calculation = useCalculationsT09C();
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const showBreadcrumbs = useShowBreadcrumbs();

  const handleChangeParameters = (parameters: IT09C['parameters']) => {
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
    <div data-testid="t09c-container">
      {showBreadcrumbs && <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: translate('T09_title'), link: '/tools/T09'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />}
      <SimpleToolGrid rows={2}>
        <Background
          image={image}
          title={title}
        />
        <ChartT09C
          parameters={data.parameters}
          calculation={calculation}
        />
        <InfoT09C
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

export default T09CContainer;
