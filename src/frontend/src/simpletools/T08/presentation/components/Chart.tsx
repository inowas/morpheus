import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {CartesianGrid, Label, Line, LineChart, ResponsiveContainer, XAxis, YAxis, exportChartData, exportChartImage} from 'components/RechartsWrapper';
import {SETTINGS_CASE_FIXED_TIME, SETTINGS_CASE_VARIABLE_TIME, SETTINGS_INFILTRATION_ONE_TIME} from '../containers/T08Container';

import {IT08} from '../../types/T08.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

const styles = {
  chart: {
    top: 20,
    right: 20,
    left: 20,
    bottom: 0,
  },
  diagramLabel: {
    position: 'absolute',
    backgroundColor: '#eff3f6',
    opacity: 0.9,
    top: 24,
    right: 40,
  },
};

interface ICalculation {
  calcC: (t: number, x: number, vx: number, R: number, DL: number) => number;
  calcCTau: (t: number, x: number, vx: number, R: number, DL: number, tau: number) => number;
  calculateVx: (K: number, ne: number, I: number) => number;
  calculateDL: (alphaL: number, vx: number) => number;
  calculateR: (ne: number, Kd: number) => number;
  calculateDiagramData: (
    settings: IT08['settings'],
    vx: number,
    DL: number,
    R: number,
    C0: number,
    xMax: number,
    tMax: number,
    tau: number
  ) => any[];
}

interface IProps {
  settings: IT08['settings'];
  parameters: IT08['parameters'];
  calculation: ICalculation;
}

const Chart = ({settings, parameters, calculation}: IProps) => {

  const {C0, K, Kd, I, ne, x, t, alphaL, tau} = getParameterValues(parameters);

  let label = '';
  let dataKey = '';
  let variable = '';
  let unit = '';
  let val0: number = 0;
  let val50: number = 0;
  let valmax: number = 0;

  const vx = calculation.calculateVx(K, ne, I);
  const DL = calculation.calculateDL(alphaL, vx);
  const R = calculation.calculateR(ne, Kd);
  const C = (settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME && t > tau) ? calculation.calcCTau(t, x, vx, R, DL, tau) : calculation.calcC(t, x, vx, R, DL);
  const data = calculation.calculateDiagramData(settings, vx, DL, R, C0, x, t, tau);

  let dataMax = 0;
  for (let i = 0; i < data.length; i += 1) {
    dataMax = (data[i].C > dataMax) ? data[i].C : dataMax;
  }

  dataMax = (settings.infiltration !== SETTINGS_INFILTRATION_ONE_TIME) ? 1 : dataMax;

  if (settings.case === SETTINGS_CASE_VARIABLE_TIME) {
    label = 't (d)';
    dataKey = 't';
    variable = 'T';
    unit = 'days';

    for (let i = 1; i < data.length; i += 1) {
      if (data[i].C > 0.00001 * dataMax && data[i - 1].C < 0.00001 * dataMax) {
        val0 = data[i]?.t || 0;
      }
      if (data[i].C > 0.50001 * dataMax && data[i - 1].C < 0.50001 * dataMax) {
        val50 = data[i]?.t || 0;
      }
      if (// (data[i].C > 0.9999*DataMax && data[i-1].C < 0.9999*DataMax) ||
        (data[i].C > 0.9999 * dataMax)) {
        valmax = data[i]?.t || 0;
      }
    }
  }

  if (settings.case === SETTINGS_CASE_FIXED_TIME) {
    label = 'x (m)';
    dataKey = 'x';
    variable = 'X';
    unit = 'm';

    valmax = +(0).toFixed(2);
    for (let i = 1; i < data.length; i += 1) {
      if (data[i].C < 0.0001 * dataMax && data[i - 1].C > 0.0001 * dataMax) {
        // @ts-ignore
        val0 = data[i].x.toFixed(2);
      }
      if (data[i].C < 0.5001 * dataMax && data[i - 1].C > 0.5001 * dataMax) {
        // @ts-ignore
        val50 = data[i].x.toFixed(2);
      }
      if (// (data[i].C > 0.9999*DataMax && data[i-1].C < 0.9999*DataMax) ||
        (data[i].C > 0.9999 * dataMax)) {
        // @ts-ignore
        valmax = data[i].x.toFixed(2);
      }
    }
  }

  let currentChart: any;

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
              <XAxis type="number" dataKey={dataKey}>
                <Label
                  value={label}
                  offset={0}
                  position="bottom"
                  fill={'#4C4C4C'}
                  style={{fontSize: '13px'}}
                />
              </XAxis>
              <YAxis type="number" domain={[0, 'auto']}>
                <Label
                  angle={270}
                  position="left"
                  fill={'#4C4C4C'}
                  style={{fontSize: '13px'}}
                  value={'C/C₀ [-]'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              <Line
                isAnimationActive={false}
                type="basis"
                dataKey={'C'}
                stroke="#1EB1ED"
                strokeWidth="5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <Segment
            raised={true} style={styles.diagramLabel}
          >
            <p>C&nbsp;=&nbsp;<strong>{(C * C0).toFixed(2)}</strong>&nbsp;mg/L</p>
            <p>{variable}<sub>0</sub>&nbsp;=&nbsp;<strong>{val0}</strong>&nbsp;{unit}</p>
            <p>{variable}<sub>50</sub>&nbsp;=&nbsp;<strong>{val50}</strong>&nbsp;{unit}</p>
            <p>{variable}<sub>max</sub>&nbsp;=&nbsp;<strong>{valmax}</strong>&nbsp;{unit}</p>
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

export default Chart;
