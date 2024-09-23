import React from 'react';
import ProjectMetadataModal from '../components/ProjectMetadataModal';
import {useProject} from '../../application';
import {useNavigate} from 'common/hooks';
import {IMetadata} from '../../types';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const CreateProjectContainer = ({open, onClose}: IProps) => {

  const {createProject, loading, error} = useProject();
  const navigate = useNavigate();

  const handleSubmit = async (md: IMetadata) => {
    const projectId = await createProject(md.name, md.description, md.tags);
    if (projectId) {
      navigate(`/projects/${projectId}`);
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <ProjectMetadataModal
      open={open}
      onCancel={onClose}
      loading={loading}
      onSubmit={handleSubmit}
      error={error}
    />
  );
};

export default CreateProjectContainer;
