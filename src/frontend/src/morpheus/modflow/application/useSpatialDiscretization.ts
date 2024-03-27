import {IError, ILengthUnit, ISpatialDiscretization} from '../types';
import {useEffect, useRef, useState} from 'react';

import {useApi} from '../incoming';
import {Polygon} from 'geojson';

interface IUseSpatialDiscretization {
  spatialDiscretization: ISpatialDiscretization | null;
  updateSpatialDiscretization: (data: ISpatialDiscretization) => void;
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


  const isMounted = useRef(true);
  const [spatialDiscretization, setSpatialDiscretization] = useState<ISpatialDiscretization | null>(null);
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

    if (result.ok) {
      setSpatialDiscretization({
        geometry: result.val.geometry,
        grid: result.val.grid,
        affected_cells: result.val.affected_cells,
      });
    }

    if (result.err && 404 !== result.val.code) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    setLoading(false);
  };

  const updateSpatialDiscretization = async (data: ISpatialDiscretization) => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await httpPut<ISpatialDiscretization>(`/projects/${projectId}/model/spatial-discretization`, data);

    if (!isMounted.current) {
      return;
    }

    if (result.ok) {
      setSpatialDiscretization(data);
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }

    setLoading(false);

  };

  useEffect(() => {

    if (!projectId) {
      return;
    }

    fetchSpatialDiscretization();

    return (): void => {
      isMounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return {
    spatialDiscretization,
    updateSpatialDiscretization,
    loading,
    error,
  };
};

export default useSpatialDiscretization;
