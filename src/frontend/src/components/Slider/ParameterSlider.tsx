import React, {ChangeEvent} from 'react';
import 'rc-slider/assets/index.css';
import './styles.less';
import Slider from 'rc-slider';
import {Grid} from 'semantic-ui-react';
import {ISliderParameter} from './IInputType';
import styles from './Slider.module.less';

interface IProps {
  parameter: ISliderParameter;
  onChange: (param: ISliderParameter) => void;
  debounce?: number;
  onLoad: (value: boolean) => void;
}

const ParameterSlider = ({parameter, onChange, debounce, onLoad}: IProps) => {
  const [param, setParam] = React.useState(parameter);
  const [timeOutId, setTimeOutId] = React.useState<NodeJS.Timeout | null>(null);

  const handleChange = () => {
    onChange(param);
    onLoad(true);
  };

  const handleParams = (value: number | number[]) => {
    const newParam = {
      ...param,
      value: Array.isArray(value) ? value[0] : value,
    };
    return newParam;
  };

  const handleLocalChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {value, name} = event.target;
    const newValue = 0 > +value ? '0' : value;
    setParam({
      ...param, [name]: newValue,
    });
  };

  const handleSlider = (value: number | number[]) => {

    const newParam = handleParams(value);
    setParam(newParam);
    onLoad(true);
    if (!debounce) {
      onChange(newParam);
    }
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    const toId = setTimeout(() => {
      // onLoad(true);
      onChange(newParam);
    }, debounce);
    setTimeOutId(toId);
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
              disabled={true}
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
              disabled={true}
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
          min={param.min}
          max={param.max}
          className={`${styles.extraMini} , ${styles.valueInput}`}
          value={param.value} onChange={handleLocalChange}
          onBlur={handleChange}
        />
      </Grid.Column>
    </Grid.Row>
  );
};

export default ParameterSlider;
