import React, {useEffect, useState} from 'react';
import {ECsvColumnType, UploadCSVFile} from 'components/UploadCSVFile';
import {Accordion} from 'semantic-ui-react';
import {DataGrid, DataRow} from '../index';
import moment, {Moment} from 'moment';
import StressperiodTable from './StressperiodTable';
import {IStressperiodParams, StressperiodDataType} from '../types/Model.type';
import StressperiodParameters from './StressperiodParameters';


const defaultParams: IStressperiodParams = {
  stressperiod: [
    // {
    //   'key': '73aa5ad6-c165-49f0-94d2-130f59af920f',
    //   'start_date_time': '2003-01-20T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'eb1c5804-9a37-4b55-96f5-ca3983998f33',
    //   'start_date_time': '2003-02-20T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'c8add3e3-3026-42a0-9487-51712045bfe6',
    //   'start_date_time': '2003-03-21T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'f4a35507-704a-46d7-ad23-53c4230e8c2e',
    //   'start_date_time': '2003-05-21T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '10d5da83-c5f1-46f9-be77-f48ddde50a54',
    //   'start_date_time': '2003-07-21T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '339a6e42-d47e-47d0-b8da-c7e06d815113',
    //   'start_date_time': '2003-09-21T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '3424ffd0-2202-4c47-a2f9-4a7ead9e65c8',
    //   'start_date_time': '2024-02-08T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '10022e11-297c-4453-a549-4f44fa7c7936',
    //   'start_date_time': '2024-02-07T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '6066d438-2c64-4543-b718-9ea08c51a76e',
    //   'start_date_time': '2003-03-20T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '0ab75092-e6fb-4cf6-bb96-17c89a75cdfb',
    //   'start_date_time': '2003-04-21T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '39288256-6a98-4bf2-a41b-a331aa251a3f',
    //   'start_date_time': '2003-06-21T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'cbb0ec30-78a9-47b5-835f-d03fb5fc6aee',
    //   'start_date_time': '2003-08-21T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'f651997d-4810-4c00-8dcd-d6bd8db24b76',
    //   'start_date_time': '2024-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'eb5bf132-64d6-46f5-ba3a-dcdeab0c2e5a',
    //   'start_date_time': '2025-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '57ee89d5-b1ab-4087-b333-35b31d1a1e9f',
    //   'start_date_time': '2026-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'df715912-9c0a-4a5a-a3a0-c9bb67733a78',
    //   'start_date_time': '2027-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '8ce88104-5b22-465b-b699-fa21e7f3f0ab',
    //   'start_date_time': '2028-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'ea2ee200-358e-4688-ae76-37abca5d720f',
    //   'start_date_time': '2029-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': 'd32bba5d-004e-40e8-9591-d708ca4e74d2',
    //   'start_date_time': '2030-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '66b35868-7091-498b-a1fc-d97747f2ddba',
    //   'start_date_time': '2031-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '5a14b442-3e80-474e-b893-f3baa275937b',
    //   'start_date_time': '2032-03-02T00:00:00.000Z',
    //   'nstp': 1,
    //   'tsmult': 1,
    //   'steady': false,
    // },
    // {
    //   'key': '5576aa63-07c6-49d2-b06f-40de17f5dcd6',
    //   'start_date_time': '2024-02-07T00:00:00.000Z',
    //   'nstp': 0,
    //   'tsmult': 0,
    //   'steady': false,
    // },
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
  const [stressperiodSorted, setStressperiodSorted] = useState<IStressperiodParams>(defaultParams);

  useEffect(() => {
    const sortedStressperiods = stressperiodParams.stressperiod && [...stressperiodParams.stressperiod].sort((a, b) => {
      const dateA = moment.utc(a.start_date_time);
      const dateB = moment.utc(b.start_date_time);
      if (!dateA.isValid()) return 1; // Move items with null dates to the end
      if (!dateB.isValid()) return -1; // Move items with null dates to the end
      return dateA.valueOf() - dateB.valueOf();
    });
    setStressperiodSorted((prevParams) => ({
      ...prevParams,
      stressperiod: sortedStressperiods || [],
    }));

  }, [stressperiodParams]);

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
      stressperiod: [],
    }));
  };

  const handleStressperiodChange = (data: StressperiodDataType[] | []) => {
    setStressperiodParams((prevParams) => ({
      ...prevParams,
      stressperiod: data,
    }));
  };

  const handleStressperiodItemChange = (activeKey: string, updatedStressPeriod: StressperiodDataType) => {
    const updatedStressperiodParams = {...stressperiodParams};
    const indexOfUpdatedStressPeriod = updatedStressperiodParams.stressperiod?.findIndex((sp: StressperiodDataType) => sp.key === activeKey);
    if (indexOfUpdatedStressPeriod !== undefined && -1 !== indexOfUpdatedStressPeriod) {
      updatedStressperiodParams.stressperiod![indexOfUpdatedStressPeriod] = updatedStressPeriod;
      setStressperiodParams(updatedStressperiodParams);
    }
  };

  const handleStressperiodItemRemove = (activeKey: string) => {
    setStressperiodParams((prevParams) => {
      const updatedStressperiodParams = {...prevParams};
      const updatedStressperiods = updatedStressperiodParams.stressperiod?.filter((sp: StressperiodDataType) => sp.key !== activeKey) || [];
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
    return daysDifference ? daysDifference : null;
  };

  const onSave = (data: StressperiodDataType[] | []) => {
    handleStressperiodChange(data);
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
          <StressperiodParameters
            stressperiodParams={stressperiodParams}
            handleDateChange={handleDateChange}
            calculateTotalTime={calculateTotalTime()}
          />
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
              stressperiodParams={stressperiodSorted}
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
