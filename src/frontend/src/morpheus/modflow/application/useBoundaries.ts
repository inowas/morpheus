import {IAffectedCells, IError} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {IBoundary, IBoundaryId, IBoundaryObservationValue, IBoundaryType, IInterpolationType, IObservation, IObservationId} from '../types/Boundaries.type';
import {useApi} from '../incoming';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';
import {setBoundaries, updateBoundary} from '../infrastructure/modelStore';
import {Feature, LineString, MultiPolygon, Point, Polygon} from 'geojson';
import {ILayerId} from '../types/Layers.type';
import {IImportItem} from '../types/Import.type';

interface IUseBoundaries {
  boundaries: IBoundary[];
  fetchAffectedCellsGeometry: (boundaryId: IBoundaryId) => Promise<Feature<Polygon | MultiPolygon> | null>;
  onAddBoundary: (boundary_type: IBoundaryType, geometry: Point | Polygon | LineString) => Promise<IBoundaryId | undefined>;
  onAddBoundaryObservation: (boundaryId: IBoundaryId, observationName: string, observationGeometry: Point, observationData: IBoundaryObservationValue[]) => Promise<void>;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onCloneBoundaryObservation: (boundaryId: IBoundaryId, observationId: string) => Promise<void>;
  onDisableBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onEnableBoundary: (boundaryId: IBoundaryId) => Promise<void>
  onImportBoundaries: (items: IImportItem[]) => Promise<void>;
  onRemoveBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onRemoveBoundaryObservation: (boundaryId: IBoundaryId, observationId: string) => Promise<void>;
  onUpdateBoundaryAffectedCells: (boundaryId: IBoundaryId, affectedCells: IAffectedCells) => Promise<void>;
  onUpdateBoundaryAffectedLayers: (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => Promise<void>;
  onUpdateBoundaryGeometry: (boundaryId: IBoundaryId, geometry: Point | Polygon | LineString) => Promise<void>;
  onUpdateBoundaryInterpolation: (boundaryId: IBoundaryId, interpolation: IInterpolationType) => Promise<void>;
  onUpdateBoundaryMetadata: (boundaryId: IBoundaryId, boundaryName?: string, boundaryTags?: string[]) => Promise<void>;
  onUpdateBoundaryObservation: (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

type IGetBoundariesResponse = IBoundary[];

const useBoundaries = (projectId: string): IUseBoundaries => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const boundaries = model?.boundaries || [];

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
  };

  const fetchAffectedCellsGeometry = async (boundaryId: IBoundaryId): Promise<Feature<Polygon | MultiPolygon> | null> => {
    const result = await httpGet<Feature<Polygon | MultiPolygon>>(`/projects/${projectId}/model/boundaries/${boundaryId}/affected_cells?format=geojson_outline`);

    if (result.ok) {
      return result.val;
    }

    return null;
  };

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
      },
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (addBoundaryResult.ok) {
      await fetchAllBoundaries();
      const location = addBoundaryResult.val;
      if (location) {
        return location.split('/').pop() || undefined;
      }
    }

    if (addBoundaryResult.err) {
      setError({
        message: addBoundaryResult.val.message,
        code: addBoundaryResult.val.code,
      });
    }
  };

  const onAddBoundaryObservation = async (boundaryId: IBoundaryId, observationName: string, observationGeometry: Point, observationData: IBoundaryObservationValue[]) => {
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
      },
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
  };

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
      },
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

    await fetchAllBoundaries();
  };

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
      },
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
  };

  const onDisableBoundary = async (boundaryId: IBoundaryId) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    // to have a better user experience, we enable the boundary in the frontend first
    // this method is an optimistic update and will be reverted if the command fails
    // because fetchSingleBoundary will be called in any case
    const boundary = boundaries.find((b) => b.id === boundaryId);
    if (boundary) {
      dispatch(updateBoundary({...boundary, enabled: false}));
    }

    const disableBoundaryResult = await sendCommand<Commands.IDisableModelBoundaryCommand>({
      command_name: 'disable_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
      },
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
  };

  const onEnableBoundary = async (boundaryId: IBoundaryId) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    // to have a better user experience, we enable the boundary in the frontend first
    // this method is an optimistic update and will be reverted if the command fails
    // because fetchSingleBoundary will be called in any case
    const boundary = boundaries.find((b) => b.id === boundaryId);
    if (boundary) {
      dispatch(updateBoundary({...boundary, enabled: true}));
    }

    const enableBoundaryResult = await sendCommand<Commands.IEnableModelBoundaryCommand>({
      command_name: 'enable_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
      },
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
  };

  const onImportBoundaries = async (items: IImportItem[]) => {
    if (!model) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const command: Commands.IImportModelBoundariesCommand = {
      command_name: 'import_model_boundaries_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundaries: items,
      },
    };

    const result = await sendCommand<Commands.IImportModelBoundariesCommand>(command);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    if (result.ok) {
      await fetchAllBoundaries();
    }
  };

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
      },
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
  };

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
      },
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
  };

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
      },
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
  };

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
      },
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
  };

  const onUpdateBoundaryGeometry = async (boundaryId: IBoundaryId, geometry: Point | Polygon | LineString) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    // to have a better user experience, we enable the boundary in the frontend first
    // this method is an optimistic update and will be reverted if the command fails
    // because fetchSingleBoundary will be called in any case
    const boundary = boundaries.find((b) => b.id === boundaryId);
    if (boundary) {
      dispatch(updateBoundary({...boundary, geometry: geometry as any}));
    }


    const updateBoundaryGeometryResult = await sendCommand<Commands.IUpdateModelBoundaryGeometryCommand>({
      command_name: 'update_model_boundary_geometry_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        geometry: geometry,
      },
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
  };

  const onUpdateBoundaryInterpolation = async (boundaryId: IBoundaryId, interpolation: IInterpolationType) => {
    if (!model || !projectId) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const updateBoundaryInterpolationResult = await sendCommand<Commands.IUpdateModelBoundaryInterpolationCommand>({
      command_name: 'update_model_boundary_interpolation_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
        interpolation: interpolation,
      },
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (updateBoundaryInterpolationResult.err) {
      setError({
        message: updateBoundaryInterpolationResult.val.message,
        code: updateBoundaryInterpolationResult.val.code,
      });
    }

    await fetchSingleBoundary(boundaryId);
  };

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
      },
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
  };

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
      },
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
  };

  return {
    boundaries,
    fetchAffectedCellsGeometry,
    onAddBoundary,
    onAddBoundaryObservation,
    onCloneBoundary,
    onCloneBoundaryObservation,
    onDisableBoundary,
    onEnableBoundary,
    onImportBoundaries,
    onRemoveBoundary,
    onRemoveBoundaryObservation,
    onUpdateBoundaryAffectedCells,
    onUpdateBoundaryAffectedLayers,
    onUpdateBoundaryGeometry,
    onUpdateBoundaryInterpolation,
    onUpdateBoundaryMetadata,
    onUpdateBoundaryObservation,
    loading,
    error,
  };
};

export default useBoundaries;
export type {IUseBoundaries};
