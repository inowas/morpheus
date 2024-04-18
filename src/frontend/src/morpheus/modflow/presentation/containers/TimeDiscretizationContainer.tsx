import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import {TimeDiscretizationBody, TimeDiscretizationContent} from '../components/ModelTimeDiscretization';
import useTimeDiscretization from '../../application/useTimeDiscretization';
import {useParams} from 'react-router-dom';
import Error from 'common/components/Error';

const TimeDiscretizationContainer = () => {

  const {projectId} = useParams();
  const {timeDiscretization, updateTimeDiscretization, loading, error} = useTimeDiscretization(projectId as string);

  if (!timeDiscretization) {
    return null;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <SidebarContent maxWidth={600}>
        <TimeDiscretizationContent
          timeDiscretization={timeDiscretization}
          onChange={updateTimeDiscretization}
          loading={loading}
          timeZone={'UTC'}
        />
      </SidebarContent>
      <BodyContent>
        <TimeDiscretizationBody/>
      </BodyContent>
    </>
  );
};

export default TimeDiscretizationContainer;
