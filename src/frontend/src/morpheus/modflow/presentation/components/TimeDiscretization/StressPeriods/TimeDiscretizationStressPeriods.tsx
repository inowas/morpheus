import {Checkbox, CheckboxProps, Form, Icon, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import React, {ChangeEvent} from 'react';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';

import {Button} from 'common/components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import styles from './TimeDiscretizationStressPeriods.module.less';
import {addDays, isValid, parseISO} from 'date-fns';
import {IStressPeriod, ITimeDiscretization} from '../../../../types/TimeDiscretization.type';

interface IProps {
  timeDiscretization: ITimeDiscretization;
  onChange: (value: ITimeDiscretization) => void;
  readOnly: boolean;
}

const TimeDiscretizationStressPeriods: React.FC<IProps> = ({timeDiscretization, onChange, readOnly}) => {

  const toCsv = () => {
    let text = 'start_date_time;nstp;tsmult;steady\n';
    timeDiscretization.stressPeriods.forEach((sp: IStressPeriod) => {
      text += `${parseISO(sp.startDateTime).toISOString()};${sp.numberOfTimeSteps};${sp.timeStepMultiplier};${sp.steadyState ? 1 : 0}\n`;
    });
    return text;
  };

  const handleDeleteAllStressPeriods = () => onChange({
    ...timeDiscretization,
    stressPeriods: timeDiscretization.stressPeriods.filter((_: IStressPeriod, idx: number) => 0 === idx),
  });

  const handleDeleteStressPeriod = (key: number) => onChange({
    ...timeDiscretization,
    stressPeriods: timeDiscretization.stressPeriods.filter((_: IStressPeriod, idx: number) => key !== idx),
  });

  const handleAddNewStressPeriod = () => {
    const lastStressPeriod = timeDiscretization.stressPeriods[timeDiscretization.stressPeriods.length - 1];
    const newStressPeriod: IStressPeriod = {
      ...lastStressPeriod,
      startDateTime: addDays(parseISO(lastStressPeriod.startDateTime), 1).toISOString(),
      steadyState: false,
      timeStepMultiplier: 1,
      numberOfTimeSteps: 1,
    };
    onChange({...timeDiscretization, stressPeriods: [...timeDiscretization.stressPeriods, newStressPeriod]});
  };

  const handleChangeStressPeriod = (key: number, sp: IStressPeriod) => {
    const newStressPeriods = timeDiscretization.stressPeriods.map((s: IStressPeriod, idx: number) => (idx === key ? sp : s));
    onChange({...timeDiscretization, stressPeriods: newStressPeriods});
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
      <Table.Body className={styles.tableBody}>
        {timeDiscretization.stressPeriods.map((sp: IStressPeriod, idx: number) => (
          <Table.Row className={styles.tableRow} key={idx}>
            <Table.Cell><span>{idx + 1}</span></Table.Cell>
            <Table.Cell>
              <Form.Input
                disabled={readOnly}
                type="date"
                name={'start_date_time'}
                idx={idx}
                style={{width: '100%'}}
                value={parseISO(sp.startDateTime).toISOString().split('T')[0]}
                onChange={(e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
                  const dateValue = parseISO(`${value}T00:00:00Z`);
                  if (!isValid(dateValue)) {
                    return;
                  }
                  handleChangeStressPeriod(idx, {...sp, startDateTime: dateValue.toISOString()});
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                disabled={readOnly}
                type="number"
                error={50 < sp.timeStepMultiplier}
                max={50}
                name="nstp"
                idx={idx}
                value={sp.numberOfTimeSteps}
                onChange={(_, {value}: InputOnChangeData) => {
                  handleChangeStressPeriod(idx, {...sp, numberOfTimeSteps: parseInt(value, 10)});
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                disabled={readOnly}
                type="number"
                name="tsmult"
                idx={idx}
                value={sp.timeStepMultiplier.toFixed(3)}
                onChange={(_, {value}: InputOnChangeData) => {
                  handleChangeStressPeriod(idx, {...sp, timeStepMultiplier: parseFloat(value)});
                }}
              />
            </Table.Cell>
            <Table.Cell style={{textAlign: 'right', width: '70px'}}>
              <Checkbox
                name={'steady'}
                checked={sp.steadyState}
                disabled={readOnly}
                idx={idx}
                onChange={(_, {checked}: CheckboxProps) => {
                  handleChangeStressPeriod(idx, {...sp, steadyState: !!checked});
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
        ))}
      </Table.Body>
    );
  };

  return (
    <div className={styles.stressPeriod}>
      <div className={styles.tableWrapper}>
        <Table className={styles.table} unstackable={true}>
          {renderHeader()}
          {renderBody()}
        </Table>
      </div>
      <div className={styles.buttonsGroup}>
        <Button className='buttonLink' onClick={handleAddNewStressPeriod}>
          Add new <Icon name="add"/>
        </Button>
        <Button
          className='buttonLink'
          disabled={0 === timeDiscretization.stressPeriods.length}
          onClick={handleDeleteAllStressPeriods}
        >
          Delete all <FontAwesomeIcon icon={faTrashCan}/>
        </Button>
        <Button
          className='buttonLink'
          disabled={0 === timeDiscretization.stressPeriods.length}
          onClick={handleDownload}
        >
          Download all <FontAwesomeIcon icon={faDownload}/></Button>
      </div>
    </div>
  );
};

export default TimeDiscretizationStressPeriods;
