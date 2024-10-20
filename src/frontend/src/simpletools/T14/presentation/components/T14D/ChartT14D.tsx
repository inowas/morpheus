import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {CartesianGrid, Label, Line, LineChart, ResponsiveContainer, XAxis, YAxis, exportChartData, exportChartImage} from 'common/components/RechartsWrapper';

import {IT14D} from '../../../types/T14.type';
import React from 'react';
import {calculateDiagramData} from '../../../application/useCalculationsT14D';
import {getParameterValues} from 'simpletools/common/utils';

interface IProps {
  parameters: IT14D['parameters'];
}

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
    bottom: 50,
    right: 40,
  },
};

let currentChart: any;

const renderLabels = (dQ: number) => {

  return (
    <div>
      <Segment raised={true} style={styles.diagramLabel}>
        <p>&#916;Q&nbsp;=&nbsp;<strong>{dQ.toFixed(1)}</strong>&nbsp;m³/d</p>
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

const ChartT14D = ({parameters}: IProps) => {
  const {Qw, t, S, T, d, W, Kdash, Bdashdash, Sigma, bdash} = getParameterValues(parameters);
  const data = calculateDiagramData(Qw, S, T, d, 0, t, Kdash, bdash, Bdashdash, Sigma, W);
  const dQ = data[data.length - 1].dQ;

  return (
    <div>
      <Grid>
        <Grid.Row>
          <ResponsiveContainer width={'100%'} aspect={2.5}>
            <LineChart
              data={data}
              margin={styles.chart}
              ref={(chart) => currentChart = chart}
            >
              <XAxis
                type="number"
                dataKey="t"
                allowDecimals={false}
                tickLine={false}
              >
                <Label
                  value={'T [d]'}
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
                tickFormatter={(x) => x.toFixed(1)}
              >
                <Label
                  angle={270}
                  position="left"
                  style={{textAnchor: 'middle', fontSize: '13px'}}
                  value={'dQ [m³/d]'}
                  fill={'#4C4C4C'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              <Line
                isAnimationActive={true}
                type="basis"
                dataKey={'dQ'}
                stroke="#1EB1ED"
                strokeWidth="5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          {renderLabels(dQ)}
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default ChartT14D;

