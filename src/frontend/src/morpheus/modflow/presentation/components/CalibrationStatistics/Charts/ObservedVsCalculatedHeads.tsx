import React from 'react';
import {Segment} from 'semantic-ui-react';
import {CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from 'recharts';

import CustomizedDot from './CustomizedDot';
import DiagramLabel from './DiagramLabel';

import {IStatistics} from '../../../../types/HeadObservations.type';

interface IProps {
  statistics: IStatistics;
  colors: string[];
}

const ObservedVsCalculatedHeads = (props: IProps) => {
  const stats = props.statistics;
  const simulated = stats.data.map((d) => d.simulated);
  const observed = stats.data.map((d) => d.observed);
  const deltaStd = stats.stats.observed.deltaStd;
  const {linRegObsSim, names} = stats;

  const data = stats.data.map((d) => ({x: d.observed, y: d.simulated, name: d.name}));

  const min = Math.floor(Math.min(...observed, ...simulated));
  const max = Math.ceil(Math.max(...observed, ...simulated));
  const line = [{x: min, y: min}, {x: max, y: max}];
  const linePlusDelta = [{x: min, y: min + deltaStd}, {x: max, y: max + deltaStd}];
  const lineMinusDelta = [{x: min, y: min - deltaStd}, {x: max, y: max - deltaStd}];

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
            name={'observed'}
            domain={[min, max]}
            label={{value: 'Observed Head [m]', angle: 0, position: 'bottom'}}
          />
          <YAxis
            dataKey={'y'}
            type="number"
            name={'simulated'}
            domain={['auto', 'auto']}
            label={{value: 'Simulated Head [m]', angle: -90, position: 'left'}}
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
            data={line} line={{stroke: 'black', strokeWidth: 2}}
            shape={() => <div/>}
          />
          <Scatter
            data={linePlusDelta} line={{stroke: 'red', strokeWidth: 2}}
            shape={() => <div/>}
          />
          <Scatter
            data={lineMinusDelta} line={{stroke: 'red', strokeWidth: 2}}
            shape={() => <div/>}
          />
          <Tooltip cursor={{strokeDasharray: '3 3'}}/>
        </ScatterChart>
      </ResponsiveContainer>
      <DiagramLabel>
        <>
          <p>{linRegObsSim.eq}</p>
          <p>R<sup>2</sup> = {linRegObsSim.r}</p>
        </>
      </DiagramLabel>
    </Segment>
  );

};

export default ObservedVsCalculatedHeads;
