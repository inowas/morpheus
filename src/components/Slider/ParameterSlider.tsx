import React, {ChangeEvent, useEffect} from 'react';
import 'rc-slider/assets/index.css';
import './styles.less.css';
import Slider from 'rc-slider';
import {Grid} from 'semantic-ui-react';
import {ISliderParameter} from './IInputType';
import styles from './Slider.module.less';

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
    <Grid.Row columns={3} className={styles.row}>
      <Grid.Column
        width={5} textAlign="right"
        className={styles.col}
      >
        <div dangerouslySetInnerHTML={{__html: param.name}} style={{minHeight: '55px'}}/>
      </Grid.Column>
      <Grid.Column
        width={8} className={styles.col}
      >
        <Grid columns={2}>
          <Grid.Column width={8} floated="left">
            <input
              name="min"
              type="number"
              className={`${styles.extraMini} ${styles.left}`}
              value={param.min}
              onBlur={handleChange}
              onChange={handleLocalChange}
            />
          </Grid.Column>
          <Grid.Column
            width={8} floated="right"
            textAlign="right"
          >
            <input
              name="max"
              type="number"
              className={`${styles.extraMini} ${styles.right}`}
              value={param.max}
              onBlur={handleChange}
              onChange={handleLocalChange}
            />
          </Grid.Column>
        </Grid>
        <Grid
          className={styles.sliderRow}
        >
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
      <Grid.Column
        width={3} className={styles.col}
        style={{verticalAlign: 'top', height: '100%'}}
      >
        <input
          name="value"
          type="number"
          className={`${styles.extraMini} , ${styles.valueInput}`}
          value={param.value} onChange={handleLocalChange}
          onBlur={handleChange}
        />
      </Grid.Column>
    </Grid.Row>
  );
};

export default ParameterSlider;
