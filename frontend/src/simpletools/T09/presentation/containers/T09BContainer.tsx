import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {Background, ChartT09B, InfoT09B, Parameters} from '../components/';
import {IT09B} from '../../types/T09.type';
import image from '../images/T09B.png';
import {useNavigate} from '../../../common/hooks';
import {Breadcrumb} from '../../../../components';

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

const T09AContainer = () => {

  const [data, setData] = useState<IT09B>(defaults);
  const navigateTo = useNavigate();
  const handleChangeParameters = (parameters: IT09B['parameters']) => {
    setData((prevState) => ({
      ...prevState,
      parameters: [...parameters],
    }));
  };
  const handleReset = () => {
    setData(defaults);
  };

  const title = 'T09B. Shape of freshwater-saltwater interface (Glover equation)';

  return (
    <>
      <Breadcrumb
        items={[
          {label: 'TOOLS', link: '/tools'},
          {label: 'SALTWATER INTRUSION', link: '/tools/T09'},
          {label: title, link: '/tools/T09B'},
        ]}
        navigateTo={navigateTo}
      />
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <ChartT09B
          parameters={data.parameters}
        />
        <InfoT09B parameters={data.parameters}/>
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </>
  );
};

export default T09AContainer;
