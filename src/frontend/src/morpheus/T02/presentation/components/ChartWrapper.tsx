import React, {useState} from 'react';
import {Grid, Icon} from 'semantic-ui-react';
import {IT02} from '../../types/T02.type';
import Chart from './Chart';
import ChartModal from '../../../application/presentation/components/ChartModal';
import styles from '../containers/T02Container.module.less';

interface ICalculateChartXMax {
  variable: string;
  w: number;
  L: number;
  W: number;
  hi: number;
  Sy: number;
  K: number;
  t: number;
}

interface ICalculate {
  w: number;
  L: number;
  W: number;
  hi: number;
  Sy: number;
  K: number;
  t: number;
}

interface IMounding {
  calculateHi: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
  calculateHMax: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
}

interface IProps {
  settings: IT02['settings'];
  parameters: IT02['parameters'];
  mounding: IMounding;
}

const getParameterValues = (arr: IT02['parameters']) => {
  let returnValue: { [key: string]: any } = {};

  arr.forEach((item) => {
    returnValue[item.id] = item.value;
  });

  return returnValue;
};

const calculateChartXMax = ({variable, w, L, W, hi, Sy, K, t}: ICalculateChartXMax, mounding: IMounding) => {
  if ('x' === variable) {
    for (let x = 0; 10000 > x; x += 10) {

      const result = mounding.calculateHi(x, 0, w, L, W, hi, Sy, K, t);
      if (0.01 >= result) {
        return x;
      }
    }
    return 0;
  }

  for (let y = 0; 10000 > y; y += 10) {
    const result = mounding.calculateHi(0, y, w, L, W, hi, Sy, K, t);
    if (0.01 >= result) {
      // noinspection JSSuspiciousNameCombination
      return y;
    }
  }

  return 0;
};

const calculate = ({L, W, w, hi, Sy, K, t}: ICalculate, mounding: IMounding) => {
  const xMin = 0;
  const xMax = calculateChartXMax({variable: 'x', w, L, W, hi, Sy, K, t}, mounding);
  const yMin = 0;
  const yMax = calculateChartXMax({variable: 'y', w, L, W, hi, Sy, K, t}, mounding);

  const xValues: number[] = [];
  for (let x = xMin; x < xMax; x += 10) {
    xValues.push(x);
  }

  const yValues: number[] = [];
  for (let y = yMin; y < yMax; y += 10) {
    yValues.push(y);
  }

  const zData1Q = new Array(yValues.length).fill(0).map(() => new Array(xValues.length).fill(hi));
  yValues.forEach((yValue, rowNr) => {
    xValues.forEach((xValue, colNr) => {
      zData1Q[rowNr][colNr] = mounding.calculateHi(xValue, yValue, w, L, W, hi, Sy, K, t) + hi;
    });
  });

  const xData = [...[...xValues].reverse().map(v => -v), ...xValues];
  const yData = [...[...yValues].reverse().map(v => -v), ...yValues];

  const zData12Q = zData1Q.map((row) => [...[...row].reverse(), ...row]);
  const zData = [...zData12Q.reverse(), ...zData12Q.reverse()];

  return {xData, yData, zData};
};

const ChartWrapper = ({parameters, mounding}: IProps) => {

  const {L, W, w, hi, Sy, K, t} = getParameterValues(parameters);

  const {xData, yData, zData} = React.useMemo(() => calculate({
    L,
    W,
    w,
    hi,
    Sy,
    K,
    t,
  }, mounding), [L, W, w, hi, Sy, K, t],
  );

  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };


  return (
    <>
      <Grid style={{
        height: '100%',
      }}
      >
        <Icon
          name="expand arrows alternate"
          onClick={handleToggleModal}
          className={styles.icon}
          style={{position: 'absolute', zIndex: '2', cursor: 'pointer'}}
        />
        <Grid.Column style={{
          width: '100%',
          display: 'flex',
          flexGrow: '2',
        }}
        >
          <Chart
            data={{
              x: xData,
              y: yData,
              z: zData,
            }}
            basinLength={L}
            basinWidth={W}
            chartHeight={300}
            id="chart1"

          />
        </Grid.Column>
      </Grid>
      {showModal && (
        <ChartModal open={true} onClose={handleToggleModal}>
          <Chart
            data={{
              x: xData,
              y: yData,
              z: zData,
            }}
            basinLength={L}
            basinWidth={W}
            id="chart2"
          />
        </ChartModal>
      )}
    </>
  );
};

export default ChartWrapper;
