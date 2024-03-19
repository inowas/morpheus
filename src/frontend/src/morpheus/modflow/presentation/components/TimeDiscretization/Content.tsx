import React, {useEffect, useState} from 'react';
import {Accordion, AccordionPanelProps} from 'semantic-ui-react';
import TimeDiscretizationGeneralParameters from './GeneralParameters';
import TimeDiscretizationStressPeriods from './StressPeriods';
import {IStressPeriod, ITimeDiscretization} from '../../../types/TimeDiscretization.type';
import {parseISO, isValid, addDays} from 'date-fns';
import {Button, DataGrid, DataRow} from 'common/components';

interface IProps {
  timeDiscretization: ITimeDiscretization;
  onChange: (data: ITimeDiscretization) => void;
  loading: boolean;
}

const withSortedStressPeriods = (td: ITimeDiscretization): ITimeDiscretization => {
  return {
    ...td, stressPeriods: td.stressPeriods.sort((a: IStressPeriod, b: IStressPeriod) => {
      const dateA = parseISO(a.startDateTime);
      const dateB = parseISO(b.startDateTime);
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
    const startDateTime = parseISO(newTimeDiscretization.stressPeriods[0].startDateTime);
    newTimeDiscretization.startDateTime = startDateTime.toISOString();

    const endDateTime = addDays(parseISO(newTimeDiscretization.stressPeriods[newTimeDiscretization.stressPeriods.length - 1].startDateTime), 1);
    const currentEndDateTime = parseISO(newTimeDiscretization.endDateTime);
    if (currentEndDateTime.getTime() < endDateTime.getTime()) {
      newTimeDiscretization.endDateTime = endDateTime.toISOString();
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
      <DataRow title={'Time discretization'}/>
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
