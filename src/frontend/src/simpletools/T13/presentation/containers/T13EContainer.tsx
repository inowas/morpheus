import {Background, ChartT13E, InfoT13E, Parameters} from '../components';
import React, {useState} from 'react';
import {useShowBreadcrumbs, useTranslate} from '../../application';

import {Breadcrumb} from 'components';
import {IT13E} from '../../types/T13.type';
import SimpleToolGrid from 'components/SimpleToolGrid';
import image from '../images/T13E.png';
import {useNavigate} from 'common/hooks';

const defaults: IT13E = {
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'Qw',
    name: 'Constant pumped modflow rate<br/>Q<sub>w [m3/d]',
    min: 0,
    max: 10000,
    value: 1300,
    stepSize: 100,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
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
    order: 2,
    id: 'hL',
    name: 'Downstream head<br/>h<sub>L</sub> [m]',
    min: 0,
    max: 20,
    value: 6,
    stepSize: 0.5,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 3,
    id: 'h0',
    name: 'Upstream head<br/>h<sub>0</sub> [m]',
    min: 0,
    max: 20,
    value: 10,
    stepSize: 0.5,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 4,
    id: 'xi',
    name: 'Initial position<br/>x<sub>i</sub> [m]',
    min: 0,
    max: 1000,
    value: 303,
    stepSize: 10,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 5,
    id: 'x',
    name: 'Location of the well<br/>x [m]',
    min: 0,
    max: 1000,
    value: 0.1,
    stepSize: 10,
    decimals: 0,
  }],
};

const tool = 'T13E';

const T13EContainer = () => {

  const [data, setData] = useState<IT13E>(defaults);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const showBreadcrumbs = useShowBreadcrumbs();

  const handleChangeParameters = (parameters: IT13E['parameters']) => {
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
        <ChartT13E parameters={data.parameters}/>
        <InfoT13E parameters={data.parameters}/>
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </>
  );
};

export default T13EContainer;
