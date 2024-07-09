import React, {useMemo} from 'react';
import {Point} from 'geojson';
import {TimeSeriesDataChart, ITimeSeriesChartDataItem} from 'common/components/Charts';

interface ITimeSeriesItem {
  id: number;
  name: string;
  layer: number;
  row: number;
  col: number;
  point: Point;
  color: string;
  data: { date_time: string, value: number }[];
}

interface IProps {
  dateTimes: string[];
  timeSeries: ITimeSeriesItem[];
  formatDateTime?: (value: string) => string;
}

interface IColorMap {
  [key: string]: string;
}

const TimeSeriesChart = ({timeSeries, dateTimes, formatDateTime}: IProps) => {

  const chartData = useMemo(() => {

    if (!timeSeries.length || !dateTimes.length) {
      return [];
    }

    const timeSeriesDateTimes = timeSeries[0].data.map((item) => item.date_time);

    return timeSeriesDateTimes.map((date_time) => {
      const item: ITimeSeriesChartDataItem = {date_time};
      timeSeries.forEach((ts) => {
        const value = ts.data.find((d) => d.date_time === date_time);
        if (value) {
          item[ts.name] = value.value;
        }
      });
      return item;
    });
  }, [timeSeries, dateTimes]);

  const getColorMap = (): IColorMap => {
    const colorMap: IColorMap = {};
    timeSeries.forEach((ts) => {
      colorMap[ts.name] = ts.color;
    });
    return colorMap;
  };

  if (!chartData.length) {
    return null;
  }

  return (
    <TimeSeriesDataChart
      dateTimes={dateTimes}
      data={chartData}
      colors={getColorMap()}
      formatDateTime={formatDateTime}
      margin={{top: 20, right: 20, bottom: 10, left: -20}}
    />
  );
};

export default TimeSeriesChart;
export type {ITimeSeriesItem};
