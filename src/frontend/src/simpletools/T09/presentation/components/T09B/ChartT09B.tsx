import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  exportChartData,
  exportChartImage,
} from 'common/components/RechartsWrapper';

import {IT09B} from '../../../types/T09.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface DataSet {
  x: number;
  z?: number;
  b: number;
}

interface IUseCalculate {
  range: (start: number, stop: number, step: number) => number[];
  calculateZofX: (x: number, i: number, b: number, df: number, ds: number) => number;
  calculateZ: (i: number, b: number, df: number, ds: number) => number;
  calculateL: (i: number, b: number, df: number, ds: number) => number;
  calculateXT: (i: number, b: number, rho_f: number, rho_s: number) => number;
  calculateDiagramData: (
    i: number,
    b: number,
    df: number,
    ds: number,
    start: number,
    stop: number,
    step: number
  ) => DataSet[];
}

interface IProps {
  parameters: IT09B['parameters'];
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
  diagramLabel: {
    position: 'absolute',
    backgroundColor: '#eff3f6',
    opacity: 0.9,
    top: 24,
    left: 110,
  },
};

let currentChart: any;

const ChartT09B = ({parameters, calculation}: IProps) => {
  const {b, i, df, ds} = getParameterValues(parameters);

  const yDomain = [-b, 0];
  const z = calculation.calculateZ(i, b, df, ds);
  const L = calculation.calculateL(i, b, df, ds);
  const xT = calculation.calculateXT(i, b, df, ds);
  const xDomain = [(Math.round(xT / 50) + 1) * 50, 0];
  const data = calculation.calculateDiagramData(i, b, df, ds, 0, (Math.round(xT / 50) + 1) * 50, 1);

  return (
    <div>
      <Grid>
        <Grid.Column>
          <ResponsiveContainer width="100%" aspect={2.5}>
            <LineChart
              data={data}
              margin={styles.chart}
              ref={(chart) => currentChart = chart}
            >
              <XAxis
                type="number"
                domain={xDomain}
                dataKey="x"
                allowDecimals={false}
                tickLine={false}
              >
                <Label
                  value={'x [m]'} offset={0}
                  position="bottom" fill={'#4C4C4C'}
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
                  value={'z [m]'}
                  fill={'#4C4C4C'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              <Line
                dot={false}
                isAnimationActive={true}
                type="basis"
                dataKey="z"
                stroke="#ED8D05"
                strokeWidth="5"
                fillOpacity={1}
              />
            </LineChart>
          </ResponsiveContainer>
          <Segment raised={true} style={styles.diagramLabel}>
            <p>z<sub>0</sub>&nbsp;=&nbsp;<strong>{z.toFixed(1)}</strong>&nbsp;m</p>
            <p>L&nbsp;=&nbsp;<strong>{L.toFixed(1)}</strong>&nbsp;m</p>
            <p>x<sub>T</sub>&nbsp;=&nbsp;<strong>{xT.toFixed(1)}</strong>&nbsp;m</p>
          </Segment>
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

export default ChartT09B;
