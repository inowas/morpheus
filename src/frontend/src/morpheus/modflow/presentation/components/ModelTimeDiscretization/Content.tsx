import React, {useEffect, useState} from 'react';
import {Accordion, AccordionPanelProps} from 'semantic-ui-react';
import TimeDiscretizationGeneralParameters from './GeneralParameters';
import TimeDiscretizationStressPeriods from './StressPeriods';
import {IStressPeriod, ITimeDiscretization} from '../../../types';
import {addDays, isValid, parseISO} from 'date-fns';
import {Button, DataGrid, SectionTitle} from 'common/components';

interface IProps {
  timeDiscretization: ITimeDiscretization;
  onChange: (data: ITimeDiscretization) => void;
  loading: boolean;
}

const withSortedStressPeriods = (td: ITimeDiscretization): ITimeDiscretization => {
  return {
    ...td, stress_periods: td.stress_periods.sort((a: IStressPeriod, b: IStressPeriod) => {
      const dateA = parseISO(a.start_date_time);
      const dateB = parseISO(b.start_date_time);
      if (!isValid(dateA)) return 1; // Move items with null dates to the end
      if (!isValid(dateB)) return -1; // Move items with null dates to the end
      return dateA.getTime() - dateB.getTime();
    }),
  };
};


const TimeDiscretizationContent = ({timeDiscretization, onChange, loading}: IProps) => {

  const [timeDiscretizationLocal, setTimeDiscretizationLocal] = useState<ITimeDiscretization>(
    withSortedStressPeriods(timeDiscretization),
  );

  useEffect(() => {
    setTimeDiscretizationLocal(withSortedStressPeriods(timeDiscretization));
  }, [timeDiscretization]);

  const handleTimeDiscretizationChange = (td: ITimeDiscretization) => {
    const newTimeDiscretization = withSortedStressPeriods(td);
    const startDateTime = parseISO(newTimeDiscretization.stress_periods[0].start_date_time);
    newTimeDiscretization.start_date_time = startDateTime.toISOString();

    const endDateTime = addDays(parseISO(newTimeDiscretization.stress_periods[newTimeDiscretization.stress_periods.length - 1].start_date_time), 1);
    const currentEndDateTime = parseISO(newTimeDiscretization.end_date_time);
    if (currentEndDateTime.getTime() < endDateTime.getTime()) {
      newTimeDiscretization.end_date_time = endDateTime.toISOString();
    }
    setTimeDiscretizationLocal(newTimeDiscretization);
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
        <TimeDiscretizationStressPeriods
          timeDiscretization={timeDiscretizationLocal}
          onChange={handleTimeDiscretizationChange}
          readOnly={false}
        />
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
