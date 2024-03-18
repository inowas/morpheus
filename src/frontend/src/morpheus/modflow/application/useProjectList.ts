import {IError, IProjectListItem} from '../types';
import {useEffect, useRef, useState} from 'react';

import {useApi} from '../incoming';

interface IUseProjectSummaries {
  projects: IProjectListItem[];
  loading: boolean;
  error: IError | null;
}

const useProjectList = (): IUseProjectSummaries => {
  const isMounted = useRef(true);
  const [projects, setProjects] = useState<IProjectListItem[]>([]);
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

export default useProjectList;
