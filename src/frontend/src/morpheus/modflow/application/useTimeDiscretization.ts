import {IError, ITimeDiscretization} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useApi} from '../incoming';

interface IUseTimeDiscretization {
  timeDiscretization: ITimeDiscretization | null;
  updateTimeDiscretization: (timeDiscretization: ITimeDiscretization) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

type ITimeDiscretizationPutRequest = ITimeDiscretization;
type ITimeDiscretizationGetResponse = ITimeDiscretization;

const useTimeDiscretization = (projectId: string | undefined): IUseTimeDiscretization => {

  const isMounted = useRef(true);
  const [timeDiscretization, setTimeDiscretization] = useState<ITimeDiscretization | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet, httpPut} = useApi();

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
      const result = await httpGet<ITimeDiscretizationGetResponse>(`/projects/${projectId}/model/time-discretization`);

      if (!isMounted.current) {
        return;
      }

      if (result.ok) {
        setTimeDiscretization(result.val);
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

    // eslint-disable-next-line
  }, [projectId]);


  const updateTimeDiscretization = async (data: ITimeDiscretization) => {

    if (!isMounted.current) {
      return;
    }

    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(null);


    const result = await httpPut<ITimeDiscretizationPutRequest>(`/projects/${projectId}/model/time-discretization`, data);

    if (result.ok) {
      setTimeDiscretization(data);
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
    setLoading(false);

  };

  return {
    timeDiscretization,
    updateTimeDiscretization,
    loading,
    error,
  };
};

export default useTimeDiscretization;
