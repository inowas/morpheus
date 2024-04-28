import {IError} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useApi} from '../incoming';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';
import {ILayer, ILayerConfinement} from '../types/Layers.type';
import {setLayers} from '../infrastructure/modelStore';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';

interface IUseLayers {
  layers: ILayer[] | null;
  onCloneLayer: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onChangeLayerMetadata: (layerId: string, name?: string, description?: string) => void;
  onChangeLayerOrder: (newOrderIds: string[]) => void;
  onChangeLayerConfinement: (layerId: string, confinement: ILayerConfinement) => void;
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

  const fetchLayers = async () => {
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

  useEffect(() => {
    if (!projectId) {
      return;
    }

    fetchLayers();

    return (): void => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, [projectId]);

  const onChangeLayerOrder = async (newOrderIds: string[]) => {

    if (!model) {
      return;
    }

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

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateModelOrderResult = await sendCommand<Commands.IUpdateModelLayerOrderCommand>({
      command_name: 'update_model_layer_order_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        layer_ids: newOrderIds,
      },
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (updateModelOrderResult.err) {
      setError({
        message: updateModelOrderResult.val.message,
        code: updateModelOrderResult.val.code,
      });
      setLoading(false);
      return;
    }

    dispatch(setLayers(orderedLayers));
  };

  const onChangeLayerConfinement = async (layerId: string, confinement: ILayerConfinement) => {
    if (!model) {
      return;
    }

    const layer = model.layers.find((l) => l.layer_id === layerId);

    if (!layer) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateModelLayerConfinementResult = await sendCommand<Commands.IUpdateModelLayerConfinementCommand>({
      command_name: 'update_model_layer_confinement_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        layer_id: layerId,
        confinement,
      },
    });

    if (updateModelLayerConfinementResult.err) {
      setError({
        message: updateModelLayerConfinementResult.val.message,
        code: updateModelLayerConfinementResult.val.code,
      });
      setLoading(false);
      return;
    }

    setLoading(false);

    await fetchLayers();
  };

  const onChangeLayerMetadata = async (layerId: string, name?: string, description?: string) => {
    if (!model) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateModelLayerMetadataResult = await sendCommand<Commands.IUpdateModelLayerMetadataCommand>({
      command_name: 'update_model_layer_metadata_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        layer_id: layerId,
        name: name,
        description: description,
      },
    });

    if (updateModelLayerMetadataResult.err) {
      setError({
        message: updateModelLayerMetadataResult.val.message,
        code: updateModelLayerMetadataResult.val.code,
      });
      setLoading(false);
      return;
    }

    setLoading(false);

    await fetchLayers();
  };

  const onCloneLayer = async (layerId: string) => {
    if (!model) {
      return;
    }

    const layer = model.layers.find((l) => l.layer_id === layerId);

    if (!layer) {
      return;
    }

    setLoading(true);
    setError(null);

    const cloneLayerResult = await sendCommand<Commands.ICloneModelLayerCommand>({
      command_name: 'clone_model_layer_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        layer_id: layerId,
      },
    });

    if (cloneLayerResult.err) {
      setError({
        message: cloneLayerResult.val.message,
        code: cloneLayerResult.val.code,
      });
      setLoading(false);
      return;
    }

    setLoading(false);

    await fetchLayers();
  };

  const onDeleteLayer = async (layerId: string) => {
    if (!model) {
      return;
    }

    const layer = model.layers.find((l) => l.layer_id === layerId);

    if (!layer) {
      return;
    }

    setLoading(true);
    setError(null);

    const deleteLayerResult = await sendCommand<Commands.IDeleteModelLayerCommand>({
      command_name: 'delete_model_layer_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        layer_id: layerId,
      },
    });

    if (deleteLayerResult.err) {
      setError({
        message: deleteLayerResult.val.message,
        code: deleteLayerResult.val.code,
      });
      setLoading(false);
      return;
    }

    setLoading(false);

    await fetchLayers();
  };

  return {
    layers: model?.layers || null,
    onCloneLayer,
    onDeleteLayer,
    onChangeLayerConfinement,
    onChangeLayerMetadata,
    onChangeLayerOrder,
    loading,
    error,
  };
};

export default useLayers;
export type {IUseLayers};
