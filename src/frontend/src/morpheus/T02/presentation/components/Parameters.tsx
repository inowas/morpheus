import React, {useEffect, useState} from 'react';
import {Button, Grid} from 'semantic-ui-react';
import {ParameterSlider} from 'components/Slider';
import {IT02} from '../../types/T02.type';

type IParameter = IT02['parameters'][0];

interface IProps {
  parameters: IParameter[];
  onChange: (parameters: IParameter[]) => void;
  onReset: () => void;
  debounce?: number;
  onLoad: (value: boolean) => void;
}

const sortParameters = (parameters: IParameter[]) => {
  return parameters.sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    }
    return -1;
  });
};

const Parameters = ({parameters, onChange, onLoad, onReset, debounce}: IProps) => {

  const [params, setParams] = useState<IParameter[]>(sortParameters(parameters));

  useEffect(() => {
    setParams(sortParameters(parameters));
  }, [parameters]);

  const handleChange = (parameter: IParameter) => {
    const newParams: IParameter[] = params.map(p => {
      if (p.id === parameter.id) {
        return parameter;
      }
      return p;
    });
    onChange([...newParams]);
  };


  const renderParameters = (p: IParameter[]) => (
    p.map(parameter => (
      <ParameterSlider
        key={parameter.id}
        onChange={handleChange}
        parameter={parameter}
        debounce={debounce}
        onLoad={onLoad}
      />
    ))
  );

  return (
    <Grid verticalAlign="middle">
      <Grid.Row>
        <Grid.Column textAlign="right">
          <Button onClick={onReset} style={{width: 100, margin: 0}}>Default</Button>
        </Grid.Column>
      </Grid.Row>
      {renderParameters(params)}
    </Grid>
  );
};

export default Parameters;
