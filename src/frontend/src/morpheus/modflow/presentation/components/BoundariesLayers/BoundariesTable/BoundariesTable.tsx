import React, {useEffect, useState} from 'react';
import {Icon, Popup, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow} from 'semantic-ui-react';
import {IBoundaries} from '../type/BoundariesContent.type';
import styles from './BoundariesTable.module.less';
import {useDateTimeFormat} from '../../../../../../common/hooks';
import {getBoundariesByType} from '../helpers/BoundariesContent.helpers';
import {v4 as uuidv4} from 'uuid';

interface IProps {
  boundaries: IBoundaries[];
  type?: string;
  selectedObservation: string[];
  timeZone?: string;
}

const BoundariesTable = ({boundaries, type, selectedObservation, timeZone}: IProps) => {

  const {format} = useDateTimeFormat(timeZone);
  const [listItems, setListItems] = useState<IBoundaries[]>([]);
  const [data, setData] = useState<IBoundaries[]>([]);

  useEffect(() => {
    setListItems(type ? getBoundariesByType(boundaries, type) : boundaries);
  }, [boundaries, type]);

  useEffect(() => {
    const filteredBoundaries = listItems.map(boundary => ({
      ...boundary,
      observations: boundary.observations.filter(observation =>
        selectedObservation.includes(observation.observation_id),
      ),
    })).filter(boundary => 0 < boundary.observations.length);
    setData(filteredBoundaries);
  }, [listItems, selectedObservation]);


  const renderHeader = () => {

    let headerCells = [];
    switch (type) {
    case 'well':
      headerCells = [
        'Start date',
        'Pumping rate (m3/day)',
      ];
      break;
    case 'general_head':
      headerCells = [
        'Start date',
        'Conductance',
        'Stage',
      ];
      break;
    case 'recharge':
      headerCells = [
        'Start date',
        'Recharge rate',
      ];
      break;
    case 'river':
      headerCells = [
        'Start date',
        'River Stag',
        'Riverbed Bottom',
      ];
      break;
    default:
      headerCells = [
        'Start date',
        'Stage',
        'Conductance',
        'Recharge rate',
        'River Stag',
        'Riverbed Bottom',
      ];
    }

    return headerCells.map((headerCell, index) => (
      <TableHeaderCell
        className={`${styles.headerCell} field`}
        key={index}
      >
        <Popup
          trigger={<Icon
            name="info circle"
          />}
          content={headerCell}
          hideOnScroll={true}
          size="tiny"
        />
        {headerCell}
      </TableHeaderCell>
    ));
  };

  const renderBody = () => {
    return data.flatMap(boundary =>
      boundary.observations.flatMap(observation =>
        observation.raw_data.map((item, index) => {
          switch (type) {
          case 'well':
            return (
              <TableRow key={uuidv4()}>
                <TableCell>{format(item.date_time, 'dd.MM.yyyy')}</TableCell>
                <TableCell>{item.pumping_rate || ''}</TableCell>
              </TableRow>
            );
          case 'general_head':
            return (
              <TableRow key={uuidv4()}>
                <TableCell>{format(item.date_time, 'dd.MM.yyyy')}</TableCell>
                <TableCell>{item.stage || ''}</TableCell>
                <TableCell>{item.conductance || ''}</TableCell>
              </TableRow>
            );
          case 'recharge':
            return (
              <TableRow key={uuidv4()}>
                <TableCell>{format(item.date_time, 'dd.MM.yyyy')}</TableCell>
                <TableCell>{item.recharge_rate || ''}</TableCell>
              </TableRow>
            );
          case 'river':
            return (
              <TableRow key={uuidv4()}>
                <TableCell>{format(item.date_time, 'dd.MM.yyyy')}</TableCell>
                <TableCell>{item.river_stage || ''}</TableCell>
                <TableCell>{item.riverbed_bottom || ''}</TableCell>
              </TableRow>
            );
          default:
            return (
              <TableRow key={uuidv4()}>
                <TableCell>{format(item.date_time, 'dd.MM.yyyy')}</TableCell>
                <TableCell>{item.stage || ''}</TableCell>
                <TableCell>{item.conductance || ''}</TableCell>
                <TableCell>{item.pumping_rate || ''}</TableCell>
                <TableCell>{item.recharge_rate || ''}</TableCell>
                <TableCell>{item.river_stage || ''}</TableCell>
                <TableCell>{item.riverbed_bottom || ''}</TableCell>
              </TableRow>
            );
          }
        }),
      ),
    );
  };
  
  return (
    <div className='scrollableTable'>
      <Table
        celled={true} striped={true}
      >
        <TableHeader>
          <TableRow>
            {renderHeader()}
          </TableRow>
        </TableHeader>

        <TableBody>
          {renderBody()}
        </TableBody>
      </Table>
    </div>);
};

export default BoundariesTable;
