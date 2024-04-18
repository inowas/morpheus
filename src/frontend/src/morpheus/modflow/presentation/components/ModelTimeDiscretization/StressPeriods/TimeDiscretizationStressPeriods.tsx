import {Checkbox, CheckboxProps, Form, Icon, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import React, {ChangeEvent, useRef, useState} from 'react';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';

import {Button, Notification} from 'common/components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import styles from './TimeDiscretizationStressPeriods.module.less';
import {IStressPeriod, ITimeDiscretization} from '../../../../types';
import {useDateTimeFormat} from 'common/hooks';
import Papa from 'papaparse';

interface IProps {
  timeDiscretization: ITimeDiscretization;
  onChange: (value: ITimeDiscretization) => void;
  readOnly: boolean;
  timeZone?: string;
}

const TimeDiscretizationStressPeriods: React.FC<IProps> = ({timeDiscretization, onChange, readOnly, timeZone}) => {

  const {addDays, formatISO, formatISODate, isValid} = useDateTimeFormat(timeZone);

  const tableRef = useRef<HTMLTableSectionElement>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleDeleteAllStressPeriods = () => onChange({
    ...timeDiscretization,
    stress_periods: timeDiscretization.stress_periods.filter((_: IStressPeriod, idx: number) => 0 === idx),
  });

  const handleDeleteStressPeriod = (key: number) => onChange({
    ...timeDiscretization,
    stress_periods: timeDiscretization.stress_periods.filter((_: IStressPeriod, idx: number) => key !== idx),
  });

  const handleAddNewStressPeriod = () => {
    const lastStressPeriod = timeDiscretization.stress_periods[timeDiscretization.stress_periods.length - 1];

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
    setShowNotification(false);
    const newStressPeriod: IStressPeriod = {
      ...lastStressPeriod,
      start_date_time: formatISO(addDays(formatISO(lastStressPeriod.start_date_time), 1)),
      steady_state: false,
      time_step_multiplier: 1,
      number_of_time_steps: 1,
    };
    onChange({...timeDiscretization, stress_periods: [...timeDiscretization.stress_periods, newStressPeriod]});
  };

  const handleChangeStressPeriod = (key: number, sp: IStressPeriod) => {
    console.log(sp);
    const newStressPeriods = timeDiscretization.stress_periods.map((s: IStressPeriod, idx: number) => (idx === key ? sp : s));

    onChange({...timeDiscretization, stress_periods: newStressPeriods});
  };

  const handleDownload = () => {
    const csv = Papa.unparse({
      fields: ['start_date_time', 'number_of_time_steps', 'time_step_multiplier', 'steady_state'],
      data: timeDiscretization.stress_periods.map((sp) => (
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

  const renderBody = () => {
    return (
      <tbody
        className={styles.tableBody}
        ref={tableRef}
      >
        {timeDiscretization.stress_periods.map((sp: IStressPeriod, idx: number) => {
          return (
            <Table.Row className={styles.tableRow} key={idx}>
              <Table.Cell><span>{idx + 1}</span></Table.Cell>
              <Table.Cell>
                <Form.Input
                  disabled={readOnly}
                  type="date"
                  name={'start_date_time'}
                  idx={idx}
                  style={{width: '100%'}}
                  value={formatISODate(sp.start_date_time)}
                  onChange={(e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
                    const dateValue = formatISO(`${value}`);
                    if (!isValid(dateValue)) {
                      return;
                    }
                    handleChangeStressPeriod(idx, {...sp, start_date_time: dateValue});
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                <Form.Input
                  disabled={readOnly}
                  type="number"
                  error={50 < sp.time_step_multiplier}
                  max={50}
                  name="nstp"
                  idx={idx}
                  value={sp.number_of_time_steps}
                  onChange={(_, {value}: InputOnChangeData) => {
                    handleChangeStressPeriod(idx, {...sp, number_of_time_steps: parseInt(value, 10)});
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                <Form.Input
                  disabled={readOnly}
                  type="number"
                  name="tsmult"
                  idx={idx}
                  value={sp.time_step_multiplier.toFixed(3)}
                  onChange={(_, {value}: InputOnChangeData) => {
                    handleChangeStressPeriod(idx, {...sp, time_step_multiplier: parseFloat(value)});
                  }}
                />
              </Table.Cell>
              <Table.Cell style={{textAlign: 'right', width: '70px'}}>
                <Checkbox
                  name={'steady'}
                  checked={sp.steady_state}
                  disabled={readOnly}
                  idx={idx}
                  onChange={(_, {checked}: CheckboxProps) => {
                    handleChangeStressPeriod(idx, {...sp, steady_state: !!checked});
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                {!readOnly && 0 < idx && (
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
  };

  return (
    <div className={styles.stressPeriod}>
      <div
        className={styles.tableWrapper}
      >
        <Table
          className={styles.table}
          unstackable={true}
        >
          {renderHeader()}
          {renderBody()}
        </Table>
      </div>
      <div className={styles.buttonsGroup}>
        <Button
          className='buttonLink'
          onClick={handleAddNewStressPeriod}
        >
          Add new <Icon name="add"/>
        </Button>
        <Button
          className='buttonLink'
          disabled={1 === timeDiscretization.stress_periods.length}
          onClick={handleDeleteAllStressPeriods}
        >
          Delete all <FontAwesomeIcon icon={faTrashCan}/>
        </Button>
        <Button
          className='buttonLink'
          disabled={0 === timeDiscretization.stress_periods.length}
          onClick={handleDownload}
        >
          Download all <FontAwesomeIcon icon={faDownload}/></Button>
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
