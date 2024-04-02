import {IError, IGrid, ILengthUnit, ISpatialDiscretization} from '../types';
import {useRef, useState} from 'react';

import {useApi} from '../incoming';
import {Point, Polygon} from 'geojson';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setSpatialDiscretization} from '../infrastructure/modelStore';

interface IUpdateGeometry {
  geometry: Polygon;
}

interface IUpdateGrid {
  n_cols: number;
  n_rows: number;
  origin?: Point
  col_widths?: number[];
  total_width?: number;
  row_heights?: number[];
  total_height?: number;
  rotation?: number;
  length_unit: ILengthUnit;
}

interface IUseSpatialDiscretization {
  spatialDiscretization: ISpatialDiscretization | null;
  geometry: Polygon | null;
  grid: IGrid | null;
  updateGeometry: (geometry: Polygon) => void;
  updateGrid: (gridProps: IUpdateGrid) => void;
  loading: boolean;
  error: IError | null;
}

export interface ICreateGrid {
  n_cols: number;
  n_rows: number;
  rotation: number;
  length_unit: ILengthUnit;
}

export interface ISpatialDiscretizationPutRequest {
  geometry: Polygon;
  grid: ICreateGrid;
  length_unit: ILengthUnit;
}

type ISpatialDiscretizationGetResponse = ISpatialDiscretization;

const useSpatialDiscretization = (projectId: string | undefined): IUseSpatialDiscretization => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet, httpPut} = useApi();

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

  const updateGeometry = async (polygon: Polygon) => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await httpPut<IUpdateGeometry>(`/projects/${projectId}/model/spatial-discretization/geometry`, {
      geometry: polygon,
    });

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      fetchSpatialDiscretization();
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
  };

  const updateGrid = async (gridProps: IUpdateGrid) => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await httpPut<IUpdateGrid>(`/projects/${projectId}/model/spatial-discretization/grid`, gridProps);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      fetchSpatialDiscretization();
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
  };

  return {
    spatialDiscretization: model?.spatial_discretization || null,
    geometry: model?.spatial_discretization?.geometry || null,
    grid: model?.spatial_discretization?.grid || null,
    updateGeometry,
    updateGrid,
    loading,
    error,
  };
};

export default useSpatialDiscretization;
