import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {Background, ChartT14D, InfoT14D, Parameters} from '../components/';
import image from '../images/T14D.png';
import {IT14D} from '../../types/T14.type';
import {Breadcrumb} from '../../../../components';
import {useNavigate} from '../../../common/hooks';
import {useTranslate} from '../../application';

export const defaults: IT14D = {
  parameters: [{
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 0,
    id: 'Qw',
    name: 'Pumping rate<br/>Q<sub>w</sub> [m<sup>3</sup>/d]',
    min: 1,
    validMin: (x: number) => (0 < x),
    max: 10000,
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
    min: 10,
    validMin: (x: number) => (1 < x),
    max: 500,
    value: 400,
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
    validMin: (x: number) => (0 < x),
    max: 0.5,
    validMax: (x: number) => (1 >= x),
    value: 0.2,
    stepSize: 0.01,
    decimals: 2,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 3,
    id: 'T',
    name: 'Aquifer transmissivity<br/>T [m<sup>2</sup>/d]',
    min: 1000,
    validMin: (x: number) => (0 < x),
    max: 3000,
    value: 1500,
    stepSize: 1,
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
    validMin: (x: number) => (0 < x),
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
    id: 'W',
    name: 'Width of stream<br/>W [m]',
    min: 1,
    validMin: (x: number) => (0 < x),
    max: 10,
    value: 2.5,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 6,
    id: 'Kdash',
    name: 'Permeability of the aquitard<br/>K\' [m/d]',
    min: 0.1,
    validMin: (x: number) => (0 < x),
    max: 2,
    value: 0.5,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 7,
    id: 'Bdashdash',
    name: 'Thickness of the aquitard<br/>B\'\' [m]',
    min: 0.1,
    validMin: (x: number) => (0 < x),
    max: 20,
    value: 7,
    stepSize: 0.1,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 8,
    id: 'Sigma',
    name: 'Specific yield of the aquitard<br/>σ [m]',
    min: 0.1,
    validMin: (x: number) => (0 < x),
    max: 0.5,
    value: 0.1,
    stepSize: 0.01,
    decimals: 2,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 9,
    id: 'bdash',
    name: 'Distance between bottom of stream and top of aquifer<br/>b\' [m]',
    min: 1,
    validMin: (x: number) => (0 < x),
    max: 20,
    value: 10,
    stepSize: 0.1,
    decimals: 1,
  }],
};

const tool = 'T14D';

const T14AContainer = () => {

  const [data, setData] = useState<IT14D>(defaults);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();

  const handleChangeParameters = (parameters: IT14D['parameters']) => {
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
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: translate('T14_title'), link: '/tools/T14'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartT14D
          parameters={data.parameters}
        />
        <InfoT14D parameters={data.parameters}/>
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
