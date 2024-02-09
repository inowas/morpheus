import React, {useState} from 'react';
import {ECsvColumnType, UploadCSVFile} from 'components/UploadCSVFile';
import {Accordion, Form, Icon} from 'semantic-ui-react';
import {DataGrid, DataRow} from '../index';
import moment, {Moment} from 'moment';
import styles from './ModelStressPeriods.module.less';
import StressperiodTable from './StressperiodTable';
import {IStressperiodParams, StressperiodDataType} from '../types/Model.type';


const defaultParams: IStressperiodParams = {
  stressperiod: [
    {
      'key': '0-946684800',
      'start_date_time': '2000-01-01T00:00:00.000Z',
      'nstp': 1,
      'tsmult': 1,
      'steady': true,
    },
    {
      'key': '1-1577750400',
      'start_date_time': '2019-12-31T00:00:00.000Z',
      'nstp': 0,
      'tsmult': 0,
      'steady': false,
    },
  ],
  startDate: '01.01.2000',
  endDate: '01.01.2024',
  timeUnit: 'days',
};

const columns = [
  {key: 0, value: 'start_date_time', text: 'Start date', type: ECsvColumnType.DATE_TIME},
  {key: 1, value: 'nstp', text: 'Time steps'},
  {key: 2, value: 'tsmult', text: 'Multiplier'},
  {key: 3, value: 'steady', text: 'Steady state', type: ECsvColumnType.BOOLEAN},
];
const ModelStressPeriods = () => {

  const [stressperiodParams, setStressperiodParams] = useState<IStressperiodParams>(defaultParams);

  const handleDateChange = (
    date: Moment | null,
    name: 'startDate' | 'endDate',
  ) => {
    setStressperiodParams((prevParams) => ({
      ...prevParams,
      [name]: date,
    }));
  };

  const handleStressperiodDelete = () => {
    setStressperiodParams((prevParams) => ({
      ...prevParams,
      stressperiod: null,
    }));
  };

  const handleStressperiodChange = (data: StressperiodDataType[] | null) => {
    setStressperiodParams((prevParams) => ({
      ...prevParams,
      stressperiod: data,
    }));
  };

  const handleStressperiodItemChange = (activeKey: string, updatedStressPeriod: StressperiodDataType) => {
    const updatedStressperiodParams = {...stressperiodParams};
    const indexOfUpdatedStressPeriod = updatedStressperiodParams.stressperiod?.findIndex(sp => sp.key === activeKey);
    if (indexOfUpdatedStressPeriod !== undefined && -1 !== indexOfUpdatedStressPeriod) {
      updatedStressperiodParams.stressperiod![indexOfUpdatedStressPeriod] = updatedStressPeriod;
      setStressperiodParams(updatedStressperiodParams);
    }
  };

  const handleStressperiodItemRemove = (activeKey: string) => {
    setStressperiodParams((prevParams) => {
      const updatedStressperiodParams = {...prevParams};
      const updatedStressperiods = updatedStressperiodParams.stressperiod?.filter(sp => sp.key !== activeKey) || [];
      updatedStressperiodParams.stressperiod = updatedStressperiods;
      return updatedStressperiodParams;
    });
  };

  const handleStressperiodItemCreate = (newStressPeriod: StressperiodDataType) => {
    setStressperiodParams((prevParams) => ({
      ...prevParams,
      stressperiod: [...(prevParams.stressperiod || []), newStressPeriod],
    }));
  };

  const calculateTotalTime = () => {
    const startDateMoment = moment(stressperiodParams.startDate, 'DD.MM.YYYY');
    const endDateMoment = moment(stressperiodParams.endDate, 'DD.MM.YYYY');
    const daysDifference = endDateMoment.diff(startDateMoment, 'days');
    return daysDifference;
  };

  const onSave = (data: StressperiodDataType[] | null) => {
    handleStressperiodChange(data);
  };

  const parametrsPanel = () => {
    return (
      <Form className={styles.parametrsPanel}>
        <DataGrid multiColumns={4}>
          <Form.Field className={'dateInputWrapper'}>
            <label className="labelSmall" style={{textAlign: 'left', fontWeight: 600}}>
              <Icon className={'dateIcon'} name="info circle"/>
              Start Date
            </label>
            <div className={'divider'}>
              <Form.Input
                type="date"
                name={'startDate'}
                value={moment(stressperiodParams.startDate).format('YYYY-MM-DD')}
                onChange={(e, {value}) =>
                  handleDateChange(moment(value), 'startDate')
                }
              />
              <Icon className={'dateIcon'} name="calendar outline"/>
            </div>
          </Form.Field>
          <Form.Field className={'dateInputWrapper'}>
            <label className="labelSmall" style={{textAlign: 'left', fontWeight: 600}}>
              <Icon className={'dateIcon'} name="info circle"/>
              End Date
            </label>
            <div className={'divider'}>
              <Form.Input
                type="date"
                name={'endDate'}
                value={moment(stressperiodParams.endDate).format('YYYY-MM-DD')}
                onChange={(e, {value}) =>
                  handleDateChange(moment(value), 'endDate')
                }
              />
              <Icon className={'dateIcon'} name="calendar outline"/>
            </div>
          </Form.Field>
          <Form.Field>
            <label className="labelSmall" style={{textAlign: 'left', fontWeight: 600}}>
              <Icon className={'dateIcon'} name="info circle"/>
              Time unit
            </label>
            <Form.Input
              name="Total unit"
              value={stressperiodParams.timeUnit}
              disabled={true}
            />
          </Form.Field>
          <Form.Field>
            <label className="labelSmall" style={{textAlign: 'left', fontWeight: 600}}>
              <Icon className={'dateIcon'} name="info circle"/>
              Total time
            </label>
            <Form.Input
              name="Total time"
              value={1 < calculateTotalTime() ? `${calculateTotalTime()} days` : `${calculateTotalTime()} day`}
              disabled={true}
            />
          </Form.Field>
        </DataGrid>
      </Form>
    );
  };

  const panels: any[] = [
    {
      key: 1,
      title: {
        content: 'General parameters',
        icon: false,
      },
      content: {
        content: (
          parametrsPanel()
        ),
      },
    },
    {
      key: 2,
      title: {
        content: 'Stress period',
        icon: false,
      },
      content: {
        content: (
          <>
            <UploadCSVFile
              onCancel={() => console.log('cancel')}
              onSave={onSave}
              columns={columns}
            />
            <StressperiodTable
              stressperiodParams={stressperiodParams}
              readOnly={false}
              handleStressperiodItemChange={handleStressperiodItemChange}
              handleStressperiodItemRemove={handleStressperiodItemRemove}
              handleStressperiodItemCreate={handleStressperiodItemCreate}
              handleStressperiodDelete={handleStressperiodDelete}
            />
          </>
        ),
      },
    },
  ];

  return (
    <DataGrid>
      <DataRow title={'Time discretization'}/>
      <Accordion
        defaultActiveIndex={[0, 1]}
        panels={panels}
        exclusive={false}
      />
    </DataGrid>

  );
};

export default ModelStressPeriods;
