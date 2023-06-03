import React, {ChangeEvent, useEffect} from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import {Grid} from 'semantic-ui-react';
import {ISliderParameter} from './IInputType';

const styles = {
  L: {
    width: '53px',
  },
  R: {
    width: '65px',
  },
  valueInput: {
    width: '100px',
  },
  row: {
    paddingBottom: '0',
    paddingTop: '0',
  },
  sliderRow: {
    margin: '-25px 0 0 0',
  },
};

interface IProps {
  parameter: ISliderParameter;
  onChange: (param: ISliderParameter) => void;
}

const ParameterSlider = ({parameter, onChange}: IProps) => {

  const [param, setParam] = React.useState(parameter);

  useEffect(() => {
    setParam(parameter);
  }, [parameter]);

  const handleChange = () => {
    onChange(param);
  };

  const handleLocalChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {value, name} = event.target;
    setParam({
      ...param, [name]: value,
    });
  };

  const handleSlider = (value: number | number[]) => {
    const newParam = {
      ...param,
      value: Array.isArray(value) ? value[0] : value,
    };

    setParam(newParam);
    onChange(newParam);
  };

  return (
    <Grid.Row columns={3} style={styles.row}>
      <Grid.Column width={5} textAlign='right'>
        <div dangerouslySetInnerHTML={{__html: param.name}} style={{minHeight: '55px'}}/>
      </Grid.Column>
      <Grid.Column width={8}>
        <Grid columns={2}>
          <Grid.Column width={4} floated='left'>
            <input
              name='min'
              type='number'
              className='extraMini'
              style={{...styles.L}}
              value={param.min}
              onBlur={handleChange}
              onChange={handleLocalChange}
            />
          </Grid.Column>
          <Grid.Column width={4} floated='right'>
            <input
              name='max'
              type='number'
              className='extraMini'
              style={{...styles.R}}
              value={param.max}
              onBlur={handleChange}
              onChange={handleLocalChange}
            />
          </Grid.Column>
        </Grid>
        <Grid style={styles.sliderRow}>
          <Grid.Row>
            <Slider
              min={param.min}
              max={param.max}
              step={param.stepSize}
              defaultValue={param.value}
              value={param.value}
              onChange={handleSlider}
            />
          </Grid.Row>
        </Grid>
      </Grid.Column>
      <Grid.Column width={3} style={{verticalAlign: 'top', height: '55px'}}>
        <input
          name='value'
          type='number'
          className='extraMini'
          style={{...styles.valueInput}}
          value={param.value} onChange={handleLocalChange}
          onBlur={handleChange}
        />
      </Grid.Column>
    </Grid.Row>
  );
};

export default ParameterSlider;
