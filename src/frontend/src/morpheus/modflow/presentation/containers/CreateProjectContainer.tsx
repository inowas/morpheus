import React from 'react';
import CreateProjectModal from '../components/CreateProjectModal';
import {useCreateProject} from '../../application';
import {useNavigate} from 'common/hooks';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const CreateProjectContainer = ({open, onClose}: IProps) => {

  const {createProject, loading, error} = useCreateProject();
  const navigate = useNavigate();

  const handleSubmit = async (name: string, description: string, keywords: string[]) => {
    const projectId = await createProject({name, description, keywords});

    if (projectId) {
      onClose();
      navigate(`/projects/${projectId}`);
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
