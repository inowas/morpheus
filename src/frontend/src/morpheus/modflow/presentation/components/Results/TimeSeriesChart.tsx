import React, {useEffect, useMemo, useState} from 'react';
import {CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

interface ITimeSeriesChartDataItem {
  date_time: string;

  [key: string]: any;
}

interface IChartItem {
  key: number;
  name: string;
  color: string;
  data: { date_time: string, value: number }[];
}

interface IProps {
  timeSeries: IChartItem[];
  formatDateTime: (value: string) => string;
  selectedTimeStepIdx?: number;
}

interface IColorMap {
  [key: string]: string;
}

const TimeSeriesChart = ({timeSeries, formatDateTime, selectedTimeStepIdx}: IProps) => {

  const [dateTimes, setDateTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!timeSeries.length) {
      return;
    }

    // expecting that all time series have the same date_time values,
    // so we take the date_time values from the first time series
    setDateTimes(timeSeries[0].data.map((item) => item.date_time));

    const newColorMap: IColorMap = {};
    timeSeries.forEach((ts) => {
      newColorMap[ts.name] = ts.color;
    });

    // eslint-disable-next-line
  }, [timeSeries]);

  const isoDateToEpoch = (isoDate: string) => Date.parse(isoDate);
  const epochToDate = (epoch: number) => new Date(epoch).toISOString();
  const formatTick = (value: number) => formatDateTime(epochToDate(value));


  const chartData = useMemo(() => dateTimes.map((date_time) => {
    const item: ITimeSeriesChartDataItem = {
      date_time,
      unix_timestamp: isoDateToEpoch(date_time),
    };

    timeSeries.forEach((ts) => {
      const value = ts.data.find((d) => d.date_time === date_time);
      if (value) {
        item[ts.name] = value.value;
      }
    });

    return item;
  }), [timeSeries, dateTimes]);

  if (!chartData.length) {
    return null;
  }

  return (
    <ResponsiveContainer
      aspect={16 / 9}
      width={'100%'}
      style={{backgroundColor: 'white'}}
    >
      <LineChart
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
          ticks={dateTimes.map(isoDateToEpoch)}
        />
        <YAxis type={'number'} domain={['auto', 'auto']}/>
        <Tooltip labelFormatter={formatTick}/>
        {selectedTimeStepIdx && <ReferenceLine
          x={isoDateToEpoch(dateTimes[selectedTimeStepIdx])}
          stroke='#000'
          strokeOpacity={0.5}
          strokeWidth={5}
          label={{value: formatDateTime(dateTimes[selectedTimeStepIdx]), position: 'top', fill: '#000'}}
        />}

        {timeSeries.map(item => <Line
          key={item.key}
          type="monotone"
          dataKey={item.name}
          color={item.color}
          stroke={item.color}
          strokeWidth={2}
          activeDot={{r: 4}}
        />)}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
export type {IChartItem};
