import React from 'react';
import {CartesianGrid, Label, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {calcLambda, calcMu, calculateDiagramData, calculateQCrit} from '../../../application/useCalculationsT09D';
import {exportChartData, exportChartImage, getParameterValues} from '../../../../common/helpers';
import {IT09D} from '../../../types/T09.type';

interface IProps {
  parameters: IT09D['parameters'];
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

const renderLabels = (rhof: number, rhos: number, lambda: number, qCrit: number): JSX.Element => {
  if (rhof >= rhos) {
    return (
      <Segment
        inverted={true} color="orange"
        secondary={true} style={styles.diagramLabel}
      >
        <p>Saltwater density is lower than the density of freshwater.</p>
      </Segment>
    );
  }
  if (2 < lambda) {
    return (
      <Segment
        inverted={true} color="orange"
        secondary={true} style={styles.diagramLabel}
      >
        <p>
          The Stagnation point is located far from the coast.<br/>
          This will lead to the entrance of salt water<br/>
          into the flow directly from the sea.
        </p>
      </Segment>
    );
  }
  return (
    <Segment raised={true} style={styles.diagramLabel}>
      <p>Q<sub>crit</sub>&nbsp;=&nbsp;<strong>{qCrit.toFixed(0)}</strong>&nbsp;m<sup>3</sup>/d</p>
    </Segment>
  );
};
const ChartT09D = ({parameters}: IProps) => {
  const {k, b, q, xw, rhof, rhos, AqType} = getParameterValues(parameters);
  const lambda = calcLambda(k, b, q, xw, rhof, rhos, AqType);
  const mu = calcMu(lambda);
  const qCrit = calculateQCrit(q, mu, xw);
  const data = calculateDiagramData(q, mu, xw);

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
              <XAxis type="number" dataKey="xw">
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
                tickFormatter={(x) => parseFloat(x).toFixed(1)}
              >
                <Label
                  angle={270}
                  position="left"
                  style={{textAnchor: 'middle', fontSize: '13px'}}
                  value={'Qcrit [m³/d]'}
                  fill={'#4C4C4C'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              <ReferenceLine
                x={xw}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="3 3"
                label={{position: 'insideTopRight', value: 'xw'}}
              />
              <Line
                isAnimationActive={true}
                type="basis"
                dataKey={'Qcrit'}
                stroke="#1EB1ED"
                strokeWidth="3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          {renderLabels(rhof, rhos, lambda, qCrit)}
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

export default ChartT09D;
