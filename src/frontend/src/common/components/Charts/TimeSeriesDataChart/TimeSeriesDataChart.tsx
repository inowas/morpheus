import React, {useMemo} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

interface ITimeSeriesChartDataItem {
  date_time: string;

  [key: string]: any;
}

type IIsoDateTimes = string[];

interface IProps {
  dateTimes: IIsoDateTimes;
  data: ITimeSeriesChartDataItem[];
  colors?: { [key: string]: string }
  formatDateTime?: (value: string) => string;
  type?: 'linear' | 'forward_fill';
  margin?: { top: number, right: number, bottom: number, left: number };
}

const TimeSeriesDataChart = ({data, dateTimes, formatDateTime, colors, type = 'linear', margin}: IProps) => {
  const dataKeys = Object.keys(data[0]).filter((key) => 'date_time' !== key);

  const isoDateToEpoch = (isoDate: string) => Date.parse(isoDate);
  const epochToDate = (epoch: number) => new Date(epoch).toISOString();
  const formatTick = (value: number) => {
    if (formatDateTime) {
      return formatDateTime(epochToDate(value));
    }
    return epochToDate(value);
  };

  const chartData = useMemo(() => {
    const minEpoch = isoDateToEpoch(dateTimes[0]);
    const maxEpoch = isoDateToEpoch(dateTimes[dateTimes.length - 1]);

    const filteredData = data
      .map((d) => ({...d, unix_timestamp: isoDateToEpoch(d.date_time)}))
      .filter((d) => d.unix_timestamp >= minEpoch && d.unix_timestamp <= maxEpoch);

    if ('linear' === type) {
      return filteredData;
    }

    if ('forward_fill' === type) {
      const enhancedData: ITimeSeriesChartDataItem[] = [];
      for (const d of filteredData) {
        const enhanced = {...d, unix_timestamp: isoDateToEpoch(d.date_time)};
        if (0 < enhancedData.length) {
          enhancedData.push({...enhancedData[enhancedData.length - 1], unix_timestamp: enhanced.unix_timestamp - 1});
        }
        enhancedData.push(enhanced);
      }

      enhancedData.push({...enhancedData[enhancedData.length - 1], unix_timestamp: maxEpoch});
      return enhancedData;
    }

    return filteredData;

  }, [data, dateTimes]);

  return (
    <ResponsiveContainer
      aspect={16 / 9}
      width={'100%'}
      style={{backgroundColor: 'white'}}
    >
      <LineChart
        data={chartData}
        margin={margin ? margin : {top: 10, right: 10, left: 10, bottom: 10}}
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
        <Legend/>

        {dataKeys.map((key: string) => <Line
          key={key} type="monotone"
          dataKey={key}
          stroke={colors ? colors[key] : '#8884d8'}
          color={colors ? colors[key] : undefined}
          activeDot={{r: 8}}
        />)}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesDataChart;
export type {ITimeSeriesChartDataItem};
