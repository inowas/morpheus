import {IError} from '../types';
import {useEffect, useRef, useState} from 'react';

import {useApi} from '../incoming';
import {ITimeDiscretization} from '../types/TimeDiscretization.type';

interface IUseTimeDiscretization {
  timeDiscretization: ITimeDiscretization | null;
  updateTimeDiscretization: (timeDiscretization: ITimeDiscretization) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

export interface ITimeDiscretizationApi {
  start_date_time: string;
  end_date_time: string;
  time_unit: number;
  stress_periods: IStressPeriodResponse[];
}

interface IStressPeriodResponse {
  start_date_time: string;
  number_of_time_steps: number;
  time_step_multiplier: number;
  steady_state: boolean;
}

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
      const result = await httpGet<ITimeDiscretizationApi>(`/projects/${projectId}/model/time-discretization`);

      if (!isMounted.current) {
        return;
      }

      if (result.ok) {
        setTimeDiscretization({
          startDateTime: result.val.start_date_time,
          endDateTime: result.val.end_date_time,
          timeUnit: result.val.time_unit,
          stressPeriods: result.val.stress_periods.map((sp) => ({
            startDateTime: sp.start_date_time,
            numberOfTimeSteps: sp.number_of_time_steps,
            timeStepMultiplier: sp.time_step_multiplier,
            steadyState: sp.steady_state,
          })),
        });
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


  const updateTimeDiscretization = async (timeDiscretizationUdpate: ITimeDiscretization) => {

    if (!isMounted.current) {
      return;
    }

    if (!projectId) {
      return;
    }

    setLoading(true);
    setError(null);

    const timeDiscretizationPutRequest: ITimeDiscretizationApi = {
      start_date_time: timeDiscretizationUdpate.startDateTime,
      end_date_time: timeDiscretizationUdpate.endDateTime,
      time_unit: timeDiscretizationUdpate.timeUnit,
      stress_periods: timeDiscretizationUdpate.stressPeriods.map((sp) => ({
        start_date_time: sp.startDateTime,
        number_of_time_steps: sp.numberOfTimeSteps,
        time_step_multiplier: sp.timeStepMultiplier,
        steady_state: sp.steadyState,
      })),
    };


    const result = await httpPut<ITimeDiscretizationApi>(`/projects/${projectId}/model/time-discretization`, timeDiscretizationPutRequest);

    if (result.ok) {
      setTimeDiscretization(timeDiscretizationUdpate);
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
