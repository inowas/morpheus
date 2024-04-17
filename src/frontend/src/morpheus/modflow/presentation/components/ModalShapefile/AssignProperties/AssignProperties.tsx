import React from 'react';
import {Column, DefaultCellTypes, ReactGrid, Row} from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';

interface IStressPeriod {
  id: string;
  name: string;
  layer: string;
  tags: string[];
  stress_period_data: { date: string; latitude: number }[];
}


/*
  This is experementl component DO NOT USE IT
*/
const AssignProperties = ({stressPeriods}: { stressPeriods: IStressPeriod[] }) => {
  const getColumns = (periods: IStressPeriod[]): Column[] => {
    const columns: Column[] = [
      {columnId: 'ID', width: 50},
      {columnId: 'Well name', width: 150},
      {columnId: 'Layer', width: 100},
      {columnId: 'Tags', width: 100},
    ];
    for (let i = 0; 20 > i; i++) {
      columns.push({columnId: 'Latitude', width: 100});
    }
    return columns;
  };

  const headerRow: Row = {
    rowId: 'header',
    cells: [
      {type: 'header', text: 'ID'},
      {type: 'header', text: 'Well name'},
      {type: 'header', text: 'Layer'},
      {type: 'header', text: 'Tags'},
    ],
  };

  const getRows = (periods: IStressPeriod[]): Row[] => {
    const rows: Row[] = [headerRow];

    periods.forEach((period, index) => {
      const cells: DefaultCellTypes[] = [
        {type: 'text', text: (index + 1).toString()},
        {type: 'text', text: period.name},
        {type: 'text', text: period.layer},
        {type: 'text', text: period.tags.toString()},
      ];

      period.stress_period_data.forEach(data => {
        if (data) {
          cells.push({type: 'number', value: data.latitude});
        }
      });

      rows.push({
        rowId: period.id,
        cells,
      });
    });

    return rows;
  };

  const columns = getColumns(stressPeriods);
  const rows = getRows(stressPeriods);

  return (
    <div style={{overflow: 'auto', height: '300px', backgroundColor: 'white'}}>
      <ReactGrid
        rows={rows}
        columns={columns}
        stickyLeftColumns={4}
        stickyTopRows={1}
      />
    </div>
  );
};

export default AssignProperties;
