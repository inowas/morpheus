import React, {useEffect, useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import useTimeDiscretization from '../../application/useTimeDiscretization';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';
import {useParams} from 'react-router-dom';
import Error from 'common/components/Error';
import {Button, DataGrid, SectionTitle} from '../../../../common/components';
import {Accordion, AccordionContent} from '../components/Content';
import TimeDiscretizationGeneralParameters from '../components/ModelTimeDiscretization/GeneralParameters';
import {IStressPeriod, ITimeDiscretization} from '../../types';
import cloneDeep from 'lodash.clonedeep';
import {useDateTimeFormat} from 'common/hooks';
import {StressperiodsUpload} from '../components/ModelTimeDiscretization/StressperiodsUpload';
import TimeDiscretizationStressPeriods from '../components/ModelTimeDiscretization/StressPeriods';
import useProjectPermissions from '../../application/useProjectPermissions';
import {Map} from 'common/components/Map';
import SpatialDiscretizationLayer from "../components/ModelSpatialDiscretization/SpatialDiscretizationLayer";

const TimeDiscretizationContainer = () => {

  const {projectId} = useParams();
  const {timeDiscretization, updateTimeDiscretization, loading, error} = useTimeDiscretization(projectId as string);
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const [timeDiscretizationLocal, setTimeDiscretizationLocal] = useState<ITimeDiscretization | null>(null);
  const {addDays, isValid, formatISO} = useDateTimeFormat('UTC');
  const {isReadOnly} = useProjectPermissions(projectId as string);

  useEffect(() => {
    if (timeDiscretization) {
      setTimeDiscretizationLocal(timeDiscretization);
    }
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
    if (!timeDiscretizationLocal) {
      return;
    }

    handleTimeDiscretizationChange({
      ...timeDiscretizationLocal,
      stress_periods: stressPeriods,
    });
  };

  const handleSubmit = () => {
    if (!timeDiscretizationLocal) {
      return;
    }

    updateTimeDiscretization(timeDiscretizationLocal);
  };


  if (!timeDiscretization || !timeDiscretizationLocal) {
    return null;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <SidebarContent maxWidth={600}>
        <DataGrid>
          <SectionTitle title={'Time Discretization'}/>
          <Accordion defaultActiveIndex={[0, 1]} exclusive={false}>
            <AccordionContent title={'General parameters'}>
              <TimeDiscretizationGeneralParameters
                timeDiscretization={timeDiscretizationLocal}
                onChange={handleTimeDiscretizationChange}
                readOnly={isReadOnly}
              />
            </AccordionContent>
            <AccordionContent title={'Stress periods'}>
              <StressperiodsUpload onSubmit={handleStressPeriodsUpload} stressPeriods={timeDiscretizationLocal.stress_periods}/>
              <TimeDiscretizationStressPeriods
                timeDiscretization={timeDiscretizationLocal}
                onChange={handleTimeDiscretizationChange}
                readOnly={isReadOnly}
              />
            </AccordionContent>
          </Accordion>
          {!isReadOnly && <Button
            onClick={handleSubmit}
            disabled={JSON.stringify(timeDiscretization) === JSON.stringify(timeDiscretizationLocal)}
            loading={loading}
            content={'Submit'}
          />}
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <Map>
          <SpatialDiscretizationLayer modelGeometry={spatialDiscretization?.geometry} editModelGeometry={false}/>
        </Map>
      </BodyContent>
    </>
  );
};

export default TimeDiscretizationContainer;
