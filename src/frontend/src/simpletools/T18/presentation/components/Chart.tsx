import {Bar, BarChart, CartesianGrid, Label, ResponsiveContainer, XAxis, YAxis, exportChartData, exportChartImage} from 'components/RechartsWrapper';
import {Button, Grid, Icon} from 'semantic-ui-react';

import {IT18} from '../../types/T18.type';
import React from 'react';
import {calculateDiagramData} from '../../application/useCalculations';
import {getParameterValues} from 'simpletools/common/utils';

const styles = {
  chart: {
    top: 20,
    right: 20,
    left: 0,
    bottom: 0,
  },
  diagramLabel: {
    position: 'absolute',
    bottom: '90px',
    right: '65px',
    background: '#EFF3F6',
    opacity: 0.9,
  },
};


interface IProps {
  settings: IT18['settings'];
  parameters: IT18['parameters'];
}

const Chart = ({parameters, settings}: IProps) => {
  const {LLRN, LLRO, Q, IR, OD, Cn, Co} = getParameterValues(parameters);
  const {AF} = settings;
  const data = calculateDiagramData(LLRN, LLRO, AF, Q, IR, OD, Cn, Co);

  let currentChart: any;

  return (
    <div>
      <Grid>
        <Grid.Column>
          <ResponsiveContainer width="100%" aspect={2.5}>
            <BarChart
              layout="vertical"
              data={data}
              margin={styles.chart}
              ref={(chart) => currentChart = chart}
            >
              <XAxis type="number">
                <Label
                  value={'Area [m²]'}
                  offset={0}
                  position="bottom"
                  fill={'#4C4C4C'}
                  style={{fontSize: '13px'}}
                />
              </XAxis>
              <YAxis type="category" dataKey="name"/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Bar
                isAnimationActive={false}
                dataKey="value"
                fill="#ED8D05"
              />
            </BarChart>
          </ResponsiveContainer>

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
