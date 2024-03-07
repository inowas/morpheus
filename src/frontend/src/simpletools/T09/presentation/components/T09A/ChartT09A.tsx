import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  exportChartData,
  exportChartImage,
} from 'common/components/RechartsWrapper';
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';

import {IT09A} from '../../../types/T09.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface IUseCalculate {
  calculateZ: (h: number, df: number, ds: number) => number;
  calculateDiagramData: (h: number, df: number, ds: number) => [{
    name: string;
    h: number;
    z: number;
  }];
}

interface IProps {
  parameters: IT09A['parameters'];
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
    bottom: 50,
    right: 40,
  },
};

let currentChart: any;

const ChartT09A = ({parameters, calculation}: IProps) => {

  const {h, df, ds} = getParameterValues(parameters);
  const data = calculation.calculateDiagramData(h, df, ds);
  const z = calculation.calculateZ(h, df, ds);
  return (
    <div>
      <Grid>
        <Grid.Column>
          <ResponsiveContainer width="100%" aspect={2.5}>
            <BarChart
              data={data}
              barSize={100}
              margin={styles.chart}
              ref={(chart) => currentChart = chart}
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis tick={false} orientation="top"/>
              <YAxis reversed={true}/>
              <Bar
                isAnimationActive={true} dataKey="h"
                stackId="a" name="Freshwater thickness above sea level, h"
                fill="#1EB1ED"
              />
              <Bar
                isAnimationActive={true} dataKey="z"
                stackId="a" name="Freshwater thickness below sea level, z"
                fill="#DBF3FD"
              />
              <Legend layout="vertical" height={28}/>
            </BarChart>
          </ResponsiveContainer>

          <Segment
            raised={true} style={styles.diagramLabel}
          >
            <p>h&nbsp;=&nbsp;<strong>{h.toFixed(1)}</strong>&nbsp;m</p>
            <p>z&nbsp;=&nbsp;<strong>{z.toFixed(1)}</strong>&nbsp;m</p>
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

export default ChartT09A;
