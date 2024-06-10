import {IAffectedCells, IError} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {IBoundary, IBoundaryId, IBoundaryObservationData, IBoundaryType, IObservation, IObservationId} from "../types/Boundaries.type";
import {useApi} from "../incoming";
import useProjectCommandBus, {Commands} from "./useProjectCommandBus";
import {setBoundaries, updateBoundary} from "../infrastructure/modelStore";
import {LineString, Point, Polygon} from "geojson";
import {ILayerId} from "../types/Layers.type";

interface IUseBoundaries {
  boundaries: IBoundary[];
  onAddBoundary: (boundary_type: IBoundaryType, geometry: Point | Polygon | LineString) => Promise<void>;
  onAddBoundaryObservation: (boundaryId: IBoundaryId, observationName: string, observationGeometry: Point, observationData: IBoundaryObservationData[]) => Promise<void>;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onCloneBoundaryObservation: (boundaryId: IBoundaryId, observationId: string) => Promise<void>;
  onDisableBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onEnableBoundary: (boundaryId: IBoundaryId) => Promise<void>
  onRemoveBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onRemoveBoundaryObservation: (boundaryId: IBoundaryId, observationId: string) => Promise<void>;
  onUpdateBoundaryAffectedCells: (boundaryId: IBoundaryId, affectedCells: IAffectedCells) => Promise<void>;
  onUpdateBoundaryAffectedLayers: (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => Promise<void>;
  onUpdateBoundaryGeometry: (boundaryId: IBoundaryId, geometry: Point | Polygon | LineString) => Promise<void>;
  onUpdateBoundaryMetadata: (boundaryId: IBoundaryId, boundaryName?: string, boundaryTags?: string[]) => Promise<void>;
  onUpdateBoundaryObservation: (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

type IGetBoundariesResponse = IBoundary[];

const useBoundaries = (projectId: string): IUseBoundaries => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const fetchAllBoundaries = async () => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await httpGet<IGetBoundariesResponse>(`/projects/${projectId}/model/boundaries`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      dispatch(setBoundaries(result.val));
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

    fetchAllBoundaries();

    return (): void => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, [projectId]);

  const fetchSingleBoundary = async (boundaryId: IBoundaryId) => {
    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await httpGet<IBoundary>(`/projects/${projectId}/model/boundaries/${boundaryId}`);

    console.log(result);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      dispatch(updateBoundary(result.val));
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
  }

  const onAddBoundary = async (boundary_type: IBoundaryType, geometry: Point | Polygon | LineString) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);


    const addBoundaryResult = await sendCommand<Commands.IAddModelBoundaryCommand>({
      command_name: 'add_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_type: boundary_type,
        boundary_geometry: geometry,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (addBoundaryResult.err) {
      setError({
        message: addBoundaryResult.val.message,
        code: addBoundaryResult.val.code,
      });
    }

    await fetchAllBoundaries();
  }

  const onAddBoundaryObservation = async (boundaryId: IBoundaryId, observationName: string, observationGeometry: Point, observationData: IBoundaryObservationData[]) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const addBoundaryObservationResult = await sendCommand<Commands.IAddModelBoundaryObservationCommand>({
      command_name: 'add_model_boundary_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        observation_name: observationName,
        observation_geometry: observationGeometry,
        observation_data: observationData,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (addBoundaryObservationResult.err) {
      setError({
        message: addBoundaryObservationResult.val.message,
        code: addBoundaryObservationResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onCloneBoundary = async (boundaryId: IBoundaryId) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const cloneBoundaryResult = await sendCommand<Commands.ICloneModelBoundaryCommand>({
      command_name: 'clone_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (cloneBoundaryResult.err) {
      setError({
        message: cloneBoundaryResult.val.message,
        code: cloneBoundaryResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onCloneBoundaryObservation = async (boundaryId: IBoundaryId, observationId: IObservationId) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const cloneBoundaryObservationResult = await sendCommand<Commands.ICloneModelBoundaryObservationCommand>({
      command_name: 'clone_model_boundary_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        observation_id: observationId,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (cloneBoundaryObservationResult.err) {
      setError({
        message: cloneBoundaryObservationResult.val.message,
        code: cloneBoundaryObservationResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onDisableBoundary = async (boundaryId: IBoundaryId) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const disableBoundaryResult = await sendCommand<Commands.IDisableModelBoundaryCommand>({
      command_name: 'disable_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (disableBoundaryResult.err) {
      setError({
        message: disableBoundaryResult.val.message,
        code: disableBoundaryResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onEnableBoundary = async (boundaryId: IBoundaryId) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const enableBoundaryResult = await sendCommand<Commands.IEnableModelBoundaryCommand>({
      command_name: 'enable_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (enableBoundaryResult.err) {
      setError({
        message: enableBoundaryResult.val.message,
        code: enableBoundaryResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onRemoveBoundary = async (boundaryId: IBoundaryId) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const removeBoundaryResult = await sendCommand<Commands.IRemoveModelBoundaryCommand>({
      command_name: 'remove_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (removeBoundaryResult.err) {
      setError({
        message: removeBoundaryResult.val.message,
        code: removeBoundaryResult.val.code,
      });
    }

    await fetchAllBoundaries();
  }

  const onRemoveBoundaryObservation = async (boundaryId: IBoundaryId, observationId: string) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const removeBoundaryObservationResult = await sendCommand<Commands.IRemoveModelBoundaryObservationCommand>({
      command_name: 'remove_model_boundary_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        observation_id: observationId,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (removeBoundaryObservationResult.err) {
      setError({
        message: removeBoundaryObservationResult.val.message,
        code: removeBoundaryObservationResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onUpdateBoundaryAffectedCells = async (boundaryId: IBoundaryId, affectedCells: IAffectedCells) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateBoundaryAffectedCellsResult = await sendCommand<Commands.IUpdateModelBoundaryAffectedCellsCommand>({
      command_name: 'update_model_boundary_affected_cells_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        affected_cells: affectedCells,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (updateBoundaryAffectedCellsResult.err) {
      setError({
        message: updateBoundaryAffectedCellsResult.val.message,
        code: updateBoundaryAffectedCellsResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onUpdateBoundaryAffectedLayers = async (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateBoundaryAffectedLayersResult = await sendCommand<Commands.IUpdateModelBoundaryAffectedLayersCommand>({
      command_name: 'update_model_boundary_affected_layers_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        affected_layers: affectedLayers,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (updateBoundaryAffectedLayersResult.err) {
      setError({
        message: updateBoundaryAffectedLayersResult.val.message,
        code: updateBoundaryAffectedLayersResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onUpdateBoundaryGeometry = async (boundaryId: IBoundaryId, geometry: Point | Polygon | LineString) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateBoundaryGeometryResult = await sendCommand<Commands.IUpdateModelBoundaryGeometryCommand>({
      command_name: 'update_model_boundary_geometry_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        geometry: geometry,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (updateBoundaryGeometryResult.err) {
      setError({
        message: updateBoundaryGeometryResult.val.message,
        code: updateBoundaryGeometryResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onUpdateBoundaryMetadata = async (boundaryId: IBoundaryId, boundaryName?: string, boundaryTags?: string[]) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateBoundaryMetadataResult = await sendCommand<Commands.IUpdateModelBoundaryMetadataCommand>({
      command_name: 'update_model_boundary_metadata_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        boundary_name: boundaryName,
        boundary_tags: boundaryTags,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (updateBoundaryMetadataResult.err) {
      setError({
        message: updateBoundaryMetadataResult.val.message,
        code: updateBoundaryMetadataResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  const onUpdateBoundaryObservation = async (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateBoundaryObservationResult = await sendCommand<Commands.IUpdateModelBoundaryObservationCommand>({
      command_name: 'update_model_boundary_observation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        boundary_type: boundaryType,
        observation_id: observation.observation_id,
        observation_name: observation.observation_name,
        observation_geometry: observation.geometry,
        observation_data: observation.data,
      }
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (updateBoundaryObservationResult.err) {
      setError({
        message: updateBoundaryObservationResult.val.message,
        code: updateBoundaryObservationResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  }

  return {
    boundaries: model?.boundaries || [],
    onAddBoundary,
    onAddBoundaryObservation,
    onCloneBoundary,
    onCloneBoundaryObservation,
    onDisableBoundary,
    onEnableBoundary,
    onRemoveBoundary,
    onRemoveBoundaryObservation,
    onUpdateBoundaryAffectedCells,
    onUpdateBoundaryAffectedLayers,
    onUpdateBoundaryGeometry,
    onUpdateBoundaryMetadata,
    onUpdateBoundaryObservation,
    loading,
    error,
  };
};

export default useBoundaries;
export type {IUseBoundaries};
