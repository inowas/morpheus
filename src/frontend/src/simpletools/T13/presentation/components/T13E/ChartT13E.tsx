import React from 'react';
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {CartesianGrid, Label, Line, LineChart, ResponsiveContainer, XAxis, YAxis, exportChartData, exportChartImage} from 'components/RechartsWrapper';
import {getParameterValues} from 'simpletools/common/utils';
import {calculateDiagramDataT13E, calculateTravelTimeT13E} from '../../../application/useCalculations';
import {IT13E} from '../../../types/T13.type';

interface IProps {
  parameters: IT13E['parameters'];
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
    left: 50,
  },
};

let currentChart: any;

const renderLabels = (x: number, xi: number, tMax: number) => {
  if (x >= xi) {
    return (
      <Segment
        inverted={true} color="orange"
        secondary={true} style={styles.diagramErrorLabel}
      >
        <p>Initial position <strong>x<sub>i</sub></strong> can not be smaller than location of well <strong>x</strong>.</p>
      </Segment>
    );
  }
  return (
    <div>
      <Segment
        raised={true} style={styles.diagramLabel}
      >
        <p>t&nbsp;=&nbsp;<strong>{tMax.toFixed(1)}</strong>&nbsp;days</p>
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

const ChartT13E = ({parameters}: IProps) => {

  const {Qw, ne, hL, h0, xi, x} = getParameterValues(parameters);
  const data = calculateDiagramDataT13E({Qw, ne, hL, h0, x, xi});
  const tMax = calculateTravelTimeT13E(xi, h0, hL, x, ne, Qw);

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
                domain={['auto', 'auto']}
                dataKey="x"
                allowDecimals={false}
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
                type="number"
                domain={[0, 'auto']}
                allowDecimals={false}
                tickLine={false}
                orientation={'right'}
                tickFormatter={(t) => t.toFixed(0)}
              >
                <Label
                  angle={90}
                  position="right"
                  style={{textAnchor: 'middle', fontSize: '13px'}}
                  value={'t [d]'}
                  fill={'#4C4C4C'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              <Line
                isAnimationActive={false}
                type="basis"
                dataKey={'t'}
                stroke="#1EB1ED"
                strokeWidth="5"
                dot={false}
                fillOpacity={1}
              />
            </LineChart>
          </ResponsiveContainer>
          {renderLabels(x, xi, tMax)}

        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ChartT13E;
