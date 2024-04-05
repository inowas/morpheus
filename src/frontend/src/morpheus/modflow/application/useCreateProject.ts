import {ICreateProjectCommand, IError} from '../types';
import {useRef, useState} from 'react';

import {useApi} from '../incoming';

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


  const {httpPost} = useApi();

  const createProject = async (name: string, description: string, tags: string[]): Promise<IProjectId | undefined> => {

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const createProjectCommand: ICreateProjectCommand = {
      command_name: 'create_project_command',
      payload: {name, description, tags},
    };


    const response = await httpPost<ICreateProjectCommand>('/projects/messagebox', createProjectCommand);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.err) {
      setError(response.val);
      return;
    }

    if (response.ok) {
      return response.val.location?.split('/').pop();
    }
  };


  return {
    createProject,
    loading,
    error: error ? error : undefined,
  };
};

export default useCreateProject;
