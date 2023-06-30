import React, {useEffect, useState} from 'react';
import {Button, Grid} from 'semantic-ui-react';
import {ParameterSlider} from 'components/Slider';
import {IT08} from '../../types/T08.type';

type IParameter = IT08['data']['parameters'][0];

interface IProps {
  parameters: IParameter[];
  onChange: (parameters: IParameter[]) => void;
  onReset: () => void;
}

const sortParameters = (parameters: IParameter[]) => {
  return parameters.sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    }
    return -1;
  });
};

const Parameters = ({parameters, onChange}: IProps) => {

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

  const handleReset = () => {
    setParams(sortParameters(parameters));
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
    <Grid verticalAlign="middle" className="parametersGrid">
      <Grid.Row className="parametersRow">
        <Grid.Column textAlign="right" className="parametersColumn">
          <Button onClick={handleReset} className="parametersDefaultButton">Default</Button>
        </Grid.Column>
      </Grid.Row>
      {renderParameters(params)}
    </Grid>
  );
};

export default Parameters;
