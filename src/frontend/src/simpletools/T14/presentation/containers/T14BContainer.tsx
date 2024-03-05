import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {Background, ChartT14B, InfoT14B, Parameters} from '../components';
import image from '../images/T14B.png';
import {IT14B} from '../../types/T14.type';
import {Breadcrumb} from 'components';
import {useNavigate} from 'common/hooks';
import {useShowBreadcrumbs, useTranslate} from '../../application';


export const defaults: IT14B = {
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
    min: 100,
    validMin: (x: number) => 1 < x,
    max: 500,
    value: 365,
    stepSize: 1,
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
    name: 'Aquifer transmissivity<br/>T [m' + '2'.sup() + 'd]',
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
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 5,
    id: 'K',
    name: 'Aquifer permeability<br/>K [m/d]',
    min: 1,
    validMin: (x: number) => 0 < x,
    max: 1000,
    value: 60,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 6,
    id: 'Kdash',
    name: 'Permeability of semipervious layer<br/>K [m/d]',
    min: 0.1,
    validMin: (x: number) => 0 < x,
    max: 1,
    value: 0.1,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 7,
    id: 'bdash',
    name: 'Thickness of semipervious layer<br/>b [m]',
    min: 1,
    validMin: (x: number) => 0 < x,
    max: 100,
    value: 1,
    stepSize: 1,
    decimals: 0,
  }],
};

const tool = 'T14B';

const T14AContainer = () => {

  const [data, setData] = useState<IT14B>(defaults);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const showBreadcrumbs = useShowBreadcrumbs();

  const handleChangeParameters = (parameters: IT14B['parameters']) => {
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
      />
      }
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartT14B
          parameters={data.parameters}
        />
        <InfoT14B parameters={data.parameters}/>
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
