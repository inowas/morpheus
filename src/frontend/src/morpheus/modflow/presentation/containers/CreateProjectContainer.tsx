import React from 'react';
import CreateProjectModal from '../components/CreateProjectModal';
import {useProject} from '../../application';
import {useNavigate} from 'common/hooks';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const CreateProjectContainer = ({open, onClose}: IProps) => {

  const {createProject, loading, error} = useProject();
  const navigate = useNavigate();

  const handleSubmit = async (name: string, description: string, tags: string[]) => {
    const projectId = await createProject(name, description, tags);
    if (projectId) {
      navigate(`/projects/${projectId}`);
      onClose();
    }
  };

  return (
    <CreateProjectModal
      open={open}
      onCancel={onClose}
      loading={loading}
      onSubmit={handleSubmit}
      error={error}
    />
  );

};

export default CreateProjectContainer;
