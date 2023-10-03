import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {Background, ChartT13C, InfoT13C, Parameters} from '../components';
import {IT13C} from '../../types/T13.type';
import image from '../images/T13C.png';
import {Breadcrumb} from 'components';
import {useNavigate} from 'common/hooks';
import {useTranslate} from '../../application';

const defaults: IT13C = {
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
    value: 0.0011,
    stepSize: 0.0001,
    decimals: 4,
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
    order: 3,
    id: 'L',
    name: 'Aquifer length<br/>L [m]',
    min: 0,
    max: 1000,
    value: 500,
    stepSize: 10,
    decimals: 0,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 4,
    id: 'hL',
    name: 'Downstream fixed head boundary<br/>h<sub>L</sub> [m]',
    min: 0,
    max: 10,
    value: 2,
    stepSize: 0.5,
    decimals: 1,
  }, {
    inputType: 'SLIDER',
    label: '',
    parseValue: parseFloat,
    type: 'int',
    order: 5,
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
    order: 6,
    id: 'xi',
    name: 'Initial position<br/>x<sub>i</sub> [m]',
    min: 0,
    max: 1000,
    value: 330,
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
    value: 600,
    stepSize: 1,
    decimals: 0,
  }],
};

const tool = 'T13C';

const T13CContainer = () => {

  const [data, setData] = useState<IT13C>(defaults);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();

  const handleChangeParameters = (parameters: IT13C['parameters']) => {
    setData((prevState) => ({...prevState, parameters: [...parameters]}));
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
          {label: translate('T13_title'), link: '/tools/T13'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartT13C
          parameters={data.parameters}
        />
        <InfoT13C parameters={data.parameters}/>
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </>
  );
};

export default T13CContainer;
