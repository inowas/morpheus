import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {IT13D} from '../../types/T13.type';
import {BackgroundT13D, Parameters} from '../components';
import {Breadcrumb} from '../../../../components';
import {useNavigate} from '../../../common/hooks';

const defaults: IT13D = {
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
  }],
};

const T13DContainer = () => {

  const [data, setData] = useState<IT13D>(defaults);
  const navigateTo = useNavigate();

  const handleChangeParameters = (parameters: IT13D['parameters']) => {
    setData((prevState) => ({
      ...prevState,
      parameters: [...parameters],
    }));
  };
  const handleReset = () => {
    setData(defaults);
  };

  const title = 'T13D. Steady-state groundwater flow in a confined aquifer with a constant head boundary';

  return (
    <>
      <Breadcrumb
        items={[
          {label: 'TOOLS', link: '/tools'},
          {label: 'TRAVEL TIME', link: '/tools/T13'},
          {label: title, link: '/tools/T13A'},
        ]}
        navigateTo={navigateTo}
      />
      <SimpleToolGrid rows={2}>
        <BackgroundT13D parameters={data.parameters}/>
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </>
  );
};

export default T13DContainer;
