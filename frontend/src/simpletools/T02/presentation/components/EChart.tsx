import React from 'react';
import {CartesianGrid, Label, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {Grid, Segment} from 'semantic-ui-react';
import {IT02} from '../../types/T02.type';
import ReactECharts from 'echarts-for-react';
import 'echarts-gl';

const styles = {
  diagramLabel: {
    position: 'absolute',
    backgroundColor: '#eff3f6',
    opacity: 0.9,
    top: 24,
    right: 40,
  },
};

interface ICalculateDiagramData {
  variable: string;
  w: number;
  L: number;
  W: number;
  hi: number;
  Sy: number;
  K: number;
  t: number;
  min: number;
  max: number;
  stepSize: number;
}

interface ICalculateChartXMax {
  variable: string;
  w: number;
  L: number;
  W: number;
  hi: number;
  Sy: number;
  K: number;
  t: number;
}

interface IMounding {
  calculateHi: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
  calculateHMax: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
}

interface IProps {
  settings: IT02['settings'];
  parameters: IT02['parameters'];
  mounding: IMounding;
}

const getParameterValues = (arr: IT02['parameters']) => {
  let returnValue: { [key: string]: any } = {};

  arr.forEach((item) => {
    returnValue[item.id] = item.value;
  });

  return returnValue;
};

const calculateDiagramData = ({variable, w, L, W, hi, Sy, K, t, min, max, stepSize}: ICalculateDiagramData, mounding: IMounding) => {
  const data = [];
  if ('x' === variable) {
    for (let x = min; x < max; x += stepSize) {
      data.push({x: x / 2, hhi: mounding.calculateHi(x, 0, w, L, W, hi, Sy, K, t)});
    }
    data.push({x: max / 2, hhi: mounding.calculateHi(max, 0, w, L, W, hi, Sy, K, t)});
    return data;
  }

  for (let y = min; y < max; y += stepSize) {
    data.push({y: y / 2, hhi: mounding.calculateHi(0, y, w, L, W, hi, Sy, K, t)});
  }
  data.push({y: max / 2, hhi: mounding.calculateHi(0, max, w, L, W, hi, Sy, K, t)});
  return data;
};

const calculateChartXMax = ({variable, w, L, W, hi, Sy, K, t}: ICalculateChartXMax, mounding: IMounding) => {
  if ('x' === variable) {
    for (let x = 0; 10000 > x; x += 10) {
      const result = mounding.calculateHi(x, 0, w, L, W, hi, Sy, K, t);
      if (0.01 >= result) {
        return x;
      }
    }
    return 0;
  }

  for (let y = 0; 10000 > y; y += 10) {
    const result = mounding.calculateHi(0, y, w, L, W, hi, Sy, K, t);
    if (0.01 >= result) {
      // noinspection JSSuspiciousNameCombination
      return y;
    }
  }

  return 0;
};


const EChart = ({settings, parameters, mounding}: IProps) => {
  const variable = settings.variable;
  const {L, W, w, hi, Sy, K, t} = getParameterValues(parameters);

  let chartXMaxFromBasin = 2 * L;
  if ('x' === variable) {
    chartXMaxFromBasin = 2 * W;
  }

  let chartXMax;
  const chartXMaxFromCurve = calculateChartXMax({variable, w, L, W, hi, Sy, K, t}, mounding);
  if (chartXMaxFromCurve < chartXMaxFromBasin) {
    chartXMax = chartXMaxFromBasin;
  } else {
    chartXMax = chartXMaxFromCurve;
  }

  const data = calculateDiagramData({variable, w, L, W, hi, Sy, K, t, min: 0, max: chartXMax, stepSize: Math.ceil(chartXMax / 10)}, mounding);
  const hMax = data[0].hhi + hi;

  let xAxis = (
    <XAxis type="number" dataKey="y">
      <Label
        fill={'#4C4C4C'}
        value="y [m]"
        offset={0}
        position="bottom"
      />
    </XAxis>
  );
  let rLabel = 'L/2';

  if ('x' === variable) {
    xAxis = (
      <XAxis
        type="number" dataKey="x"
        tick={{fontSize: 'small', transform: 'translate(0, 5)'}}
      >
        <Label
          fill={'#4C4C4C'}
          value="x [m]"
          offset={0}
          position="bottom"
          style={{fontSize: '13px'}}
        />
      </XAxis>
    );
    rLabel = 'W/2';
  }

  let currentChart;

  const scaledData = data.map(({x, hhi}, index) => [x, index, hhi]);

  const chartOptions3D = {
    tooltip: {},
    backgroundColor: '#fff',
    visualMap: {
      show: false,
      dimension: 2,
      min: 0,
      max: 30,
      inRange: {
        color: [
          '#1EB1ED',
          '#1EB1ED',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026',
        ],
      },
    },
    xAxis3D: {
      type: 'value',
    },
    yAxis3D: {
      type: 'value',
    },
    zAxis3D: {
      type: 'value',
    },
    grid3D: {
      viewControl: {
        projection: 'orthographic',
      },
    },
    series: [
      {
        type: 'line3D',
        data: scaledData,
        lineStyle: {
          width: 25,
        },
      },
    ],


  };

  return (
    <div>
      <Grid>
        <Grid.Column>
          <ReactECharts option={chartOptions3D}/>
          <ResponsiveContainer width={'100%'} aspect={2.5}>
            <LineChart
              data={data}
              margin={{top: 20, right: 20, bottom: 0, left: 20}}
              ref={(chart) => currentChart = chart}
            >
              {xAxis}
              <YAxis
                type="number" tickLine={false}
                tick={{fontSize: 'small', transform: 'translate(-3, 0)'}}
              >
                <Label
                  angle={270}
                  fill={'#4C4C4C'}
                  position="left"
                  style={{fontSize: '13px'}}
                  value={'h-hᵢ [m]'}
                />
              </YAxis>
              <CartesianGrid strokeDasharray="3 3"/>
              <Line
                // isAnimationActive={true}
                type="basis"
                dataKey={'hhi'}
                stroke="#1EB1ED"
                strokeWidth="5" dot={false}
              />
              <ReferenceLine
                x={chartXMaxFromBasin / 4}
                stroke="black"
                strokeWidth="3"
                label={{position: 'top', value: rLabel}}
              />
            </LineChart>
          </ResponsiveContainer>
          <Segment raised={true} style={styles.diagramLabel}>
            <p>h<sub>max</sub>&nbsp;=&nbsp;<strong>{hMax.toFixed(2)}</strong>&nbsp;m</p>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default EChart;


// [{x: 0, hhi: 0.1415148622872664},
// {x: 3.5, hhi: 0.13684090297830664},
// {x: 7, hhi: 0.1218412573109049},
// {x: 10.5, hhi: 0.09374553966213739},
// {x: 14, hhi: 0.06699958962258279},
// {x: 17.5, hhi: 0.04873001459559134},
// {x: 21, hhi: 0.03565840687249988},
// {x: 24.5, hhi: 0.026062702584560782},
// {x: 28, hhi: 0.01894394794891241},
// {x: 31.5, hhi: 0.013654733747344494},
// {x: 35, hhi: 0.00974091771377772}]


// [{x: 0, y: 0.1415148622872664, z: 0},
// {x: 3.5, y: 0.13684090297830664, z: 0.02},
// {x: 7, y: 0.1218412573109049, z: 0.04},
// {x: 10.5, y: 0.09374553966213739, z: 0.06},
// {x: 14, y: 0.06699958962258279, z: 0.08},
// {x: 17.5, y: 0.04873001459559134, z: 0.1},
// {x: 21, y: 0.03565840687249988, z: 0.12},
// {x: 24.5, y: 0.026062702584560782, z: 0.14},
// {x: 28, y: 0.01894394794891241, z: 0.16},
// {x: 31.5, y: 0.013654733747344494, z: 0.18},
// {x: 35, y: 0.00974091771377772, z: 0.2},]