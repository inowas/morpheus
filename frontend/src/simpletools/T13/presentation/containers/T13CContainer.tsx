import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {Background, ChartT13C, InfoT13C, Parameters} from '../components/';
import {IT13C} from '../../types/T13.type';
import image from '../images/T13C.png';

const defaults: IT13C = {
  // FIXME npm i uuidv4 (id: uuidv4())
  id: '123',
  name: 'New simple tool',
  description: 'Simple tool description',
  permissions: 'rwx',
  public: false,
  tool: 'T13C',
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
const T13BContainer = () => {

  const [data, setData] = useState<IT13C>(defaults);
  const handleChangeParameters = (parameters: IT13C['parameters']) => {
    setData((prevState) => ({...prevState, parameters: [...parameters]}));
  };

  const handleReset = () => {
    setData(defaults);
  };

  return (
    <>
      // FIXME add ToolMetaData ?
      {/*<ToolMetaData*/}
      {/*  isDirty={isDirty}*/}
      {/*  onSave={handleSave}*/}
      {/*  saveButton={true}*/}
      {/*  readOnly={true}*/}
      {/*  tool={tool}*/}
      {/*  onReset={handleReset}*/}
      {/*  toolNames={toolNames}*/}
      {/*  navigateTo={navigateTo}*/}
      {/*/>*/}
      <SimpleToolGrid rows={2}>
        <Background image={image} title={'T13C. Aquifer system with a flow divide outside of the system'}/>
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

export default T13BContainer;
