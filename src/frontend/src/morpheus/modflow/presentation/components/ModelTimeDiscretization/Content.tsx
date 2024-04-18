import React, {useEffect, useState} from 'react';
import {Accordion, AccordionPanelProps} from 'semantic-ui-react';
import TimeDiscretizationGeneralParameters from './GeneralParameters';
import TimeDiscretizationStressPeriods from './StressPeriods';
import {StressperiodsUpload} from './StressperiodsUpload';
import {IStressPeriod, ITimeDiscretization} from '../../../types';
import {Button, DataGrid, SectionTitle} from 'common/components';
import cloneDeep from 'lodash.clonedeep';
import {useDateTimeFormat} from 'common/hooks';


interface IProps {
  timeDiscretization: ITimeDiscretization;
  onChange: (data: ITimeDiscretization) => void;
  loading: boolean;
  timeZone?: string;
}

const TimeDiscretizationContent = ({timeDiscretization, onChange, loading, timeZone}: IProps) => {

  const {addDays, isValid, formatISO} = useDateTimeFormat(timeZone);

  const [timeDiscretizationLocal, setTimeDiscretizationLocal] = useState<ITimeDiscretization>(timeDiscretization);

  useEffect(() => {
    setTimeDiscretizationLocal(timeDiscretization);
  }, [timeDiscretization]);

  const handleTimeDiscretizationChange = (td: ITimeDiscretization) => {
    const updatedTimeDiscretization = cloneDeep(td);

    const newStartDateTime = updatedTimeDiscretization.stress_periods[0].start_date_time;
    if (!isValid(newStartDateTime)) {
      return;
    }
    updatedTimeDiscretization.start_date_time = formatISO(newStartDateTime);

    const lastStartDateTime = updatedTimeDiscretization.stress_periods[updatedTimeDiscretization.stress_periods.length - 1].start_date_time;
    if (!isValid(lastStartDateTime)) {
      return;
    }

    updatedTimeDiscretization.end_date_time = addDays(lastStartDateTime, 1);
    setTimeDiscretizationLocal(updatedTimeDiscretization);
  };

  const handleStressPeriodsUpload = (stressPeriods: IStressPeriod[]) => {
    handleTimeDiscretizationChange({
      ...timeDiscretizationLocal,
      stress_periods: stressPeriods,
    });
  };

  const handleSubmit = () => {
    onChange(timeDiscretizationLocal);
  };

  const panels: AccordionPanelProps[] = [{
    key: 0,
    title: {
      content: 'General parameters',
      icon: false,
    },
    content: {
      content: (
        <TimeDiscretizationGeneralParameters
          timeDiscretization={timeDiscretizationLocal}
          onChange={handleTimeDiscretizationChange}
        />
      ),
    },
  },
  {
    key: 1,
    title: {
      content: 'Stress periods',
      icon: false,
    },
    content: {
      content: (
        <>
          <StressperiodsUpload onSubmit={handleStressPeriodsUpload} stressPeriods={timeDiscretizationLocal.stress_periods}/>
          <TimeDiscretizationStressPeriods
            timeDiscretization={timeDiscretizationLocal}
            onChange={handleTimeDiscretizationChange}
            readOnly={false}
          />
        </>
      ),
    },
  }];

  return (
    <DataGrid>
      <SectionTitle title={'Time discretization'}/>
      <Accordion
        defaultActiveIndex={[0, 1]}
        panels={panels}
        exclusive={false}
      />
      <Button
        onClick={handleSubmit}
        disabled={JSON.stringify(timeDiscretization) === JSON.stringify(timeDiscretizationLocal)}
        loading={loading}
      >
        Submit
      </Button>
    </DataGrid>
  );
};

export default TimeDiscretizationContent;

