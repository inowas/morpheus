import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
  exportChartData,
  exportChartImage,
} from 'components/RechartsWrapper';

import {IT09C} from '../../../types/T09.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface DataSet {
  x: number;
  h: number;
}

interface IUseCalculate {
  calculateQ: (k: number, d: number, df: number, ds: number) => number;
  calculateZCrit: (d: number) => number;
  calculateZ: (q: number, k: number, d: number, df: number, ds: number) => number;
  calculateDiagramData: (
    q: number,
    k: number,
    d: number,
    df: number,
    ds: number,
    start: number,
    stop: number,
    step: number
  ) => DataSet[];
}

interface IProps {
  parameters: IT09C['parameters'];
  calculation: IUseCalculate;
}

const styles = {
  chart: {
    top: 20,
    right: 20,
    left: 20,
    bottom: 0,
  },
  diagramErrorLabel: {
    position: 'absolute',
    top: '60px',
    left: '200px',
    background: '#EFF3F6',
    opacity: 0.9,
  },
  diagramLabelLeft: {
    position: 'absolute',
    backgroundColor: '#eff3f6',
    opacity: 0.9,
    top: 24,
    left: 110,
  },
  diagramLabelRight: {
    position: 'absolute',
    backgroundColor: '#eff3f6',
    opacity: 0.9,
    top: 24,
    right: 40,
  },
};

let currentChart: any;

const renderLabels = (df: number, ds: number, z: number, qmax: number): JSX.Element => {
  if (df >= ds) {
    return (
      <Segment raised={true} style={styles.diagramLabelLeft}>
        <p>Saltwater density is lower than the density of freshwater.</p>
      </Segment>
    );
  }
  return (
    <Segment raised={true} style={styles.diagramLabelRight}>
      <p>
        z&nbsp;=&nbsp;<strong>{z.toFixed(1)}</strong>&nbsp;m
      </p>
      Q<sub>max</sub>&nbsp;=&nbsp;<strong>{qmax.toFixed(1)}</strong>&nbsp;m<sup>3</sup>/d
    </Segment>
  );
};

const ChartT09C = ({parameters, calculation}: IProps) => {
  const {q, k, d, df, ds} = getParameterValues(parameters);
  const data = calculation.calculateDiagramData(q, k, d, df, ds, 0, 1000, 1);
  const yDomain = [0, 2 * calculation.calculateZCrit(d)];
  const z = calculation.calculateZ(q, k, d, df, ds);
  const qmax = calculation.calculateQ(k, d, df, ds);
  const zCrit = calculation.calculateZCrit(d);
  return (
    <div>
      <Grid>
        <Grid.Column>
          <ResponsiveContainer width={'100%'} aspect={2.5}>
            <LineChart
              data={data}
              margin={styles.chart}
              ref={(chart) => currentChart = chart}
            >
              <XAxis type="number" dataKey="x">
                <Label
                  value={'x [m]'}
                  offset={0}
                  position="bottom"
                  fill={'#4C4C4C'}
                  style={{fontSize: '13px'}}
                />
              </XAxis>
              <YAxis
                type="number"
                domain={yDomain}
                allowDecimals={false}
                tickLine={false}
                tickFormatter={(x) => x.toFixed(1)}
              >
                <Label
                  angle={270}
                  position="left"
                  style={{textAnchor: 'middle', fontSize: '13px'}}
                  value={'d [m]'}
                  fill={'#4C4C4C'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              {df < ds &&
                <Line
                  isAnimationActive={true}
                  type="basis"
                  dataKey={'h'}
                  stroke="#ED8D05"
                  strokeWidth="5"
                  dot={false}
                />}
              {df < ds &&
                <ReferenceLine
                  y={zCrit} stroke="#ED8D05"
                  strokeWidth="5" strokeDasharray="20 20"
                />
              }
            </LineChart>
          </ResponsiveContainer>
          {renderLabels(df, ds, z, qmax)}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 28,
          }}
          >
            <Button
              compact={true} basic={true}
              icon={true}
              size={'small'}
              onClick={() => exportChartImage(currentChart)}
              style={{boxShadow: 'unset'}}
            >
              <Icon name="download"/> JPG
            </Button>
            <Button
              compact={true} basic={true}
              icon={true}
              size={'small'}
              onClick={() => exportChartData(currentChart)}
              style={{boxShadow: 'unset'}}
            >
              <Icon name="download"/> CSV
            </Button>
          </div>

        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ChartT09C;
