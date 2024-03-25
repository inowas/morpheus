import {IError} from '../types';
import {useRef, useState} from 'react';

import {useApi} from '../incoming';

interface IUseCreateProject {
  createProject: (createProject: ICreateProject) => Promise<IProjectId | undefined>;
  loading: boolean;
  error?: IError;
}

interface ICreateProject {
  name: string;
  description: string;
  keywords: string[];
}

type IProjectId = string;

const useCreateProject = (): IUseCreateProject => {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);


  const {httpPost} = useApi();

  const createProject = async (createProject: ICreateProject): Promise<IProjectId | undefined> => {

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);


    const response = await httpPost<ICreateProject>('/projects', createProject);

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
