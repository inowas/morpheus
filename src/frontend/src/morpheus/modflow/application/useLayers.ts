import {IError} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useApi} from '../incoming';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';
import {ILayer} from '../types/Layers.type';
import {setLayers} from '../infrastructure/modelStore';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';

interface IUseLayers {
  layers: ILayer[] | null;
  onOrderChange: (newOrderIds: string[]) => void;
  loading: boolean;
  error: IError | null;
}

type IGetLayersResponse = ILayer[];

const useLayers = (projectId: string): IUseLayers => {

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
      const result = await httpGet<IGetLayersResponse>(`/projects/${projectId}/model/layers`);

      if (!isMounted.current) {
        return;
      }

      setLoading(false);

      if (result.ok) {
        dispatch(setLayers(result.val));
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

  const onOrderChange = async (newOrderIds: string[]) => {
    const layers = model?.layers || [];

    let success = true;
    if (layers.length !== newOrderIds.length) {
      success = false;
      return;
    }

    const orderedLayers = newOrderIds.map((id) => {
      const layer = layers.find((l) => l.layer_id === id);
      if (!layer) {
        success = false;
        return null;
      }
      return layer;
    }) as ILayer[];

    if (!success) {
      return;
    }

    // send_command to update the order of the layers
    // const newOrder = orderedLayers.map((l) => l.layer_id);

    dispatch(setLayers(orderedLayers));
  };

  return {
    layers: model?.layers || null,
    onOrderChange,
    loading,
    error,
  };
};

export default useLayers;
export type {IUseLayers};
