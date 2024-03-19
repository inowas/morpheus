import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import {TimeDiscretizationBody, TimeDiscretizationContent} from '../components/TimeDiscretization';
import useTimeDiscretization from '../../application/useTimeDiscretization';
import {useParams} from 'react-router-dom';
import Error from 'common/components/Error';

const TimeDiscretizationContainer = () => {

  const {projectId} = useParams();
  const {timeDiscretization, updateTimeDiscretization, loading, error} = useTimeDiscretization(projectId);

  if (!projectId) {
    return null;
  }

  if (!timeDiscretization) {
    return null;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <SidebarContent maxWidth={700}>
        <TimeDiscretizationContent
          timeDiscretization={timeDiscretization}
          onChange={updateTimeDiscretization}
          loading={loading}
        />
      </SidebarContent>
      <BodyContent>
        <TimeDiscretizationBody/>
      </BodyContent>
    </>
  );
};

export default TimeDiscretizationContainer;
