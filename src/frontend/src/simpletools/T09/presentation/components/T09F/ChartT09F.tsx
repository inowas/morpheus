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

import {IT09F} from '../../../types/T09.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface IUseCalculate {
  dRho: (rHof: number, rHos: number) => number;
  calcXt: (params: { k: number; z0: number; l: number; w: number; df: number; ds: number }) => number;
  calcDeltaXt: (params: { dz: number; k: number; z0: number; l: number; w: number; theta: number; df: number; ds: number }) => number;
  calcNewXt: (params: { dz: number; k: number; z0: number; l: number; w: number; theta: number; df: number; ds: number }) => number;
  calcH: (params: { k: number; l: number; w: number; x: number; df: number; ds: number }) => number;
  calcI: (params: { dz: number; k: number; l: number; w: number; theta: number; x: number; df: number; ds: number }) => number;
}

interface IProps {
  parameters: IT09F['parameters'];
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
    left: 24,
  },
};

let currentChart: any;

const ChartT09F = ({parameters, calculation}: IProps) => {
  const {dz, k, z0, l, w, theta, x, df, ds} = getParameterValues(parameters);
  const newXt = calculation.calcNewXt({dz, k, z0, l, w, theta, df, ds});
  const xt = calculation.calcXt({k, z0, l, w, df, ds});
  const dxt = calculation.calcDeltaXt({dz, k, z0, l, w, theta, df, ds});

  const data = [{
    xt: newXt,
    z0_new: -z0,
  }, {
    xt: xt,
    z0: -z0,
    z0_new: (dz + z0) / (l - newXt) * xt - z0 - (dz + z0) / (l - newXt) * newXt,
  }, {
    xt: l,
    z0: 0,
    z0_new: dz,
  }];

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
              <XAxis
                type="number"
                dataKey="xt"
                domain={[Math.floor(newXt / 100) * 100, l]}
              >
                <Label
                  value={'z₀ [m]'}
                  offset={0}
                  position="bottom"
                  fill={'#4C4C4C'}
                  style={{fontSize: '13px'}}
                />
              </XAxis>
              <YAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                tickFormatter={(tick) => tick.toFixed(1)}
                orientation="right"
              >
                <Label
                  angle={90}
                  position="right"
                  style={{textAnchor: 'middle', fontSize: '13px'}}
                  value={'x [m]'}
                  fill={'#4C4C4C'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              <Line
                isAnimationActive={false}
                type="basis"
                dataKey={'z0'}
                stroke="#ED8D05"
                strokeWidth="5"
                dot={false}
              />
              <Line
                isAnimationActive={false}
                type="basis"
                dataKey={'z0_new'}
                stroke="#ED8D05"
                strokeWidth="5"
                dot={false}
                strokeDasharray="15 15"
              />
              <ReferenceLine
                y={-z0}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="3 3"
                label={{position: 'left', value: 'z₀'}}
                // dot={false}
              />
              <ReferenceLine
                x={xt}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="3 3"
                label={{position: 'top', value: 'xt'}}
                // dot={false}
              />
              <ReferenceLine
                x={newXt}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="3 3"
                label={{position: 'top', value: 'xt\''}}
                // dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <Segment raised={true} style={styles.diagramLabel}>
            <p>x<sub>t</sub>&nbsp;=&nbsp;<strong>{xt.toFixed(1)}</strong>&nbsp;m</p>
            <p>x<sub>t</sub>&apos;&nbsp;=&nbsp;<strong>{newXt.toFixed(1)}</strong>&nbsp;m</p>
            <p>dx<sub>t</sub>&nbsp;=&nbsp;<strong>{dxt.toFixed(1)}</strong>&nbsp;m</p>
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

export default ChartT09F;
