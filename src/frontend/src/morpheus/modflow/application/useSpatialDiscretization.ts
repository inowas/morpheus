import {IAffectedCells, IError, IGrid, ILengthUnit, ISpatialDiscretization} from '../types';
import {useEffect, useRef, useState} from 'react';

import {useApi} from '../incoming';
import {Feature, FeatureCollection, MultiPolygon, Point, Polygon} from 'geojson';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setSpatialDiscretization} from '../infrastructure/modelStore';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';

interface IUpdateGrid {
  n_cols: number;
  n_rows: number;
  origin?: Point
  col_widths?: number[];
  total_width?: number;
  row_heights?: number[];
  total_height?: number;
  rotation?: number;
  length_unit?: ILengthUnit;
}

interface IUseSpatialDiscretization {
  spatialDiscretization: ISpatialDiscretization | null;
  geometry: Polygon | null;
  grid: IGrid | null;
  fetchAffectedCellsGeometry: () => Promise<Feature<Polygon | MultiPolygon> | null>;
  fetchGridGeometry: () => Promise<FeatureCollection | null>;
  updateAffectedCells: (affectedCells: IAffectedCells) => void;
  updateGeometry: (geometry: Polygon) => void;
  updateGrid: (gridProps: IUpdateGrid) => void;
  loading: boolean;
  error: IError | null;
}

type ISpatialDiscretizationGetResponse = ISpatialDiscretization;

const useSpatialDiscretization = (projectId: string): IUseSpatialDiscretization => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const fetchSpatialDiscretization = async () => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await httpGet<ISpatialDiscretizationGetResponse>(`/projects/${projectId}/model/spatial-discretization`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      dispatch(setSpatialDiscretization(result.val));
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
  };

  useEffect(() => {
    fetchSpatialDiscretization();
    // eslint-disable-next-line
  }, []);

  const fetchGridGeometry = async (): Promise<FeatureCollection | null> => {
    const result = await httpGet<FeatureCollection>(`/projects/${projectId}/model/spatial-discretization/grid?format=geojson`);

    if (result.ok) {
      console.log(result.val);
      return result.val;
    }

    return null;
  };

  const fetchAffectedCellsGeometry = async (): Promise<Feature<Polygon | MultiPolygon> | null> => {
    const result = await httpGet<Feature<Polygon | MultiPolygon>>(`/projects/${projectId}/model/spatial-discretization/affected-cells?format=geojson_outline`);

    if (result.ok) {
      return result.val;
    }

    return null;
  };

  const updateGeometry = async (polygon: Polygon) => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await sendCommand<Commands.IUpdateModelGeometryCommand>({
      command_name: 'update_model_geometry_command',
      payload: {
        project_id: projectId,
        geometry: polygon,
      },
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      fetchSpatialDiscretization();
    }

    if (result.err) {
      setError(result.val);
    }
  };

  const updateGrid = async (gridProps: IUpdateGrid) => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);

    const result = await sendCommand<Commands.IUpdateModelGridCommand>({
      command_name: 'update_model_grid_command',
      payload: {
        project_id: projectId,
        n_cols: gridProps.n_cols,
        n_rows: gridProps.n_rows,
        origin: gridProps.origin,
        col_widths: gridProps.col_widths,
        total_width: gridProps.total_width,
        row_heights: gridProps.row_heights,
        total_height: gridProps.total_height,
        rotation: gridProps.rotation,
        length_unit: gridProps.length_unit as ILengthUnit | undefined,
      },
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      fetchSpatialDiscretization();
    }

    if (result.err) {
      setError(result.val);
    }
  };

  const updateAffectedCells = async (affectedCells: IAffectedCells) => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);

    const result = await sendCommand<Commands.IUpdateModelAffectedCellsCommand>({
      command_name: 'update_model_affected_cells_command',
      payload: {
        project_id: projectId,
        affected_cells: affectedCells,
      },
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      fetchSpatialDiscretization();
    }

    if (result.err) {
      setError(result.val);
    }
  };

  return {
    spatialDiscretization: model?.spatial_discretization || null,
    geometry: model?.spatial_discretization?.geometry || null,
    grid: model?.spatial_discretization?.grid || null,
    fetchAffectedCellsGeometry,
    fetchGridGeometry,
    updateAffectedCells,
    updateGeometry,
    updateGrid,
    loading,
    error,
  };
};

export default useSpatialDiscretization;
export type {IUseSpatialDiscretization};
