import {IError} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {useApi} from '../incoming';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';
import {setHeadObservations, addOrUpdateHeadObservation} from '../infrastructure/modelStore';
import {IObservation, IObservationId, IObservationType} from '../types/Observations.type';
import {Point} from 'geojson';

interface IUseObservations {
  observations: IObservation[];
  onAdd: (type: IObservationType, geometry: Point) => Promise<string | undefined>;
  onClone: (id: IObservationId) => Promise<string | undefined>;
  onDisable: (id: IObservationId) => Promise<void>;
  onEnable: (id: IObservationId) => Promise<void>;
  onUpdate: (observation: IObservation) => Promise<void>;
  onRemove: (id: IObservationId) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

type IGetHeadObservationsResponse = IObservation[];

const useObservations = (projectId: string): IUseObservations => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const fetchHeadObservations = async () => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await httpGet<IGetHeadObservationsResponse>(`/projects/${projectId}/model/head-observations`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      dispatch(setHeadObservations(result.val));
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
  };

  useEffect(() => {
    if (!projectId) {
      return;
    }

    fetchHeadObservations();

    return (): void => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, [projectId]);

  const fetchHeadObservation = async (headObservationId: IObservationId) => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await httpGet<IObservation>(`/projects/${projectId}/model/head-observations/${headObservationId}`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      dispatch(addOrUpdateHeadObservation(result.val));
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
  };

  const onAdd = async (type: IObservationType, geometry: Point) => {
    if (!model) {
      return;
    }

    const addCommand: Commands.IAddModelObservationCommand = {
      command_name: 'add_model_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        type: 'head',
        geometry,
      },
    };

    const result = await sendCommand<Commands.IAddModelObservationCommand>(addCommand);

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    if (result.ok) {
      const location = result.val;
      if (location) {
        const newObservationId =  location.split('/').pop();
        if (newObservationId) {
          await fetchHeadObservation(newObservationId);
          return newObservationId;
        }
      }
    }
  };

  const onClone = async (id: IObservationId) => {

    if (!model) {
      return;
    }

    const cloneCommand: Commands.ICloneModelObservationCommand = {
      command_name: 'clone_model_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        observation_id: id,
      },
    };

    const result = await sendCommand<Commands.ICloneModelObservationCommand>(cloneCommand);

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    if (result.ok) {
      const location = result.val;
      if (location) {
        const observationId = location.split('/').pop();
        if (observationId) {
          await fetchHeadObservation(observationId);
          return location.split('/').pop();
        }
      }
      await fetchHeadObservations();
    }
  };

  const onDisable = async (id: IObservationId) => {
    if (!model) {
      return;
    }

    const disableCommand: Commands.IDisableModelObservationCommand = {
      command_name: 'disable_model_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        observation_id: id,
      },
    };

    const result = await sendCommand<Commands.IDisableModelObservationCommand>(disableCommand);

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    if (result.ok) {
      await fetchHeadObservation(id);
    }
  };

  const onEnable = async (id: IObservationId) => {
    if (!model) {
      return;
    }

    const enableCommand: Commands.IEnableModelObservationCommand = {
      command_name: 'enable_model_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        observation_id: id,
      },
    };

    const result = await sendCommand<Commands.IEnableModelObservationCommand>(enableCommand);

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    if (result.ok) {
      await fetchHeadObservation(id);
    }
  };

  const onUpdate = async (observation: IObservation) => {
    if (!model) {
      return;
    }

    const updateCommand: Commands.IUpdateModelObservationCommand = {
      command_name: 'update_model_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        observation_id: observation.id,
        type: observation.type,
        name: observation.name,
        tags: observation.tags,
        geometry: observation.geometry,
        affected_cells: observation.affected_cells,
        affected_layers: observation.affected_layers,
        data: observation.data,
        enabled: observation.enabled,
      },
    };

    const result = await sendCommand<Commands.IUpdateModelObservationCommand>(updateCommand);

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    if (result.ok) {
      await fetchHeadObservation(observation.id);
    }
  };

  const onRemove = async (id: IObservationId) => {
    if (!model) {
      return;
    }

    const removeCommand: Commands.IRemoveModelObservationCommand = {
      command_name: 'remove_model_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        observation_id: id,
      },
    };

    const result = await sendCommand<Commands.IRemoveModelObservationCommand>(removeCommand);

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    if (result.ok) {
      await fetchHeadObservations();
    }
  };

  return {
    observations: model && model.observations ? model.observations : [],
    onAdd,
    onClone,
    onDisable,
    onEnable,
    onUpdate,
    onRemove,
    loading,
    error,
  };
};

export default useObservations;
export type {IUseObservations};
