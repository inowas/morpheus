import {IError} from '../types';
import {useRef, useState} from 'react';

import useProjectCommandBus, {Commands} from './useProjectCommandBus';

interface IUseProject {
  createProject: (name: string, description: string, tags: string[]) => Promise<string | undefined>;
  deleteProject: (projectId: string) => Promise<boolean>;
  loading: boolean;
  error?: IError;
}


const useProject = (): IUseProject => {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);


  const {sendCommand} = useProjectCommandBus();

  const createProject = async (name: string, description: string, tags: string[]): Promise<string | undefined> => {

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

  const deleteProject = async (projectId: string): Promise<boolean> => {
    if (!isMounted.current) {
      return false;
    }

    setLoading(true);
    setError(null);

    const deleteProjectCommand: Commands.IDeleteProjectCommand = {
      command_name: 'delete_project_command',
      payload: {
        project_id: projectId,
      },
    };

    const response = await sendCommand(deleteProjectCommand);

    if (!isMounted.current) {
      return false;
    }

    setLoading(false);

    if (response.err) {
      setError(response.val);
      return false;
    }

    return response.ok;
  };

  return {
    createProject,
    deleteProject,
    loading,
    error: error ? error : undefined,
  };
};

export default useProject;
export type {IUseProject};
