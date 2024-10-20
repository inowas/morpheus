import {Background, ChartT13B, InfoT13B, Parameters, SettingsT13B} from '../components';
import {IT13B, SETTINGS_SELECTED_NOTHING} from '../../types/T13.type';
import React, {useState} from 'react';
import {useShowBreadcrumbs, useTranslate} from '../../application';

import {Breadcrumb} from 'common/components';
import SimpleToolGrid from 'common/components/SimpleToolGrid';
import image from '../images/T13B.png';
import {useNavigate} from 'common/hooks';

const defaults: IT13B = {
  settings: {
    selected: SETTINGS_SELECTED_NOTHING,
  },
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'W',
    name: 'Average infiltration rate<br/>W [m/d]',
    min: 0.001,
    max: 0.01,
    value: 0.00112,
    stepSize: 0.0001,
    decimals: 5,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
    id: 'K',
    name: 'Hydraulic conductivity<br/>K [m/d]',
    min: 0.1,
    max: 1000,
    value: 30.2,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 2,
    id: 'L',
    name: 'Aquifer length<br/>L [m]',
    min: 0,
    max: 1000,
    value: 1000,
    stepSize: 10,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 3,
    id: 'hL',
    name: 'Downstream head<br/>h<sub>L</sub> [m]',
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
    order: 4,
    id: 'h0',
    name: 'Upstream head<br/>h<sub>e</sub> [m]',
    min: 0,
    max: 10,
    value: 5,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 5,
    id: 'ne',
    name: 'Effective porosity<br/>n [-]',
    min: 0,
    max: 0.5,
    value: 0.35,
    stepSize: 0.01,
    decimals: 2,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 6,
    id: 'xi',
    name: 'Initial position<br/>x<sub>i</sub> [m]',
    min: 0,
    max: 1000,
    value: 50,
    stepSize: 10,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 7,
    id: 'xe',
    name: 'Arrival location<br/>x<sub>e</sub> [m]',
    min: 1,
    max: 1000,
    value: 200,
    stepSize: 1,
    decimals: 0,
  }],
};

const tool = 'T13B';

const T13BContainer = () => {

  const [data, setData] = useState<IT13B>(defaults);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const showBreadcrumbs = useShowBreadcrumbs();

  const handleChangeParameters = (parameters: IT13B['parameters']) => {
    setData((prevState) => ({...prevState, parameters: [...parameters]}));
  };
  const handleChangeSettings = (settings: IT13B['settings']) => {
    setData((prevState) => ({...prevState, settings: {...settings}}));
  };

  const handleReset = () => {
    setData(defaults);
  };

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <>
      {showBreadcrumbs && <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: translate('T13_title'), link: '/tools/T13'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />}
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartT13B
          parameters={data.parameters} settings={data.settings}
        />
        <div>
          <SettingsT13B
            parameters={data.parameters} settings={data.settings}
            onChange={handleChangeSettings}
          />
          <InfoT13B parameters={data.parameters} settings={data.settings}/>
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

export default T13BContainer;
