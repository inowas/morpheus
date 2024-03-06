import {Background, ChartT14A, InfoT14A, Parameters} from '../components';
import React, {useState} from 'react';
import {useShowBreadcrumbs, useTranslate} from '../../application';

import {Breadcrumb} from 'components';
import {IT14A} from '../../types/T14.type';
import SimpleToolGrid from 'components/SimpleToolGrid';
import image from '../images/T14A.png';
import {useNavigate} from 'common/hooks';

export const defaults: IT14A = {
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'Qw',
    name: 'Pumping rate<br/>Q' + 'w'.sub() + ' [m' + '3'.sup() + '/d]',
    min: 1,
    validMin: (x: number) => 0 < x,
    max: 1000,
    value: 150,
    stepSize: 1,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 1,
    id: 't',
    name: 'Duration of pumping<br/>t [d]',
    min: 1,
    validMin: (x: number) => 1 < x,
    max: 500,
    value: 365,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 2,
    id: 'S',
    name: 'Aquifer storage coefficient<br/>S [-]',
    min: 0.1,
    validMin: (x: number) => 0 < x,
    max: 0.5,
    validMax: (x: number) => 1 >= x,
    value: 0.2,
    stepSize: 0.001,
    decimals: 3,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 3,
    id: 'T',
    name: 'Aquifer transmissivity<br/>T [m' + '2'.sup() + '/d]',
    min: 1000,
    validMin: (x: number) => 0 < x,
    max: 3000,
    value: 1500,
    stepSize: 10,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 4,
    id: 'd',
    name: 'Distance from stream to well<br/>d [m]',
    min: 200,
    validMin: (x: number) => 0 < x,
    max: 1000,
    value: 500,
    stepSize: 1,
    decimals: 0,
  }],
};

const tool = 'T14A';

const T14AContainer = () => {

  const [data, setData] = useState<IT14A>(defaults);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const showBreadcrumbs = useShowBreadcrumbs();

  const handleChangeParameters = (parameters: IT14A['parameters']) => {
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
          {label: translate('T14_title'), link: '/tools/T14'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />}
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartT14A
          parameters={data.parameters}
        />
        <InfoT14A parameters={data.parameters}/>
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </>
  );
};

export default T14AContainer;
