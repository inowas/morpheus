import {IError} from '../types';
import {useRef, useState} from 'react';

import useProjectCommandBus, {Commands} from './useProjectCommandBus';

interface IUseCreateProject {
  createProject: (name: string, description: string, tags: string[]) => Promise<string | undefined>;
  loading: boolean;
  error?: IError;
}


type IProjectId = string;

const useCreateProject = (): IUseCreateProject => {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);


  const {sendCommand} = useProjectCommandBus();

  const createProject = async (name: string, description: string, tags: string[]): Promise<IProjectId | undefined> => {

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const createProjectCommand: Commands.ICreateProjectCommand = {
      command_name: 'create_project_command',
      payload: {name, description, tags},
    };


    const response = await sendCommand(createProjectCommand);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.err) {
      setError(response.val);
      return;
    }

    if (response.ok) {
      return response.val?.split('/').pop();
    }
  };

  return {
    createProject,
    loading,
    error: error ? error : undefined,
  };
};

export default useCreateProject;
