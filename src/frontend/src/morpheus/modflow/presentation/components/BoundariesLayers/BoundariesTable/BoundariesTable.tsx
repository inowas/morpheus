import React from 'react';
import DataTable from "./BoundariesDataTable";
import {ISelectedBoundary} from "../../ModelBoundaries/types/SelectedBoundary.type";

interface IProps {
  selectedBoundary: ISelectedBoundary;
  formatDateTime: (dateTime: string) => string;
}

const isNotNullish = (value: any): value is number => value !== null && value !== undefined;

const BoundariesTable = ({selectedBoundary, formatDateTime}: IProps) => {

  const columns = [
    {title: 'Start date', key: 'date_time', format: (value: string) => formatDateTime(value), fallback: '-'},
    {title: 'Head', key: 'head', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
    {title: 'Stage', key: 'stage', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
    {title: 'Conductance', key: 'conductance', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
    {title: 'Surface Elevation', key: 'surface_elevation', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
    {title: 'Evapotranspiration', key: 'evapotranspiration', format: (value: number) => isNotNullish(value) ? value.toFixed(4) : '-', fallback: '-'},
    {title: 'Extinction Depth', key: 'extinction_depth', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
    {title: 'Flow', key: 'flow', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
    {title: 'Precipitation', key: 'precipitation', format: (value: number) => isNotNullish(value) ? value.toFixed(4) : '-', fallback: '-'},
    {title: 'Evaporation', key: 'evaporation', format: (value: number) => isNotNullish(value) ? value.toFixed(4) : '-', fallback: '-'},
    {title: 'Runoff', key: 'runoff', format: (value: number) => isNotNullish(value) ? value.toFixed(4) : '-', fallback: '-'},
    {title: 'Withdrawal', key: 'withdrawal', format: (value: number) => isNotNullish(value) ? value.toFixed(4) : '-', fallback: '-'},
    {title: 'Recharge rate', key: 'recharge_rate', format: (value: number) => isNotNullish(value) ? value.toFixed(4) : '-', fallback: '-'},
    {title: 'River Stage', key: 'river_stage', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
    {title: 'Riverbed Bottom', key: 'riverbed_bottom', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
    {title: 'Pumping Rate', key: 'pumping_rate', format: (value: number | null) => isNotNullish(value) ? value.toFixed(2) : '-', fallback: '-'},
  ];

  const {boundary, observationId} = selectedBoundary;

  const getColumns = () => {
    const observationData = boundary.observations.find(o => o.observation_id === observationId)?.data;

    if (!observationData || observationData.length === 0) {
      return [];
    }
    const dataKeys = Object.keys(observationData[0]);
    return columns.filter(c => dataKeys.includes(c.key));
  }

  const getData = () => {
    const observationData = boundary.observations.find(o => o.observation_id === observationId)?.data;

    if (!observationData) {
      return [];
    }

    return observationData;
  }

  return (
    <DataTable columns={getColumns()} data={getData()}/>
  );
};

export default BoundariesTable;
