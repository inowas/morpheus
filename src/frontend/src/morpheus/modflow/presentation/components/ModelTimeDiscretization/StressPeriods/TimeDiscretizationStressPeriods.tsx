import {Checkbox, CheckboxProps, Dropdown, Form, Icon, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import React, {useRef, useState} from 'react';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';

import {Button, Notification} from 'common/components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import styles from './TimeDiscretizationStressPeriods.module.less';
import {IStressPeriod} from '../../../../types';
import {useDateTimeFormat} from 'common/hooks';
import Papa from 'papaparse';
import {DateInput, NumberInput} from '../FormInput';

interface IProps {
  stressPeriods: IStressPeriod[];
  onChange: (value: IStressPeriod[]) => void;
  isReadOnly: boolean;
  timeZone?: string;
}

const TimeDiscretizationStressPeriods: React.FC<IProps> = ({stressPeriods, onChange, isReadOnly, timeZone}) => {

  const {addDays, addWeeks, addMonths, addYears, formatISODate, isValid, parseDate} = useDateTimeFormat(timeZone);

  const tableRef = useRef<HTMLTableSectionElement>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleDeleteAllStressPeriods = () => {
    const newStressPeriods = stressPeriods.filter((_: IStressPeriod, idx: number) => 0 === idx);
    onChange(newStressPeriods);
  };

  const handleDeleteStressPeriod = (idx: number) => {
    const newStressPeriods = stressPeriods.filter((_: IStressPeriod, index: number) => idx !== index);
    onChange(newStressPeriods);
  };

  const handleAddNewStressPeriod = (timeToAdd: '1d' | '1w' | '1m' | '1y' = '1d') => {
    const lastStressPeriod = stressPeriods[stressPeriods.length - 1];

    if (tableRef.current) {
      const scrollHeight = tableRef.current.scrollHeight;
      const offsetHeight = tableRef.current.offsetHeight;
      const maxScrollTop = scrollHeight - offsetHeight;
      tableRef.current.scrollTo({
        top: maxScrollTop,
        behavior: 'smooth',
      });
    }

    if (!isValid(lastStressPeriod.start_date_time)) {
      setShowNotification(true);
      return;
    }

    let newStartDate = addDays(lastStressPeriod.start_date_time, 1);
    if ('1w' === timeToAdd) {
      newStartDate = addWeeks(lastStressPeriod.start_date_time, 1);
    }

    if ('1m' === timeToAdd) {
      newStartDate = addMonths(lastStressPeriod.start_date_time, 1);
    }

    if ('1y' === timeToAdd) {
      newStartDate = addYears(lastStressPeriod.start_date_time, 1);
    }

    setShowNotification(false);
    const newStressPeriod: IStressPeriod = {
      ...lastStressPeriod,
      start_date_time: newStartDate,
      steady_state: false,
      time_step_multiplier: 1,
      number_of_time_steps: 1,
    };
    const newStressPeriods = [...stressPeriods, newStressPeriod];
    onChange(newStressPeriods);
  };

  const handleChangeStressPeriod = (key: number, sp: IStressPeriod) => {
    const newStressPeriods = stressPeriods.map((s: IStressPeriod, idx: number) => (idx === key ? sp : s));
    onChange(newStressPeriods);
  };

  const handleDownload = () => {
    const csv = Papa.unparse({
      fields: ['start_date_time', 'number_of_time_steps', 'time_step_multiplier', 'steady_state'],
      data: stressPeriods.map((sp) => (
        [sp.start_date_time, sp.number_of_time_steps, sp.time_step_multiplier, sp.steady_state]
      )),
    });

    const mimeType = 'text/csv';
    const blob = new Blob([csv], {type: `${mimeType};charset=utf-8`});
    const link = document.createElement('a');

    if (undefined === link.download) {
      return;
    }
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'stressperiods.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderHeader = () => (
    <Table.Header className={styles.tableHeader}>
      <Table.Row className={styles.tableRow}>
        <Table.HeaderCell>No</Table.HeaderCell>
        <Table.HeaderCell><Icon className={'dateIcon'} name="info circle"/>Start Date</Table.HeaderCell>
        <Popup
          trigger={
            <Table.HeaderCell>
              <Icon className={'dateIcon'} name="info circle"/> Time steps
            </Table.HeaderCell>
          }
          content="No. of time steps"
          hideOnScroll={true}
          size="tiny"
        />
        <Popup
          trigger={
            <Table.HeaderCell><Icon className={'dateIcon'} name="info circle"/>Multiplier</Table.HeaderCell>
          }
          content="Time step multiplier"
          hideOnScroll={true}
          size="tiny"
        />
        <Popup
          trigger={
            <Table.HeaderCell style={{textAlign: 'center', width: '70px'}}>
              <Icon className={'dateIcon'} name="info circle"/>Steady
            </Table.HeaderCell>
          }
          content="State of stress period"
          hideOnScroll={true}
          size="tiny"
        />
        <Table.HeaderCell/>
      </Table.Row>
    </Table.Header>
  );

  const renderBody = () => (
    <tbody className={styles.tableBody} ref={tableRef}>

      {stressPeriods.map((sp: IStressPeriod, idx: number) => {
        return (
          <Table.Row className={styles.tableRow} key={idx}>
            <Table.Cell><span>{idx + 1}</span></Table.Cell>
            <Table.Cell>
              <DateInput
                value={formatISODate(sp.start_date_time)}
                isReadOnly={isReadOnly}
                onChange={(value) => handleChangeStressPeriod(idx, {...sp, start_date_time: parseDate(value)})}
                isValid={(value) => isValid(parseDate(value))}
              />
            </Table.Cell>
            <Table.Cell>
              <NumberInput
                value={sp.number_of_time_steps}
                isReadOnly={isReadOnly}
                precision={0}
                onChange={(value) => handleChangeStressPeriod(idx, {...sp, number_of_time_steps: value})}
                textAlign={'right'}
              />
            </Table.Cell>
            <Table.Cell>
              <NumberInput
                value={sp.time_step_multiplier}
                isReadOnly={isReadOnly}
                onChange={(value) => handleChangeStressPeriod(idx, {...sp, time_step_multiplier: value})}
                precision={2}
                textAlign={'right'}
              />
            </Table.Cell>
            <Table.Cell style={{textAlign: 'right', width: '70px'}}>
              <Checkbox
                name={'steady'}
                checked={sp.steady_state}
                disabled={isReadOnly}
                idx={idx}
                onChange={(_, {checked}: CheckboxProps) => handleChangeStressPeriod(idx, {...sp, steady_state: !!checked})}
              />
            </Table.Cell>
            <Table.Cell>
              {!isReadOnly && 0 < idx && (
                <Button onClick={() => handleDeleteStressPeriod(idx)}>
                  <FontAwesomeIcon icon={faTrashCan}/>
                </Button>
              )}
            </Table.Cell>
          </Table.Row>
        );
      })}
    </tbody>
  );

  return (
    <div className={styles.stressPeriod}>
      <div
        className={styles.tableWrapper}
      >
        <Table className={styles.table} unstackable={true}>
          {renderHeader()}
          {renderBody()}
        </Table>
      </div>
      <div className={styles.buttonsGroup}>
        <Dropdown
          icon={null}
          trigger={<Button className='buttonLink'>Add new <Icon name="add"/></Button>}
          options={
            [
              {key: '1', text: '+ 1 day', onClick: () => handleAddNewStressPeriod('1d')},
              {key: '2', text: '+ 1 week', onClick: () => handleAddNewStressPeriod('1w')},
              {key: '3', text: '+ 1 month', onClick: () => handleAddNewStressPeriod('1m')},
              {key: '4', text: '+ 1 year', onClick: () => handleAddNewStressPeriod('1y')},
            ]
          }
        />
        <Button
          className='buttonLink'
          disabled={1 === stressPeriods.length}
          onClick={handleDeleteAllStressPeriods}
        >
          Delete all <FontAwesomeIcon icon={faTrashCan}/>
        </Button>
        <Button
          className='buttonLink'
          disabled={0 === stressPeriods.length}
          onClick={handleDownload}
        >
          Download all <FontAwesomeIcon icon={faDownload}/>
        </Button>
      </div>
      {showNotification && (
        <Notification warning={true}>
          Please check the last stress period
        </Notification>
      )}
    </div>
  );
};

export default TimeDiscretizationStressPeriods;
