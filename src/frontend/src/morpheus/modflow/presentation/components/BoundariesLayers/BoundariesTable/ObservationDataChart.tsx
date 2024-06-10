import React, {useEffect, useState} from 'react';
import {IBoundaryObservationData, IBoundaryType, IObservation} from "../../../../types/Boundaries.type";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {ITimeDiscretization} from "../../../../types";


interface IProps {
  timeDiscretization: ITimeDiscretization;
  observation: IObservation<any>;
}

const ObservationDataChart = ({observation, timeDiscretization}: IProps) => {
  const data = observation.data as IBoundaryObservationData[];
  const dataKeys = Object.keys(data[0]).filter((key) => key !== 'date_time');

  return (
    <ResponsiveContainer width="100%" height={400} style={{backgroundColor: 'white'}}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date_time" fontSize={12} tickFormatter={(value) => value.split('T')[0]}/>
        <YAxis/>
        <Tooltip/>
        <Legend/>
        {dataKeys.map((key: string) => <Line key={key} type="monotone" dataKey={key} stroke="#8884d8" activeDot={{r: 8}}/>)}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ObservationDataChart;
