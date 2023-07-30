import React, {useState} from 'react';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {Background, ChartT13A, InfoT13A, Parameters} from '../components/';
import {IT13A} from '../../types/T13.type';
import image from '../images/T13A.png';

const defaults: IT13A = {
  // FIXME npm i uuidv4 (id: uuidv4())
  id: '123',
  name: 'New simple tool',
  description: 'Simple tool description',
  permissions: 'rwx',
  public: false,
  tool: 'T13A',
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
    value: 0.009,
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
    value: 10.1,
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
    name: 'Aquifer length<br/>L´ [m]',
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
    name: 'Downstream fixed head boundary<br/>h<sub>L</sub>´ [m]',
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
    order: 6,
    id: 'xe',
    name: 'Arrival location<br/>x<sub>e</sub> [m]',
    min: 1,
    max: 1000,
    value: 500,
    stepSize: 1,
    decimals: 0,
  }],
};

const T13AContainer = () => {

  const [data, setData] = useState<IT13A>(defaults);
  const handleChangeParameters = (parameters: IT13A['parameters']) => {
    setData((prevState) => ({
      ...prevState,
      parameters: [...parameters],
    }));
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
        <Background image={image} title={'T13A. Travel time // Aquifer system with a no-flow boundary and fixed head boundary condition'}/>
        <ChartT13A
          parameters={data.parameters}
        />
        <InfoT13A parameters={data.parameters}/>
        <Parameters
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
        />
      </SimpleToolGrid>
    </>
  );
};

export default T13AContainer;
