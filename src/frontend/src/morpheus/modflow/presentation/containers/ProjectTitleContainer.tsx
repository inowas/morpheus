import React, {useState} from 'react';
import ProjectMetadataModal from '../components/ProjectMetadataModal';
import {useProjectMetadata, useProjectPrivileges} from '../../application';
import {useParams} from 'react-router-dom';
import {Header, Icon} from 'semantic-ui-react';
import {IMetadata} from '../../types';

// Show the ProjectMetadataModal component
// To create or edit a project
const ProjectTitleContainer = () => {

  const {projectId} = useParams();
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {metadata, updateMetadata, loading, error} = useProjectMetadata(projectId as string);

  const [open, setOpen] = useState(false);

  const handleUpdateMetadata = async (data: IMetadata) => {
    await updateMetadata(data);
    if (error) {
      return;
    }
    setOpen(false);
  };

  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div style={{marginRight: 10}}>
        <Header as={'h3'} style={{marginBottom: 0}}>{metadata?.name}</Header>
        <span>{metadata?.description}</span>
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
          metadata={metadata ? metadata : undefined}
          open={open}
          onCancel={() => setOpen(false)}
          loading={loading}
          onSubmit={handleUpdateMetadata}
          error={error ? error : undefined}
        />)}
    </div>
  );
};

export default ProjectTitleContainer;
