import {useEffect, useRef, useState} from 'react';

import {useApi} from '../incoming';
import {IError, IProjectSummary} from '../types';


interface IUseProjectSummaries {
  projects: IProjectSummary[];
  loading: boolean;
  error: IError | null;
}

const useProjectSummaries = (): IUseProjectSummaries => {
  const isMounted = useRef(true);
  const [projects, setProjects] = useState<IProjectSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();

  useEffect(() => {
    const fetch = async () => {
      if (!isMounted.current) {
        return;
      }
      setLoading(true);
      setError(null);
      const result = await httpGet<any>('/projects');

      if (!isMounted.current) {
        return;
      }

      if (result.ok) {
        setProjects(result.val);
      }

      if (result.err) {
        setError({
          message: result.val.message,
          code: result.val.code,
        });
      }

      setLoading(false);
    };

    fetch();

    return (): void => {
      isMounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    projects,
    loading,
    error,
  };
};

export default useProjectSummaries;

