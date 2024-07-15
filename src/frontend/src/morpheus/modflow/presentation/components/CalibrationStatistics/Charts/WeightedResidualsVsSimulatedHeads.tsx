import React from 'react';
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {Segment} from 'semantic-ui-react';

import CustomizedDot from './CustomizedDot';
import DiagramLabel from './DiagramLabel';

import {IStatistics} from '../../../../types/HeadObservations.type';

interface IProps {
  statistics: IStatistics;
  colors: string[];
}

const WeightedResidualsVsSimulatedHeads = (props: IProps) => {
  const stats = props.statistics;
  const simulated = stats.data.map((d) => d.simulated);
  const weightedResiduals = stats.data.map((d) => d.residual);
  const {linRegResSim, names} = stats;

  const data = stats.data.map((d) => ({x: d.simulated, y: d.residual, name: d.name}));

  const xMin = Math.floor(Math.min(...simulated));
  const xMax = Math.ceil(Math.max(...simulated));
  const yMin = Math.floor(Math.min(...weightedResiduals));
  const yMax = Math.ceil(Math.max(...weightedResiduals));

  // noinspection JSSuspiciousNameCombination
  const domainY = Math.ceil(Math.max(yMax, yMin));
  const line = [{
    x: xMin,
    y: (xMin * linRegResSim.slope) + linRegResSim.intercept,
  }, {
    x: xMax,
    y: (xMax * linRegResSim.slope) + linRegResSim.intercept,
  }];

  return (
    <Segment raised={true}>
      <ResponsiveContainer width={'100%'} aspect={2.0}>
        <ScatterChart
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
        >
          <CartesianGrid/>
          <XAxis
            dataKey={'x'}
            type="number"
            name={'simulated'}
            domain={[xMin, xMax]}
            label={{value: 'Simulated Head [m a.s.l.]', angle: 0, position: 'bottom'}}
          />
          <YAxis
            dataKey={'y'}
            type="number"
            name={'weighted'}
            domain={[-domainY, domainY]}
            label={{value: 'Residual', angle: -90, position: 'left'}}
          />
          {names.map((n) => data.filter((d) => d.name.startsWith(n)))
            .map((d, idx) => {
              if (0 < d.length) {
                return (
                  <Scatter
                    name={d[0].name}
                    key={idx}
                    data={d}
                    fill={props.colors[idx % props.colors.length]}
                    shape={<CustomizedDot/>}
                    opacity={0.5}
                  />
                );
              }

              return null;
            })
          }
          <Scatter
            data={line} line={{stroke: 'red', strokeWidth: 2}}
            shape={() => <div/>}
          />
          <ReferenceLine
            y={0} stroke="blue"
            strokeWidth={2}
          />
          <Tooltip cursor={{strokeDasharray: '3 3'}}/>
        </ScatterChart>
      </ResponsiveContainer>
      <DiagramLabel>
        <>
          <p>{linRegResSim.eq}</p>
          <p>R<sup>2</sup> = {linRegResSim.r}</p>
        </>
      </DiagramLabel>
    </Segment>
  );
};

export default WeightedResidualsVsSimulatedHeads;
