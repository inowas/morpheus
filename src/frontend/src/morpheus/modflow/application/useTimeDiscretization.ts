import {IError, ITimeDiscretization} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useApi} from '../incoming';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';
import {setTimeDiscretization} from '../infrastructure/modelStore';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';

interface IUseTimeDiscretization {
  timeDiscretization: ITimeDiscretization | null;
  updateTimeDiscretization: (timeDiscretization: ITimeDiscretization) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

type ITimeDiscretizationGetResponse = ITimeDiscretization;

const useTimeDiscretization = (projectId: string): IUseTimeDiscretization => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

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

      setLoading(false);

      if (result.ok) {
        dispatch(setTimeDiscretization(result.val));
      }

      if (result.err) {
        setError({
          message: result.val.message,
          code: result.val.code,
        });
      }
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

    setLoading(true);
    setError(null);

    const result = await sendCommand<Commands.IUpdateModelTimeDiscretizationCommand>({
      command_name: 'update_model_time_discretization_command',
      payload: {
        project_id: projectId,
        start_date_time: data.start_date_time,
        end_date_time: data.end_date_time,
        stress_periods: data.stress_periods,
        time_unit: data.time_unit,
      },
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      dispatch(setTimeDiscretization(data));
    }

    if (result.err) {
      setError(result.val);
    }
  };

  return {
    timeDiscretization: model?.time_discretization || null,
    updateTimeDiscretization,
    loading,
    error,
  };
}
;

export default useTimeDiscretization;
export type {IUseTimeDiscretization};
