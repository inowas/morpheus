import {Checkbox, CheckboxProps, Form, Icon, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import React, {ChangeEvent, useRef, useState} from 'react';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';

import {Button, Notification} from 'common/components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import styles from './TimeDiscretizationStressPeriods.module.less';
import {addDays, format, isValid, parseISO} from 'date-fns';
import {IStressPeriod, ITimeDiscretization} from '../../../../types';

interface IProps {
  timeDiscretization: ITimeDiscretization;
  onChange: (value: ITimeDiscretization) => void;
  readOnly: boolean;
}

const TimeDiscretizationStressPeriods: React.FC<IProps> = ({timeDiscretization, onChange, readOnly}) => {
  const tableRef = useRef<HTMLTableSectionElement>(null);

  const [showNotification, setShowNotification] = useState(false);
  const toCsv = () => {
    let text = 'start_date_time;nstp;tsmult;steady\n';
    timeDiscretization.stress_periods.forEach((sp: IStressPeriod) => {
      text += `${parseISO(sp.start_date_time).toISOString()};${sp.number_of_time_steps};${sp.time_step_multiplier};${sp.steady_state ? 1 : 0}\n`;
    });
    return text;
  };

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

    if (!isValid(new Date(lastStressPeriod.start_date_time))) {
      setShowNotification(true);
      return;
    }
    setShowNotification(false);
    const newStressPeriod: IStressPeriod = {
      ...lastStressPeriod,
      start_date_time: addDays(parseISO(lastStressPeriod.start_date_time), 1).toISOString(),
      steady_state: false,
      time_step_multiplier: 1,
      number_of_time_steps: 1,
    };
    onChange({...timeDiscretization, stress_periods: [...timeDiscretization.stress_periods, newStressPeriod]});
  };

  const handleChangeStressPeriod = (key: number, sp: IStressPeriod) => {
    const newStressPeriods = timeDiscretization.stress_periods.map((s: IStressPeriod, idx: number) => (idx === key ? sp : s));
    onChange({...timeDiscretization, stress_periods: newStressPeriods});
  };

  const handleDownload = () => {
    const filename = 'stressperiods.csv';
    const text = toCsv();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
                  value={format(parseISO(sp.start_date_time), 'yyyy-MM-dd')}
                  onChange={(e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
                    const dateValue = parseISO(`${value}`);
                    if (!isValid(dateValue)) {
                      return;
                    }
                    handleChangeStressPeriod(idx, {...sp, start_date_time: format(dateValue, 'yyyy-MM-dd') + 'T00:00:00Z'});
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
