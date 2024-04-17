import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import {useProjectMetadata} from '../../application';
import {ProjectMetadataBody, ProjectMetadataContent} from '../components/ProjectMetadata';
import Error from 'common/components/Error';
import Loading from 'common/components/Loading';
import {useParams} from 'react-router-dom';


const ProjectMetadataContainer = () => {

  const {id} = useParams<{ id: string; }>();

  const {metadata, loading, error} = useProjectMetadata(id as string);
  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <SidebarContent maxWidth={650}>
        <ProjectMetadataContent content={metadata}/>
      </SidebarContent>
      <BodyContent>
        <ProjectMetadataBody/>
      </BodyContent>
    </>
  );
};

export default ProjectMetadataContainer;
