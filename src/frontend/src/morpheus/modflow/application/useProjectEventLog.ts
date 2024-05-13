import {IError} from '../types';
import {useEffect, useRef, useState} from 'react';

import {useApi} from '../incoming';

interface IEvent {
  event_name: string;
  occurred_at: string;
  payload: object;
}

interface IUseProjectEventLog {
  events: IEvent[];
  loading: boolean;
  error: IError | null;
}

const useProjectEventLog = (projectId: string): IUseProjectEventLog => {
  const isMounted = useRef(true);
  const [events, setEvents] = useState<any[]>([]);
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
      const result = await httpGet<IEvent[]>(`/projects/${projectId}/event-log`);

      if (!isMounted.current) {
        return;
      }

      if (result.ok) {
        setEvents(result.val.reverse());
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
    events,
    loading,
    error,
  };
};

export default useProjectEventLog;
