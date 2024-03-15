import {IError} from '../types';
import {useEffect, useRef, useState} from 'react';

import {useApi} from '../incoming';

interface IUseProjectMetadata {
  metadata: any;
  loading: boolean;
  error: IError | null;
}

const useProjectMetadata = (projectId: string | undefined): IUseProjectMetadata => {
  const isMounted = useRef(true);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const fetch = async () => {
      if (!isMounted.current) {
        return;
      }
      setLoading(true);
      setError(null);
      const result = await httpGet<any>(`/projects/${projectId}/metadata`);

      if (!isMounted.current) {
        return;
      }

      if (result.ok) {
        setMetadata(result.val);
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
  }, [projectId]);

  return {
    metadata,
    loading,
    error,
  };
};

export default useProjectMetadata;
