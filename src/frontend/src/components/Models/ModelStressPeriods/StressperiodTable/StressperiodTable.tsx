import {Button, Checkbox, CheckboxProps, Form, Icon, InputOnChangeData, Popup, Table} from 'semantic-ui-react';
import React, {ChangeEvent, MouseEvent, useState} from 'react';
import moment from 'moment';
import {IStressperiodParams, StressperiodDataType} from '../../types/Model.type';
import {v4 as uuidv4} from 'uuid';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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

  // const checkValidData = (data: any) => {
  //   return moment.utc(data, 'YYYY-MM-DD', true).isValid();
  // };

  const toCsv = () => {
    let text = 'start_date_time;nstp;tsmult;steady\n';
    stressperiodParams.stressperiod?.forEach((sp) => {
      text += `${moment(sp.start_date_time).format('YYYY-MM-DD')};${sp.nstp};${sp.tsmult};${sp.steady ? 1 : 0}\n`;
    });
    return text;
  };

  const addNewStressperiod = () => {
    const lastStressperiod = stressperiodParams.stressperiod && stressperiodParams.stressperiod[stressperiodParams.stressperiod.length - 1];
    const prevDate = lastStressperiod
      ? moment(lastStressperiod.start_date_time).add(1, 'days').format('YYYY-MM-DD')
      : moment(stressperiodParams.startDate).format('YYYY-MM-DD');
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
    setActiveIdx(idx);
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChange = (activeKey: string) => {

    setStartDateError(false);

    if (null !== activeIdx && activeValue && stressperiodParams.stressperiod) {
      const edited = stressperiodParams.stressperiod[activeIdx];
      if ('start_date_time' === activeInput) {

        edited.start_date_time = moment.utc(activeValue).format('YYYY-MM-DD');

        if (0 === activeIdx) {
          edited.start_date_time = moment.utc(activeValue).format('YYYY-MM-DD');
        }

        if (0 !== activeIdx && moment(edited.start_date_time).isSameOrBefore(stressperiodParams.startDate)) {
          setActiveIdx(null);
          setActiveValue('');
          setActiveInput(null);
          setStartDateError(true);
          return;
        }
      }
      if ('nstp' === activeInput) {
        // if (!checkValidData(activeValue)) {
        //   return;
        // }
        edited.nstp = parseFloat(activeValue);
      }
      if ('tsmult' === activeInput) {
        // if (!checkValidData(activeValue)) {
        //   return;
        // }
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
      const parsedDate = moment.utc(edited.start_date_time, 'YYYY-MM-DD', true);
      // if (!checkValidData(edited.start_date_time)) {
      //   return;
      // }
      edited.steady = !!checked;
      handleStressperiodItemChange(activeKey, edited);
    }
  };

  const renderHeader = () => (
    <Table.Row>
      <Table.HeaderCell width={1}>No</Table.HeaderCell>
      <Table.HeaderCell width={6}><Icon className={'dateIcon'} name="info circle"/>Start Date</Table.HeaderCell>
      <Popup
        trigger={
          <Table.HeaderCell width={2}>
            <Icon className={'dateIcon'} name="info circle"/> Time steps
          </Table.HeaderCell>
        }
        content="No. of time steps"
        hideOnScroll={true}
        size="tiny"
      />
      <Popup
        trigger={<Table.HeaderCell width={2}><Icon className={'dateIcon'} name="info circle"/>Multiplier</Table.HeaderCell>}
        content="Time step multiplier"
        hideOnScroll={true}
        size="tiny"
      />
      <Popup
        trigger={<Table.HeaderCell width={2}><Icon className={'dateIcon'} name="info circle"/>Steady state</Table.HeaderCell>}
        content="State of stress period"
        hideOnScroll={true}
        size="tiny"
      />
      <Table.HeaderCell width={2}/>
    </Table.Row>
  );

  const renderBody = () => {
    return (
      <Table.Body>
        {stressperiodParams.stressperiod &&
          stressperiodParams.stressperiod.map((sp, idx) => (
            <Table.Row key={sp.key}>
              <Table.Cell>{idx + 1}</Table.Cell>
              <Table.Cell>
                <Popup
                  content="Start date of first stressperiod must be before all other stressperiods"
                  open={0 === idx && startDateError}
                  position="top center"
                  trigger={
                    <Form.Input
                      disabled={readOnly}
                      type="date"
                      name={'start_date_time'}
                      idx={idx}
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
                {/*{sp.tsmult}*/}
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
                    basic={true}
                    floated={'right'}
                    icon={'trash'}
                    onClick={() => {
                      handleStressperiodItemRemove(sp.key);
                    }}
                  />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    );
  };

  return (
    <div>
      <Table size={'small'}>
        <Table.Header>{renderHeader()}</Table.Header>
        {renderBody()}
      </Table>
      <Button icon={true} onClick={addNewStressperiod}>
        Add new <Icon name="add"/> </Button>
      <Button icon={true} onClick={handleStressperiodDelete}>
        Delete all <Icon name="trash"/></Button>
      <Button icon={true} onClick={handleDownload}>
        Download all <FontAwesomeIcon icon={faDownload}/></Button>
    </div>
  );
};

export default StressperiodTable;
