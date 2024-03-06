import {Button, Grid} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';

import {IT02} from '../../types/T02.type';
import {ParameterSlider} from 'components/Slider/ParameterSlider';

type IParameter = IT02['parameters'][0];

interface IProps {
  parameters: IParameter[];
  onChange: (parameters: IParameter[]) => void;
  onReset: () => void;
  debounce?: number;
  onMoveSlider: () => void;
}

const sortParameters = (parameters: IParameter[]) => {
  return parameters.sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    }
    return -1;
  });
};

const Parameters = ({parameters, onChange, onMoveSlider, onReset, debounce}: IProps) => {

  const [params, setParams] = useState<IParameter[]>(sortParameters(parameters));
  const [timeOutId, setTimeOutId] = React.useState<NodeJS.Timeout | null>(null);

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

    onMoveSlider();
    if (!debounce) {
      onChange([...newParams]);
    }

    const newTimeOutId = setTimeout(() => {
      onChange([...newParams]);
    }, debounce);

    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    setTimeOutId(newTimeOutId);
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
