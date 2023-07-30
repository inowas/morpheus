import React from 'react';
import {CartesianGrid, Label, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {IT13C} from '../../../types/T13.type';
import {calculateDiagramDataT13C, calculateXwd} from '../../../application/useCalculations';
import {exportChartData, exportChartImage, getParameterValues} from '../../../../common/helpers';

interface DataObject {
  x: number;
  t: number;
}

interface IProps {
  parameters: IT13C['parameters'];
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
const renderLabels = (xe: number, xi: number, L: number, data: DataObject[], xwd: number) => {
  if (xe < xi) {
    return (
      <Segment
        inverted={true} color="orange"
        secondary={true} style={styles.diagramErrorLabel}
      >
        <p>Arrival location, x<sub>e</sub>, can not be smaller than initial position, x<sub>i</sub>.</p>
      </Segment>
    );
  }
  if (xe > L + Math.abs(xwd)) {
    return (
      <Segment
        inverted={true} color="orange"
        secondary={true} style={styles.diagramErrorLabel}
      >
        <p>Arrival location, x<sub>e</sub>, can not be bigger than L<sup>&apos;</sup>+|xwd|.</p>
      </Segment>
    );
  }
  if (xi > L) {
    return (
      <Segment
        inverted={true} color="orange"
        secondary={true} style={styles.diagramErrorLabel}
      >
        <p>Initial location, x<sub>i</sub>, can not be bigger than the Aquifer length, L<sup>&apos;</sup>.</p>
      </Segment>
    );
  }
  return (
    <div>
      <Segment raised={true} style={styles.diagramLabel}>
        <p>t&nbsp;=&nbsp;<strong>{data[data.length - 1].t.toFixed(1)}</strong>&nbsp;d</p>
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
    </div>

  );
};

const ChartT13C = ({parameters}: IProps) => {
  const {W, K, ne, L, hL, h0, xi, xe} = getParameterValues(parameters);
  const xwd = Number(calculateXwd(L, K, W, hL, h0));
  const data = calculateDiagramDataT13C({w: W, K, ne, L: L + Math.abs(xwd), hL, xMin: xi, xMax: xe, dX: 10});

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
                type="number" domain={['auto', 'auto']}
                dataKey="x" allowDecimals={false}
                tickLine={false}
              >
                <Label
                  value={'x [m]'}
                  offset={0}
                  position="bottom"
                  fill={'#4C4C4C'}
                  style={{fontSize: '13px'}}
                />
              </XAxis>
              <YAxis
                type="number" domain={[0, 'auto']}
                allowDecimals={false} tickLine={false}
                tickFormatter={(x) => x.toFixed(0)}
              >
                <Label
                  angle={270}
                  position="left"
                  style={{textAnchor: 'middle', fontSize: '13px'}}
                  value={'t [d]'}
                  fill={'#4C4C4C'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              <Line
                isAnimationActive={false} type="basis"
                dataKey={'t'} stroke="#4C4C4C"
                strokeWidth="5" dot={false}
                fillOpacity={1}
              />
            </LineChart>
          </ResponsiveContainer>
          {renderLabels(xe, xi, L, data, xwd)}
        </Grid.Column>
      </Grid>
    </div>
  );
};
export default ChartT13C;
