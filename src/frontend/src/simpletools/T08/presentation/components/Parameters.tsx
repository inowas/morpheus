import {Button, Grid} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';

import {IT08} from '../../types/T08.type';
import {ParameterSlider} from 'common/components/Slider/ParameterSlider';

type IParameter = IT08['parameters'][0];

interface IProps {
  parameters: IParameter[];
  onChange: (parameters: IParameter[]) => void;
  onReset: () => void;
}

export const sortParameters = (parameters: IParameter[]) => {
  return parameters.sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    }
    return -1;
  });
};

const Parameters = ({parameters, onChange, onReset}: IProps) => {

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
      />
    ))
  );

  return (
    <Grid
      verticalAlign="middle"
      data-testid={'parameters-container'}
    >
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
