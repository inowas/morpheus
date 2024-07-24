import React, {useEffect, useMemo, useState} from 'react';
import {CartesianGrid, ComposedChart, Line, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis} from 'recharts';

interface ITimeSeriesChartDataItem {
  date_time: string;
  unix_timestamp: number;

  [key: string]: any;
}

interface ITimeSeriesItem {
  key: number;
  name: string;
  color: string;
  data: { date_time: string, value: number }[];
}

interface ISimulatedObservedItem {
  key: number;
  name: string;
  color: string;
  date_time: string;
  simulated: number;
  observed: number;
}

interface IProps {
  timeSeries: ITimeSeriesItem[];
  simulatedObserved: ISimulatedObservedItem[];
  formatDateTime: (value: string) => string;
}

interface IColorMap {
  [key: string]: string;
}

const CombinedTimeSeriesChart = ({timeSeries, simulatedObserved, formatDateTime}: IProps) => {

  const [timeStamps, setTimeStamps] = useState<number[]>([]);

  const isoDateToEpoch = (isoDate: string) => Date.parse(isoDate);
  const epochToDate = (epoch: number) => new Date(epoch).toISOString();
  const formatTick = (value: number) => formatDateTime(epochToDate(value));

  useEffect(() => {
    if (!timeSeries.length) {
      return;
    }

    // expecting that all time series have the same date_time values,
    // so we take the date_time values from the first time series
    const newTimeStamps = timeSeries[0].data.map((item) => isoDateToEpoch(item.date_time));

    simulatedObserved.forEach((ts) => {
      const tsEpoch = isoDateToEpoch(ts.date_time);
      if (!newTimeStamps.includes(tsEpoch)) {
        newTimeStamps.push(tsEpoch);
      }
    });
    newTimeStamps.sort();
    setTimeStamps(newTimeStamps);

    const newColorMap: IColorMap = {};
    timeSeries.forEach((ts) => {
      newColorMap[ts.name] = ts.color;
    });

    // eslint-disable-next-line
  }, [timeSeries]);


  const chartData = useMemo(() => timeStamps.map((timeStamp) => {
    const item: ITimeSeriesChartDataItem = {
      date_time: epochToDate(timeStamp),
      unix_timestamp: timeStamp,
    };

    timeSeries.forEach((timeSeriesItem) => {
      const value = timeSeriesItem.data.find((dataItem) => isoDateToEpoch(dataItem.date_time) === timeStamp);
      if (value) {
        item[timeSeriesItem.name] = value.value;
      }
    });

    const simObsItem = simulatedObserved.find((so) => isoDateToEpoch(so.date_time) === timeStamp);
    if (simObsItem) {
      item[`${simObsItem.name}_observed`] = simObsItem.observed;
      item[`${simObsItem.name}_simulated`] = simObsItem.simulated;
    }

    return item;
  }), [timeStamps, timeSeries, simulatedObserved]);


  if (!chartData.length) {
    return null;
  }

  return (
    <ResponsiveContainer
      aspect={16 / 9}
      width={'100%'}
      style={{backgroundColor: 'white'}}
    >
      <ComposedChart
        data={chartData}
        margin={{top: 25, right: 20, bottom: 10, left: -20}}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis
          dataKey="unix_timestamp"
          fontSize={12}
          type={'number'}
          tickFormatter={formatTick}
          domain={['dataMin', 'dataMax']}
          ticks={timeStamps}
        />
        <YAxis type={'number'} domain={['auto', 'auto']}/>
        <Tooltip labelFormatter={formatTick}/>

        {timeSeries.map(item => <Line
          key={item.key}
          type="monotone"
          dataKey={item.name}
          color={item.color}
          stroke={item.color}
          strokeWidth={2}
          activeDot={{r: 4}}
          dot={false}
          strokeDasharray="5 5"
        />)}

        {simulatedObserved.map(item => (
          <Scatter
            key={`${item.key}_observed`}
            dataKey={`${item.name}_observed`}
            fill={item.color}
            shape={'cross'}
          />
        ))}

        {simulatedObserved.map(item => (
          <Scatter
            key={`${item.key}_simulated`}
            dataKey={`${item.name}_simulated`}
            fill={item.color}
            shape={'circle'}
          />
        ))}

      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CombinedTimeSeriesChart;
export type {ITimeSeriesItem, ISimulatedObservedItem};
