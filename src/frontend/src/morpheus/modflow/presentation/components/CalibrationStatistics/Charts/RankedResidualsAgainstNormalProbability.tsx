import {CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from 'recharts';
import DiagramLabel from './DiagramLabel';
import {IStatistics} from '../../../../types/HeadObservations.type';
import {Segment} from 'semantic-ui-react';
import CustomizedDot from './CustomizedDot';
import React from 'react';

interface IProps {
  statistics: IStatistics;
  colors: string[];
}

const RankedResidualsAgainstNormalProbability = (props: IProps) => {
  const stats = props.statistics;
  const {linRegObsRResNpf, names} = stats;

  const data = stats.data.map((d) => ({x: d.residual, y: d.npf, name: d.name}));
  const xMin = Math.floor(stats.stats.residual.min);
  const xMax = Math.ceil(stats.stats.residual.max);

  const line = [{
    x: xMin,
    y: (xMin * linRegObsRResNpf.slope) + linRegObsRResNpf.intercept,
  }, {
    x: xMax,
    y: (xMax * linRegObsRResNpf.slope) + linRegObsRResNpf.intercept,
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
            name={'npf'}
            domain={[xMin, xMax]}
            label={{value: 'Residual', angle: 0, position: 'bottom'}}
          />
          <YAxis
            dataKey={'y'}
            type="number"
            name={'ranked residuals'}
            domain={['auto', 'auto']}
            label={{value: 'Normal Probability Function', angle: -90, position: 'left'}}
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
          <Tooltip cursor={{strokeDasharray: '3 3'}} />
        </ScatterChart>
      </ResponsiveContainer>
      <DiagramLabel>
        <>
          <p>{linRegObsRResNpf.eq}</p>
          <p>R<sup>2</sup> = {linRegObsRResNpf.r}</p>
        </>
      </DiagramLabel>
    </Segment>
  );
};

export default RankedResidualsAgainstNormalProbability;
