import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import {IBoundaries} from '../type/BoundariesContent.type';
import {useDateTimeFormat} from '../../../../../../common/hooks';

interface IProps {
  boundaries: IBoundaries[];
  // selectedItems: string[];
  selectedObservation: string[];
  timeZone?: string;
}

const BoundariesTable = ({boundaries, selectedObservation, timeZone}: IProps) => {

  const {format} = useDateTimeFormat(timeZone);
  const [data, setData] = useState<IBoundaries[]>([]);

  useEffect(() => {
    const filteredBoundaries = boundaries.map(boundary => ({
      ...boundary,
      observations: boundary.observations.filter(observation =>
        selectedObservation.includes(observation.observation_id),
      ),
    })).filter(boundary => 0 < boundary.observations.length);
    setData(filteredBoundaries);
  }, [boundaries, selectedObservation]);


  return (
    <Table celled={true} striped={true}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Start date</TableHeaderCell>
          <TableHeaderCell>Stage</TableHeaderCell>
          <TableHeaderCell>Pumping rate (m3/day)</TableHeaderCell>
          <TableHeaderCell>Recharge rate</TableHeaderCell>
          <TableHeaderCell>River Stag</TableHeaderCell>
          <TableHeaderCell>Riverbed Bottom</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(boundary =>
          boundary.observations.map(observation =>
            observation.raw_data.map((data, index) => (
              <TableRow key={`${boundary.id}_${observation.observation_id}_${index}`}>
                <TableCell>{observation.observation_name}</TableCell>
                <TableCell>{format(data.date_time, 'dd.MM.yyyy')}</TableCell>
                <TableCell>{data.stage || ''}</TableCell>
                <TableCell>{data.pumping_rate || ''}</TableCell>
                <TableCell>{data.recharge_rate || ''}</TableCell>
                <TableCell>{data.river_stage || ''}</TableCell>
                <TableCell>{data.riverbed_bottom || ''}</TableCell>
              </TableRow>
            )),
          ),
        )}
      </TableBody>
    </Table>);
};

export default BoundariesTable;
