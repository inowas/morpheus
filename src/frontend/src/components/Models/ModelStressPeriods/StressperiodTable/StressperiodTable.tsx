import {Checkbox, CheckboxProps, Form, Grid, Icon, InputOnChangeData, Message, Popup, Table} from 'semantic-ui-react';
import React, {ChangeEvent, MouseEvent, useState} from 'react';
import {Button} from 'components';
import moment from 'moment';
import {IStressperiodParams, StressperiodDataType} from '../../types/Model.type';
import {v4 as uuidv4} from 'uuid';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styles from './StressperiodTable.module.less';

export const MAX_OUTPUT_PER_PERIOD = 50;

interface IProps {
  stressperiodParams: IStressperiodParams
  readOnly: boolean;
  handleStressperiodItemChange: (key: string, editedItem: StressperiodDataType) => void;
  handleStressperiodItemRemove: (key: string) => void;
  handleStressperiodItemCreate: (item: StressperiodDataType) => void;
  handleStressperiodDelete: () => void;
}

const StressperiodTable: React.FC<IProps> = ({
  stressperiodParams,
  readOnly,
  handleStressperiodItemChange,
  handleStressperiodItemRemove,
  handleStressperiodItemCreate,
  handleStressperiodDelete,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [startDateError, setStartDateError] = useState<boolean>(false);
  const [startDateErrorIdx, setStartDateErrorIdx] = useState<number>(-1);
  const [startDateErrorContent, setStartDateErrorContent] = useState<string>('');
  const startDate = moment.utc(stressperiodParams.startDate, 'DD.MM.YYYY');
  const endDate = moment.utc(stressperiodParams.endDate, 'DD.MM.YYYY');

  const toCsv = () => {
    let text = 'start_date_time;nstp;tsmult;steady\n';
    stressperiodParams.stressperiod?.forEach((sp) => {
      text += `${moment(sp.start_date_time).format('YYYY-MM-DD')};${sp.nstp};${sp.tsmult};${sp.steady ? 1 : 0}\n`;
    });
    return text;
  };

  const addNewStressperiod = () => {
    const lastStressperiod = stressperiodParams.stressperiod && stressperiodParams.stressperiod[stressperiodParams.stressperiod.length - 1];
    const prevDate = lastStressperiod && moment(lastStressperiod.start_date_time).isValid()
      ? moment(lastStressperiod.start_date_time).add(1, 'days').format('YYYY-MM-DD')
      : moment(stressperiodParams.endDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
    const newStressperiod: StressperiodDataType = {
      key: uuidv4(),
      start_date_time: prevDate,
      nstp: 0,
      tsmult: 0,
      steady: false,
    };
    handleStressperiodItemCreate(newStressperiod);
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
  const handleStressperiodChange = (
    e: ChangeEvent<HTMLInputElement>, {value, name, idx}: InputOnChangeData,
  ) => {
    if ('start_date_time' === name) {
      if (0 !== idx && moment.utc(value).isSameOrBefore(startDate)) {
        setActiveIdx(null);
        setActiveValue('');
        setActiveInput(null);
        setStartDateErrorIdx(idx);
        setStartDateError(true);
        setStartDateErrorContent('Start Date of stressperiod cannot be the same or earlier than specified in general params');
        return;
      } else if (0 === idx && moment.utc(value).isBefore(startDate)) {
        setActiveIdx(null);
        setActiveValue('');
        setActiveInput(null);
        setStartDateErrorIdx(idx);
        setStartDateError(true);
        setStartDateErrorContent('The Start Date of the stressperiod cannot be or earlier that specified in the general parameters');
        return;
      } else if (moment.utc(value).isAfter(endDate)) {
        setActiveIdx(null);
        setActiveValue('');
        setActiveInput(null);
        setStartDateErrorIdx(idx);
        setStartDateError(true);
        setStartDateErrorContent('The Start Date of the stress period cannot be later than the End Date');
        return;
      }
    }
    setActiveIdx(idx);
    setActiveInput(name);
    setActiveValue(value);
  };


  const handleChange = (activeKey: string) => {
    setStartDateError(false);
    const editedIndex = stressperiodParams.stressperiod?.findIndex(sp => sp.key === activeKey);
    if (null !== editedIndex && activeValue && stressperiodParams.stressperiod) {
      const edited = {...stressperiodParams.stressperiod[editedIndex]};
      if ('start_date_time' === activeInput) {
        edited.start_date_time = moment.utc(activeValue).format('YYYY-MM-DD');
      }
      if ('nstp' === activeInput) {
        edited.nstp = parseFloat(activeValue);
      }
      if ('tsmult' === activeInput) {
        edited.tsmult = parseFloat(activeValue);
      }
      handleStressperiodItemChange(activeKey, edited);
      setActiveValue('');
      setActiveIdx(null);
      setActiveInput(null);
    }
  };

  const handleChangeCheckbox = (e: MouseEvent<HTMLInputElement>, {idx, checked}: CheckboxProps) => {
    const activeKey = stressperiodParams.stressperiod ? stressperiodParams.stressperiod[idx]?.key : '';
    if (activeKey) {
      const edited = {...stressperiodParams.stressperiod![idx]};
      edited.steady = !!checked;
      handleStressperiodItemChange(activeKey, edited);
    }
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
            <Table.HeaderCell><Icon className={'dateIcon'} name="info circle"/>Steady state</Table.HeaderCell>
          }
          content="State of stress period"
          hideOnScroll={true}
          size="tiny"
        />
        <Table.HeaderCell>

        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );

  const renderBody = () => {
    return (
      <Table.Body className={styles.tableBody}>
        {stressperiodParams!.stressperiod.map((sp, idx) => (
          <Table.Row className={styles.tableRow} key={sp.key}>
            <Table.Cell><span>{idx + 1}</span></Table.Cell>
            <Table.Cell>
              <Popup
                content={startDateErrorContent}
                open={startDateErrorIdx === idx && startDateError}
                position="top center"
                trigger={
                  <Form.Input
                    error={startDateErrorIdx === idx && startDateError}
                    disabled={readOnly}
                    type="date"
                    name={'start_date_time'}
                    idx={idx}
                    style={{width: '100%'}}
                    value={
                      (activeValue && activeIdx === idx && 'start_date_time' === activeInput)
                        ? moment(activeValue).format('YYYY-MM-DD')
                        : moment(sp.start_date_time).format('YYYY-MM-DD')
                    }
                    onBlur={() => handleChange(sp.key)}
                    onChange={handleStressperiodChange}
                  />
                }
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                disabled={readOnly}
                type="number"
                error={50 < sp.tsmult}
                max={50}
                name="nstp"
                idx={idx}
                value={'nstp' === activeInput && activeIdx === idx ? activeValue : sp.nstp}
                onBlur={() => handleChange(sp.key)}
                onChange={handleStressperiodChange}
              />
            </Table.Cell>
            <Table.Cell>
              <Form.Input
                disabled={readOnly}
                type="number"
                name="tsmult"
                idx={idx}
                value={'tsmult' === activeInput && activeIdx === idx ? activeValue : sp.tsmult.toFixed(3)}
                onBlur={() => handleChange(sp.key)}
                onChange={handleStressperiodChange}
              />
            </Table.Cell>
            <Table.Cell>
              <Checkbox
                name={'steady'}
                checked={sp.steady}
                disabled={readOnly}
                idx={idx}
                onClick={handleChangeCheckbox}
              />
            </Table.Cell>
            <Table.Cell>
              {!readOnly && 0 !== idx && (
                <Button
                  onClick={() => {
                    handleStressperiodItemRemove(sp.key);
                  }}
                >
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
      {stressperiodParams.stressperiod &&
        0 < stressperiodParams.stressperiod.filter((sp) => sp.nstp > MAX_OUTPUT_PER_PERIOD).length &&
        <Grid.Row style={{marginBottom: '10px'}}>
          <Grid.Column width={16}>
            <Message warning={true}>
              <Message.Header>Warning</Message.Header>
              <p>Results for stressperiods with nstp {'>'} {MAX_OUTPUT_PER_PERIOD} will
                only be calculated for their first timestep, due to performance issues.</p>
            </Message>
          </Grid.Column>
        </Grid.Row>
      }
      {/*{datesInvalid &&*/}
      {/*  <Grid.Row>*/}
      {/*    <Grid.Column width={6}>*/}
      {/*      <Message color={'red'}>*/}
      {/*        <strong>Error: </strong>Start date of last stress period is greater than end date.*/}
      {/*      </Message>*/}
      {/*    </Grid.Column>*/}
      {/*  </Grid.Row>*/}
      {/*}*/}
      <div className={styles.tableWrapper}>
        <Table className={styles.table} unstackable={true}>
          {renderHeader()}
          {renderBody()}
        </Table>
      </div>
      <div className={styles.buttonsGroup}>
        <Button className='buttonLink' onClick={addNewStressperiod}>
          Add new <Icon name="add"/> </Button>
        <Button
          className='buttonLink'
          disabled={stressperiodParams.stressperiod && 0 !== stressperiodParams.stressperiod.length ? false : true}
          onClick={handleStressperiodDelete}
        >
          Delete all <FontAwesomeIcon icon={faTrashCan}/></Button>
        <Button
          className='buttonLink'
          disabled={stressperiodParams.stressperiod && 0 !== stressperiodParams.stressperiod.length ? false : true}
          onClick={handleDownload}
        >
          Download all <FontAwesomeIcon icon={faDownload}/></Button>
      </div>
    </div>
  );
};

export default StressperiodTable;
