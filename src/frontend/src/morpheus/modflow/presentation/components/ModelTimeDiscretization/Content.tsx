import React, {useEffect, useState} from 'react';
import {Accordion, AccordionPanelProps} from 'semantic-ui-react';
import TimeDiscretizationGeneralParameters from './GeneralParameters';
import TimeDiscretizationStressPeriods from './StressPeriods';
import {StressperiodsUpload} from './StressperiodsUpload';
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
  const [uploadedData, setUploadedData] = useState<IStressPeriod[][] | null>(null);
  const [timeDiscretizationLocal, setTimeDiscretizationLocal] = useState<ITimeDiscretization>(
    withSortedStressPeriods(timeDiscretization),
  );

  const transformData = (processedData: IStressPeriod[][]): ITimeDiscretization | null => {
    if (!processedData) {
      return null;
    }
    const stressPeriods: IStressPeriod[] = processedData.map((period: any[]) => {
      const [
        startDateTime,
        nstp,
        tsmult,
        steady,
      ] = period;
      return {
        start_date_time: startDateTime,
        number_of_time_steps: nstp,
        time_step_multiplier: tsmult,
        steady_state: steady,
      };
    });

    let earliestDate = isValid(new Date(stressPeriods[0].start_date_time))
      ? new Date(stressPeriods[0].start_date_time)
      : new Date();
    let latestDate = earliestDate;

    stressPeriods.forEach(period => {
      if (!isValid(new Date(period.start_date_time))) {
        return;
      }
      const startDate = new Date(period.start_date_time);
      if (startDate < earliestDate) {
        earliestDate = startDate;
      }
      if (startDate > latestDate) {
        latestDate = startDate;
      }
    });


    return {
      start_date_time: earliestDate.toISOString(),
      end_date_time: latestDate.toISOString(),
      time_unit: timeDiscretizationLocal.time_unit,
      stress_periods: stressPeriods,
    };
  };


  useEffect(() => {
    if (!uploadedData) return;
    const updatedTimeDiscretization = transformData(uploadedData) ?? timeDiscretizationLocal;
    setTimeDiscretizationLocal(withSortedStressPeriods(updatedTimeDiscretization));
  }, [uploadedData]);

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
        <>
          <StressperiodsUpload
            onSave={setUploadedData}
          />
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

