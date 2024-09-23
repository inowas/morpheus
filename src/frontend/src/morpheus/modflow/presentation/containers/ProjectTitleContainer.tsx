import React, {useState} from 'react';
import ProjectMetadataModal from '../components/ProjectMetadataModal';
import {useProjectMetadata, useProjectPrivileges} from '../../application';
import {useParams} from 'react-router-dom';
import {Header, Icon} from 'semantic-ui-react';

// Show the ProjectMetadataModal component
// To create or edit a project
const ProjectTitleContainer = () => {

  const {projectId} = useParams();
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {metadata, updateMetadata, loading, error} = useProjectMetadata(projectId as string);

  const [open, setOpen] = useState(false);

  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div>
        <Header as={'h3'}>{metadata?.name}</Header>
        <Header as={'h5'}>{metadata?.description}</Header>
      </div>
      <div>
        {!isReadOnly && (
          <Icon
            name="edit"
            onClick={() => setOpen(true)}
            style={{cursor: 'pointer'}}
          />)}
      </div>
      {open && !isReadOnly && (
        <ProjectMetadataModal
          metadata={metadata}
          open={open}
          onCancel={() => setOpen(false)}
          loading={loading}
          onSubmit={updateMetadata}
          error={error ? error : undefined}
        />)}
    </div>
  );
};

export default ProjectTitleContainer;
