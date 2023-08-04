import React from 'react';
import {CartesianGrid, Label, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {calculateDiagramData, calcXtQ0Flux, calcXtQ0Head, dRho} from '../../../application/useCalculationsT09E';
import {exportChartData, exportChartImage, getParameterValues} from '../../../../common/helpers';
import {IT09E} from '../../../types/T09.type';

interface IProps {
  parameters: IT09E['parameters'];
  settings: IT09E['settings'];
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

const renderLabels = (maxIter: boolean, valid: boolean, dxt: number): React.ReactElement | null => {
  if (!valid) {
    return (
      <Segment
        inverted={true} color="orange"
        secondary={true} style={styles.diagramLabel}
      >
        <p>Invalid values: square root gets minus.</p>
        <p>Offshore discharge rate is less than minimum discharge rate</p>
      </Segment>
    );
  }

  if (maxIter) {
    return (
      <Segment
        inverted={true} color="orange"
        secondary={true} style={styles.diagramLabel}
      >
        <p>Maximum number of iterations are conducted.</p>
        <p>Change in x <sub>t</sub>&nbsp;=&nbsp;<strong>{dxt.toFixed(1)}</strong>&nbsp;m</p>
      </Segment>
    );
  }
  return null;
};

const ChartT09E = ({parameters, settings}: IProps) => {

  const {k, z0, l, w, dz, hi, i, df, ds} = getParameterValues(parameters);
  const {method} = settings;

  let data: any[];
  let dxt: number;
  let maxIter: boolean = false;
  let isValid: boolean = true;
  const alpha = dRho(df, ds);

  if ('constHead' === method) {
    const xtQ0Head1 = calcXtQ0Head(k, z0, 0, l, w, hi, alpha);
    const xt = xtQ0Head1[0];
    maxIter = xtQ0Head1[2];
    isValid = xtQ0Head1[3];

    const xtQ0Head2 = calcXtQ0Head(k, z0, dz, l, w, hi - dz, alpha);
    const xtSlr = xtQ0Head2[0]; // slr: after sea level rise

    if (false === maxIter) {
      maxIter = xtQ0Head2[2];
    }

    if (isValid) {
      isValid = xtQ0Head2[3];
    }

    dxt = xtSlr - xt;
    data = calculateDiagramData(xt, z0, xtSlr, dz, isValid);
    console.log(data, 'constHead');
  }

  if ('constFlux' === method) {
    const [xt, xtSlr] = calcXtQ0Flux(k, z0, dz, l, w, i, alpha);
    dxt = xtSlr - xt;
    data = calculateDiagramData(xt, z0, xtSlr, dz, isValid);
    console.log(data, 'constFlux');

  }

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
              <XAxis type="number" dataKey="xt">
                <Label
                  value={'xw [m]'}
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
                tickFormatter={(x) => x.toFixed(1)}
                orientation="right"
              >
                <Label
                  angle={90}
                  position="right"
                  style={{textAnchor: 'middle', fontSize: '13px'}}
                  value={'z₀ [m]'}
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
                y={data[1].z0}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="3 3"
                label={{position: 'left', value: 'z₀'}}

              />
              <ReferenceLine
                x={data[1].xt}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="3 3"
                label={{position: 'top', value: 'xt'}}
              />
              <ReferenceLine
                x={data[2].xt}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="3 3"
                label={{position: 'top', value: 'xt\''}}
              />
            </LineChart>
          </ResponsiveContainer>
          <Segment raised={true} style={styles.diagramLabel}>
            <p>Change in x<sub>t</sub>&nbsp;=&nbsp;<strong>{dxt.toFixed(1)}</strong>&nbsp;m</p>
          </Segment>
          {renderLabels(maxIter, isValid, dxt)}
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

export default ChartT09E;
