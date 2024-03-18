import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import {TimeDiscretizationContent, TimeDiscretizationBody} from '../components/TimeDiscretization';
import useTimeDiscretization from '../../application/useTimeDiscretization';
import {useParams} from 'react-router-dom';
import Loading from 'common/components/Loading';
import Error from 'common/components/Error';

const TimeDiscretizationContainer = () => {

  const {projectId} = useParams();
  const {timeDiscretization, updateTimeDiscretization, loading, error} = useTimeDiscretization(projectId);

  if (!projectId) {
    return null;
  }

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <SidebarContent maxWidth={600}>
        <TimeDiscretizationContent/>
      </SidebarContent>
      <BodyContent>
        <TimeDiscretizationBody/>
      </BodyContent>
    </>
  );
};

export default TimeDiscretizationContainer;
